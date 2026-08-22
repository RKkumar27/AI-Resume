const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { getRealJobs } = require('../services/jobProviderService');
const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_SERVICE_URL || 'http://localhost:8000';

/**
 * GET /api/jobs/recommendations
 * Fetches real current jobs from the configured provider, compares each job against
 * the candidate's active uploaded resume, and returns dynamically scored recommendations.
 */
const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // 1. Identify Candidate's Active Primary Resume
    const activeResume = await Resume.findOne({ userId, isPrimary: true }) || await Resume.findOne({ userId }).sort({ createdAt: -1 });

    const userSkills = activeResume?.skills || [];
    const resumeText = activeResume?.extractedText || '';
    const targetRole = req.query.role || user?.targetRole || 'Software Engineer';

    console.log(`[Job Controller Telemetry]: Fetching real jobs for target role: "${targetRole}", Candidate active skills: ${userSkills.length}`);

    // 2. Fetch Real Jobs from Configured Provider (ArbeitNow / Remotive)
    const realJobs = await getRealJobs(targetRole);

    if (!realJobs || realJobs.length === 0) {
      return res.status(200).json({
        status: 'success',
        count: 0,
        provider: process.env.JOB_PROVIDER || 'ArbeitNow',
        data: []
      });
    }

    const candidateSkillSet = new Set(userSkills.map(s => String(s).toLowerCase()));

    // 3. Compute Real Match Score for Every Job relative to Candidate's Active Resume
    const scoredJobs = await Promise.all(realJobs.map(async (job) => {
      const required = job.requiredSkills || [];
      const matchedSkills = [];
      const missingSkills = [];

      required.forEach(reqSkill => {
        if (candidateSkillSet.has(String(reqSkill).toLowerCase())) {
          matchedSkills.push(reqSkill);
        } else {
          missingSkills.push(reqSkill);
        }
      });

      const skillMatchRatio = required.length > 0 ? (matchedSkills.length / required.length) : 0.5;

      // Call FastAPI for TF-IDF Text Similarity if available, otherwise compute weighted skill ratio
      let tfidfSim = 0.4;
      let finalMatchScore = Math.round(Math.max(15, Math.min(98, skillMatchRatio * 85 + 15)));

      try {
        const aiMatchRes = await axios.post(`${FASTAPI_URL}/api/match-job`, {
          job_title: job.title,
          job_description: job.description,
          resume_text: resumeText || userSkills.join(' ')
        }, { timeout: 3000 });

        if (aiMatchRes.data && aiMatchRes.data.match_score) {
          finalMatchScore = aiMatchRes.data.match_score;
          tfidfSim = aiMatchRes.data.tfidf_similarity || 0.4;
        }
      } catch (aiErr) {
        // Fallback to internal weighted match score
      }

      return {
        _id: job._id,
        externalJobId: job.externalJobId,
        provider: job.provider || 'ArbeitNow',
        originalUrl: job.originalUrl,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType || 'Remote',
        salary: job.salary,
        description: job.description,
        requiredSkills: required,
        matchedSkills: matchedSkills,
        missingSkills: missingSkills,
        matchScore: finalMatchScore,
        tfidfSimilarity: tfidfSim,
        postedAt: job.postedAt
      };
    }));

    // Sort highest match percentage first
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      status: 'success',
      count: scoredJobs.length,
      provider: process.env.JOB_PROVIDER || 'ArbeitNow',
      activeResumeFilename: activeResume?.filename || 'No Active Resume',
      data: scoredJobs
    });
  } catch (error) {
    console.error('[Job Recommendations Controller Error]:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * GET /api/jobs
 */
const getJobs = async (req, res) => {
  try {
    const query = req.query.q || 'Engineer';
    const jobs = await getRealJobs(query);
    res.status(200).json({ status: 'success', count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getJobRecommendations, getJobs };
