/**
 * MOCK / DEMO DASHBOARD DATA
 * 
 * NOTE FOR FUTURE PHASES:
 * This file serves as the mock data contract for Phase 1 UI demonstration.
 * In Phase 7 (Integration), this module will be replaced or supplemented by 
 * dynamic data fetched from the Express Backend / MongoDB.
 */

export const MOCK_USER_PROFILE = {
  name: "Alex Morgan",
  title: "Senior Full Stack Engineer",
  email: "alex.morgan@example.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  targetRole: "Lead Backend Architect",
  isDemoData: true
};

export const MOCK_DASHBOARD_METRICS = {
  resumeScore: {
    score: 86,
    maxScore: 100,
    label: "ATS Resume Score",
    change: "+4% from last week",
    status: "Strong",
    categoryScores: {
      skills: 92,
      experience: 88,
      keywords: 89,
      formatting: 76,
      projects: 82
    }
  },
  jobMatches: {
    count: 24,
    label: "Active Job Matches",
    highMatchCount: 8,
    averageMatchPercent: 91
  },
  applications: {
    count: 12,
    label: "Tracked Applications",
    inReview: 5,
    interviewsScheduled: 3,
    offers: 1
  },
  interviewScore: {
    score: 78,
    unit: "%",
    label: "Mock Interview Score",
    completedSessions: 4,
    feedbackSummary: "Great technical accuracy, practice system design clarity."
  }
};

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: "act-1",
    type: "resume_analysis",
    title: "Updated Software Engineer Resume",
    score: 86,
    timestamp: "2 hours ago",
    details: "ATS Score improved from 82 to 86"
  },
  {
    id: "act-2",
    type: "job_match",
    title: "Matched: Senior Backend Developer at Stripe",
    matchRate: "94%",
    timestamp: "5 hours ago",
    details: "High compatibility (React, Node.js, System Design)"
  },
  {
    id: "act-3",
    type: "mock_interview",
    title: "Completed Technical System Design Practice",
    score: "80%",
    timestamp: "1 day ago",
    details: "Feedback: Clear database schema explanations"
  }
];

export const MOCK_SKILL_GAPS = [
  { skill: "Docker & Containerization", priority: "Must Learn", category: "DevOps" },
  { skill: "PostgreSQL Query Optimization", priority: "Recommended", category: "Database" },
  { skill: "Redis Caching Strategies", priority: "Recommended", category: "Architecture" },
  { skill: "Kubernetes Orchestration", priority: "Optional", category: "Cloud" }
];

export const MOCK_RECOMMENDED_JOBS = [
  {
    id: "job-1",
    role: "Senior Full Stack Engineer",
    company: "TechScale Inc.",
    location: "Remote",
    salary: "$140k - $175k",
    matchPercentage: 94,
    tags: ["React", "Node.js", "MongoDB", "AWS"]
  },
  {
    id: "job-2",
    role: "Backend Architect",
    company: "CloudFlow Systems",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $190k",
    matchPercentage: 91,
    tags: ["Node.js", "FastAPI", "Python", "Microservices"]
  },
  {
    id: "job-3",
    role: "AI Application Developer",
    company: "NextGen AI",
    location: "Remote",
    salary: "$150k - $185k",
    matchPercentage: 87,
    tags: ["Python", "FastAPI", "NLP", "React"]
  }
];
