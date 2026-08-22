const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { parseDocumentText } = require('../services/parserService');
const { analyzeResumeTextNode } = require('../services/analyzerService');
const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_SERVICE_URL || 'http://localhost:8000';

/**
 * GET /api/resumes
 * Retrieves all uploaded resumes for the authenticated user,
 * joined with their corresponding Analysis documents.
 */
const getResumes = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    const resumesWithAnalysis = await Promise.all(
      resumes.map(async (r) => {
        const analysis = await Analysis.findOne({ resumeId: r._id });
        return {
          ...r.toObject(),
          analysis: analysis || null
        };
      })
    );

    res.status(200).json({ status: 'success', count: resumesWithAnalysis.length, data: resumesWithAnalysis });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * POST /api/resumes/upload
 * Handles PDF/DOCX file uploads, extracts document text, calls FastAPI AI scoring engine
 * (or fallback Node analyzer), and persists Resume & Analysis records in MongoDB.
 */
const uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;
    let filename = 'Uploaded_Resume.pdf';
    let filePath = '';
    let extractedText = '';

    if (req.file) {
      filename = req.file.originalname;
      filePath = req.file.path;
      extractedText = await parseDocumentText(filePath, filename);
    } else if (req.body.extractedText) {
      filename = req.body.filename || 'Pasted_Resume.pdf';
      extractedText = req.body.extractedText;
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'No resume file or extracted text provided.'
      });
    }

    console.log(`[Resume Controller Telemetry]: Processing upload for User ${userId}, File: "${filename}", Text Length: ${extractedText.length}`);

    // Call FastAPI AI Service with fallback to Node analyzer
    let aiResult = null;
    try {
      const aiResponse = await axios.post(`${FASTAPI_URL}/api/analyze-resume`, {
        resume_text: extractedText,
        filename: filename
      }, { timeout: 4000 });

      if (aiResponse.data) {
        aiResult = aiResponse.data;
        console.log(`[Resume Controller Telemetry]: FastAPI AI Analysis Success! Score: ${aiResult.ats_score}/100, Extracted Skills: ${aiResult.extracted_skills?.length || 0}`);
      }
    } catch (aiErr) {
      console.warn('[Resume Controller Warning]: FastAPI AI service offline/timed out. Executing Node.js fallback analyzer:', aiErr.message);
      aiResult = analyzeResumeTextNode(extractedText);
    }

    // Set new resume as primary active resume
    await Resume.updateMany({ userId }, { isPrimary: false });

    // Save Resume Document in MongoDB with skills Array
    const resume = await Resume.create({
      userId,
      filename: filename,
      fileUrl: filePath ? `/uploads/${req.file.filename}` : '',
      extractedText: extractedText,
      skills: Array.isArray(aiResult.extracted_skills) ? aiResult.extracted_skills : [],
      score: aiResult.ats_score || 70,
      isPrimary: true,
      modelVersion: 'v1.2.0'
    });

    // Save Analysis Document in MongoDB
    const analysis = await Analysis.create({
      resumeId: resume._id,
      atsScore: aiResult.ats_score,
      skillScore: aiResult.skills_score,
      experienceScore: aiResult.experience_score,
      keywordScore: aiResult.keywords_score,
      formattingScore: aiResult.formatting_score,
      matchedSkills: Array.isArray(aiResult.extracted_skills) ? aiResult.extracted_skills : [],
      recommendations: Array.isArray(aiResult.recommendations) ? aiResult.recommendations : []
    });

    res.status(201).json({
      status: 'success',
      data: {
        resume: { ...resume.toObject(), analysis }
      }
    });
  } catch (error) {
    console.error('[Upload Resume Controller Error]:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * PUT /api/resumes/:id/active
 * Sets a specific uploaded resume as the active primary dashboard resume for the candidate.
 */
const setActiveResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const targetResume = await Resume.findOne({ _id: id, userId });
    if (!targetResume) {
      return res.status(404).json({ status: 'fail', message: 'Resume document not found.' });
    }

    await Resume.updateMany({ userId }, { isPrimary: false });
    targetResume.isPrimary = true;
    await targetResume.save();

    const analysis = await Analysis.findOne({ resumeId: targetResume._id });

    res.status(200).json({
      status: 'success',
      message: `Set "${targetResume.filename}" as active primary dashboard resume.`,
      data: { ...targetResume.toObject(), analysis }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * DELETE /api/resumes/:id
 */
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    await Resume.findOneAndDelete({ _id: id, userId });
    await Analysis.deleteMany({ resumeId: id });

    // Set newest remaining resume as primary if none active
    const remaining = await Resume.find({ userId }).sort({ createdAt: -1 });
    if (remaining.length > 0 && !remaining.some(r => r.isPrimary)) {
      remaining[0].isPrimary = true;
      await remaining[0].save();
    }

    res.status(200).json({ status: 'success', message: 'Resume document deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getResumes, uploadResume, setActiveResume, deleteResume };
