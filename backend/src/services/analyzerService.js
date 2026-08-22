// Technical Skill Dictionary for Node.js fallback analyzer
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
  'microservices': 'Microservices', 'graphql': 'GraphQL', 'bootstrap': 'Bootstrap'
};

const analyzeResumeTextNode = (text) => {
  const textLower = (text || '').toLowerCase();
  
  // 1. Skill Extraction
  const foundSkills = new Set();
  Object.keys(SKILL_MAP).forEach((key) => {
    const pattern = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(textLower)) {
      foundSkills.add(SKILL_MAP[key]);
    }
  });
  const extractedSkills = Array.from(foundSkills).sort();
  const skillCount = extractedSkills.length;

  // 2. Score Components
  const skillsScore = Math.min(98, Math.max(30, 35 + skillCount * 7));
  
  let experienceScore = 45;
  if (/(\bexperience\b|\bemployment\b|\bwork history\b)/i.test(textLower)) experienceScore += 20;
  const actionVerbs = (textLower.match(/\b(developed|engineered|architected|optimized|built|scaled|designed|implemented|managed|led)\b/g) || []).length;
  experienceScore += Math.min(20, actionVerbs * 3);
  const metrics = (textLower.match(/(\d+%\b|\$\d+|\d+\s*k\b)/g) || []).length;
  experienceScore += Math.min(15, metrics * 5);
  experienceScore = Math.min(98, experienceScore);

  const words = textLower.match(/\w+/g) || [];
  const totalWords = words.length || 1;
  const techWordCount = extractedSkills.reduce((acc, s) => acc + (textLower.match(new RegExp(s.toLowerCase(), 'g')) || []).length, 0);
  const keywordsScore = Math.min(98, Math.max(40, Math.round(50 + (techWordCount / totalWords) * 800 + skillCount * 3)));

  let formattingScore = 40;
  if (/(\bskills\b|\btechnical skills\b)/i.test(textLower)) formattingScore += 12;
  if (/(\bexperience\b|\bwork history\b)/i.test(textLower)) formattingScore += 12;
  if (/(\beducation\b|\bdegree\b)/i.test(textLower)) formattingScore += 12;
  if (/(\bprojects\b|\bportfolio\b)/i.test(textLower)) formattingScore += 12;
  if (/[\w\.-]+@[\w\.-]+\.\w+/.test(text)) formattingScore += 10;
  formattingScore = Math.min(98, formattingScore);

  const atsScore = Math.round(
    skillsScore * 0.35 +
    experienceScore * 0.25 +
    keywordsScore * 0.25 +
    formattingScore * 0.15
  );

  return {
    ats_score: atsScore,
    skills_score: skillsScore,
    experience_score: experienceScore,
    keywords_score: keywordsScore,
    formatting_score: formattingScore,
    extracted_skills: extractedSkills,
    recommendations: [
      'Quantify project accomplishments with measurable impact metrics (e.g. "improved performance by 35%").',
      'Ensure standard section headers are clearly formatted.'
    ],
    model_version: 'v1.2.0'
  };
};

module.exports = { analyzeResumeTextNode };
