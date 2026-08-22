const axios = require('axios');
const Job = require('../models/Job');

// Skill Extraction Dictionary for Job Descriptions
const SKILL_MAP = {
  'javascript': 'JavaScript', 'js': 'JavaScript', 'typescript': 'TypeScript', 'ts': 'TypeScript',
  'python': 'Python', 'java': 'Java', 'c++': 'C++', 'cpp': 'C++', 'c#': 'C#', '.net': '.NET',
  'go': 'Go', 'golang': 'Go', 'rust': 'Rust', 'html': 'HTML', 'css': 'CSS', 'sql': 'SQL',
  'react': 'React', 'reactjs': 'React', 'vue': 'Vue.js', 'angular': 'Angular', 'next.js': 'Next.js',
  'node': 'Node.js', 'nodejs': 'Node.js', 'express': 'Express.js', 'fastapi': 'FastAPI',
  'spring': 'Spring Boot', 'django': 'Django', 'flask': 'Flask', 'tailwind': 'Tailwind CSS',
  'mongo': 'MongoDB', 'mongodb': 'MongoDB', 'postgres': 'PostgreSQL', 'mysql': 'MySQL', 'redis': 'Redis',
  'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes', 'aws': 'AWS', 'gcp': 'GCP',
  'azure': 'Azure', 'git': 'Git', 'github': 'GitHub', 'ci/cd': 'CI/CD', 'rest apis': 'REST APIs',
  'microservices': 'Microservices', 'graphql': 'GraphQL', 'bootstrap': 'Bootstrap', 'kafka': 'Kafka',
  'terraform': 'Terraform', 'linux': 'Linux', 'system design': 'System Design'
};

const extractSkillsFromText = (text) => {
  const textLower = (text || '').toLowerCase();
  const found = new Set();
  Object.keys(SKILL_MAP).forEach((key) => {
    const pattern = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(textLower)) {
      found.add(SKILL_MAP[key]);
    }
  });
  return Array.from(found).sort();
};

const stripHtml = (html) => {
  return (html || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * ArbeitNow Job Provider Adapter
 * API: https://www.arbeitnow.com/api/job-board-api
 */
const fetchArbeitNowJobs = async (query = '') => {
  try {
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api', { timeout: 8000 });
    const rawJobs = response.data?.data || [];
    
    const queryLower = query.toLowerCase();
    const filtered = query
      ? rawJobs.filter(j => (j.title || '').toLowerCase().includes(queryLower) || (j.tags || []).some(t => t.toLowerCase().includes(queryLower)) || (j.description || '').toLowerCase().includes(queryLower))
      : rawJobs;

    const targetList = filtered.length > 0 ? filtered : rawJobs;

    return targetList.slice(0, 15).map(item => {
      const plainDesc = stripHtml(item.description || '');
      const skills = extractSkillsFromText(`${item.title} ${plainDesc} ${(item.tags || []).join(' ')}`);
      
      return {
        provider: 'ArbeitNow',
        externalJobId: String(item.slug || item.id || Math.random()),
        originalUrl: item.url || 'https://www.arbeitnow.com',
        title: item.title || 'Software Engineer',
        company: item.company_name || 'Tech Enterprise',
        location: item.location || 'Remote',
        jobType: item.remote ? 'Remote' : 'On-site',
        salary: 'Competitive Salary & Benefits',
        description: plainDesc.substring(0, 500) + '...',
        requiredSkills: skills.length > 0 ? skills : ['Software Development', 'REST APIs', 'Git'],
        postedAt: item.created_at ? new Date(item.created_at * 1000) : new Date()
      };
    });
  } catch (err) {
    console.error('[Job Provider Service] ArbeitNow API error:', err.message);
    return [];
  }
};

/**
 * Remotive Job Provider Adapter
 * API: https://remotive.com/api/remote-jobs
 */
const fetchRemotiveJobs = async (query = '') => {
  try {
    const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev', { timeout: 8000 });
    const rawJobs = response.data?.jobs || [];

    const queryLower = query.toLowerCase();
    const filtered = query
      ? rawJobs.filter(j => (j.title || '').toLowerCase().includes(queryLower) || (j.description || '').toLowerCase().includes(queryLower))
      : rawJobs;

    const targetList = filtered.length > 0 ? filtered : rawJobs;

    return targetList.slice(0, 15).map(item => {
      const plainDesc = stripHtml(item.description || '');
      const skills = extractSkillsFromText(`${item.title} ${plainDesc} ${(item.tags || []).join(' ')}`);
      
      return {
        provider: 'Remotive',
        externalJobId: String(item.id || Math.random()),
        originalUrl: item.url || 'https://remotive.com',
        title: item.title || 'Full Stack Engineer',
        company: item.company_name || 'Global Tech',
        location: item.candidate_required_location || 'Remote (Worldwide)',
        jobType: 'Remote',
        salary: item.salary || 'Competitive',
        description: plainDesc.substring(0, 500) + '...',
        requiredSkills: skills.length > 0 ? skills : ['Software Engineering', 'Web Development'],
        postedAt: item.publication_date ? new Date(item.publication_date) : new Date()
      };
    });
  } catch (err) {
    console.error('[Job Provider Service] Remotive API error:', err.message);
    return [];
  }
};

/**
 * Main Pluggable Job Provider Function
 * Fetches real job listings, updates MongoDB cache, and returns normalized jobs.
 */
const getRealJobs = async (query = 'Software Engineer') => {
  const providerName = (process.env.JOB_PROVIDER || 'arbeitnow').toLowerCase();
  
  // 1. Check MongoDB cache (jobs fetched for query in last 30 mins)
  const cacheCutoff = new Date(Date.now() - 30 * 60 * 1000);
  const cachedJobs = await Job.find({ fetchedAt: { $gte: cacheCutoff } }).sort({ postedAt: -1 }).limit(15);
  
  if (cachedJobs.length >= 4) {
    console.log(`[Job Provider Service]: Serving ${cachedJobs.length} cached live jobs from MongoDB.`);
    return cachedJobs;
  }

  // 2. Fetch live from configured provider
  let freshJobs = [];
  if (providerName === 'remotive') {
    freshJobs = await fetchRemotiveJobs(query);
  } else {
    freshJobs = await fetchArbeitNowJobs(query);
    if (freshJobs.length === 0) {
      console.warn('[Job Provider Service]: ArbeitNow returned 0 results. Trying Remotive fallback provider...');
      freshJobs = await fetchRemotiveJobs(query);
    }
  }

  if (freshJobs.length === 0) {
    console.warn('[Job Provider Service]: Both external providers failed or returned empty results.');
    return cachedJobs.length > 0 ? cachedJobs : [];
  }

  // 3. Upsert fresh jobs into MongoDB cache
  const savedJobs = [];
  for (const jobData of freshJobs) {
    try {
      const updated = await Job.findOneAndUpdate(
        { externalJobId: jobData.externalJobId },
        { ...jobData, fetchedAt: new Date() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      savedJobs.push(updated);
    } catch (dbErr) {
      // Ignore duplicate key race conditions
    }
  }

  console.log(`[Job Provider Service]: Successfully fetched & cached ${savedJobs.length} real live jobs from ${providerName.toUpperCase()} API.`);
  return savedJobs.length > 0 ? savedJobs : freshJobs;
};

module.exports = { getRealJobs, extractSkillsFromText };
