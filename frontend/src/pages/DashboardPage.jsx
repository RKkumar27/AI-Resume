import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreCircle from '../components/ScoreCircle';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeAPI, applicationAPI, jobAPI } from '../services/api';
import { 
  Upload, 
  Sparkles, 
  FileText, 
  Briefcase, 
  Kanban, 
  Target, 
  Video, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  MapPin,
  Clock
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState('');
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [jobProviderName, setJobProviderName] = useState('ArbeitNow');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Candidate Resumes
      const resumeRes = await resumeAPI.getResumes();
      if (resumeRes.data && resumeRes.data.data) {
        const fetchedResumes = resumeRes.data.data;
        setResumes(fetchedResumes);
        if (fetchedResumes.length > 0) {
          const primary = fetchedResumes.find(r => r.isPrimary) || fetchedResumes[0];
          setActiveResumeId(primary._id);
        }
      }

      // 2. Fetch Candidate Tracked Applications Count
      const appRes = await applicationAPI.getApplications();
      if (appRes.data && appRes.data.data) {
        setApplicationsCount(appRes.data.data.length);
      }
    } catch (err) {
      console.warn('[Dashboard] Fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLiveJobRecommendations = async () => {
    setLoadingJobs(true);
    try {
      const jobRes = await jobAPI.getJobRecommendations();
      if (jobRes.data && jobRes.data.data) {
        setRecommendedJobs(jobRes.data.data);
        setJobProviderName(jobRes.data.provider || 'ArbeitNow');
      }
    } catch (err) {
      console.warn('[Dashboard Live Jobs Warning]:', err.message);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeResumeId) {
      loadLiveJobRecommendations();
    }
  }, [activeResumeId]);

  const handleSwitchActiveResume = async (id) => {
    setActiveResumeId(id);
    try {
      await resumeAPI.setActiveResume(id);
      const activeObj = resumes.find(r => r._id === id);
      toast.info(`Switched active resume to: ${activeObj?.filename}`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to set active resume.');
    }
  };

  const activeResume = resumes.find(r => r._id === activeResumeId) || resumes[0];
  const activeAnalysis = activeResume?.analysis;

  // Real Extracted Skills Array for Active Resume
  const extractedSkills = activeResume?.skills 
    ? (Array.isArray(activeResume.skills) ? activeResume.skills : String(activeResume.skills).split(' ').filter(Boolean))
    : [];

  const skillsSet = new Set(extractedSkills.map(s => String(s).toLowerCase()));

  // Dynamic Skill Gap Calculation for Top Job Match
  const topJob = recommendedJobs[0] || null;
  const topJobMissing = topJob?.missingSkills || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          {/* Dashboard Header */}
          <div className="flex items-center justify-between flex-wrap gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                Welcome back, {user?.name || 'Candidate'} 👋
              </h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Real ATS scoring, live job recommendations, and genuine skill gaps evaluated directly from your active resume.
              </p>
            </div>

            <div className="flex items-center gap-sm">
              {resumes.length > 1 && (
                <div style={{ width: '220px' }}>
                  <Select
                    options={resumes.map(r => r.filename)}
                    value={activeResume?.filename}
                    onChange={(e) => {
                      const selected = resumes.find(r => r.filename === e.target.value);
                      if (selected) handleSwitchActiveResume(selected._id);
                    }}
                  />
                </div>
              )}
              <Link to="/resumes/upload">
                <Button variant="primary" icon={Upload}>
                  Upload Resume
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <Card style={{ padding: '3rem', textAlign: 'center' }}>
              <Loader label="Loading active candidate profile from database..." />
            </Card>
          ) : !activeResume ? (
            /* Clean Empty State when candidate has no uploaded resumes */
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <EmptyState
                title="No Resumes Uploaded Yet"
                description="Upload your resume in PDF or DOCX format. Our AI parser will extract technical skills, compute your ATS score, and fetch real current job listings."
                actionLabel="Upload Your Resume"
                onAction={() => navigate('/resumes/upload')}
              />
            </div>
          ) : (
            /* Populated Dashboard with REAL Active Resume Data */
            <>
              {/* Active Document Notification Banner */}
              <div style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div className="flex items-center gap-sm">
                  <FileText color="var(--color-primary)" size={20} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Active Candidate Resume: </span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{activeResume.filename}</span>
                    <span className="text-muted" style={{ fontSize: '0.8125rem', marginLeft: '0.5rem' }}>
                      (Uploaded: {new Date(activeResume.createdAt).toLocaleDateString()})
                    </span>
                  </div>
                </div>
                <Badge variant="success">Source of Truth</Badge>
              </div>

              {/* Key Metric Cards */}
              <div className="grid grid-cols-4 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>ATS Resume Score</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                        {activeResume.score}/100
                      </div>
                    </div>
                    <ScoreCircle score={activeResume.score} maxScore={100} />
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Real Job Matches</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                        {recommendedJobs.length} Roles
                      </div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: 'var(--color-secondary)' }}>
                      <Briefcase size={24} />
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Tracked Applications</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                        {applicationsCount}
                      </div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
                      <Kanban size={24} />
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Extracted Skills</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
                        {extractedSkills.length}
                      </div>
                    </div>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
                      <Target size={24} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-3 gap-lg">
                {/* Left Column: Category Scores & Real Live Job Recommendations */}
                <div style={{ gridColumn: 'span 2' }} className="flex flex-col gap-lg">
                  <Card title="Dynamic ATS Category Score Breakdown" subtitle={`Evaluated directly from text of ${activeResume.filename}`}>
                    <div className="flex flex-col gap-md" style={{ marginTop: '0.5rem' }}>
                      <ProgressBar label="Technical Skills Coverage" progress={activeAnalysis?.skillScore || 70} color="var(--color-primary)" />
                      <ProgressBar label="Work Experience Impact" progress={activeAnalysis?.experienceScore || 65} color="var(--color-secondary)" />
                      <ProgressBar label="Keyword Match Relevance" progress={activeAnalysis?.keywordScore || 68} color="var(--color-accent)" />
                      <ProgressBar label="Document Formatting Signals" progress={activeAnalysis?.formattingScore || 72} color="var(--color-warning)" />
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Skills Extracted from Active Resume:</div>
                      {extractedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-xs">
                          {extractedSkills.map((skill, idx) => (
                            <Badge key={idx} variant="info">{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted" style={{ fontSize: '0.8125rem' }}>No technical skills extracted.</p>
                      )}
                    </div>
                  </Card>

                  {/* REAL Live Job Recommendations Section */}
                  <Card 
                    title="Live Recommended Job Openings" 
                    subtitle={`Fetched from ${jobProviderName} API & evaluated for ${activeResume.filename}`}
                  >
                    {loadingJobs ? (
                      <Loader label="Searching live job postings from job provider service..." />
                    ) : recommendedJobs.length === 0 ? (
                      <p className="text-muted" style={{ fontSize: '0.875rem', padding: '1rem 0' }}>
                        No live matching job openings found for your current target role.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-md">
                        {recommendedJobs.slice(0, 6).map((job) => (
                          <div key={job._id || job.externalJobId} style={{
                            padding: '1rem',
                            backgroundColor: 'var(--color-bg-main)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                          }}>
                            <div className="flex items-start justify-between flex-wrap gap-sm" style={{ marginBottom: '0.5rem' }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                                  {job.title}
                                </div>
                                <div className="flex items-center gap-sm text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.2rem' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{job.company}</span>
                                  <span>·</span>
                                  <span className="flex items-center gap-xs"><MapPin size={12} /> {job.location}</span>
                                  <span>·</span>
                                  <Badge variant="secondary" style={{ fontSize: '0.65rem' }}>Source: {job.provider || 'ArbeitNow'}</Badge>
                                </div>
                              </div>

                              <div className="flex items-center gap-md">
                                <Badge variant={job.matchScore >= 80 ? 'success' : job.matchScore >= 50 ? 'info' : 'warning'}>
                                  {job.matchScore}% Match
                                </Badge>

                                <a 
                                  href={job.originalUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Button variant="primary" size="sm" icon={ExternalLink}>
                                    View Job / Apply
                                  </Button>
                                </a>
                              </div>
                            </div>

                            {/* Skills Matched & Missing */}
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--color-border)' }} className="flex flex-wrap items-center justify-between gap-sm">
                              {job.matchedSkills && job.matchedSkills.length > 0 && (
                                <div className="flex items-center gap-xs">
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>Matched:</span>
                                  {job.matchedSkills.slice(0, 4).map((s, idx) => (
                                    <Badge key={idx} variant="success" style={{ fontSize: '0.65rem' }}>{s}</Badge>
                                  ))}
                                </div>
                              )}

                              {job.missingSkills && job.missingSkills.length > 0 && (
                                <div className="flex items-center gap-xs">
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warning)' }}>Missing:</span>
                                  {job.missingSkills.slice(0, 3).map((s, idx) => (
                                    <Badge key={idx} variant="warning" style={{ fontSize: '0.65rem' }}>{s}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Column: Dynamic Skill Gaps */}
                <div className="flex flex-col gap-lg">
                  <Card title="Skill Gaps for Top Live Job" subtitle={topJob ? `Target: ${topJob.title}` : 'Skill Gap Analysis'}>
                    {topJobMissing.length > 0 ? (
                      <div className="flex flex-col gap-sm">
                        {topJobMissing.map((skill, idx) => (
                          <div key={idx} className="flex items-center justify-between" style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-main)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)'
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Missing Target Skill</div>
                            </div>
                            <Badge variant="warning" style={{ fontSize: '0.65rem' }}>Must Learn</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-success" style={{ fontSize: '0.875rem' }}>
                        <CheckCircle2 size={16} inline /> You possess key required technical skills for top matches!
                      </p>
                    )}

                    <Link to="/skills" style={{ display: 'block', marginTop: '1rem' }}>
                      <Button variant="outline" size="sm" fullWidth icon={ArrowRight}>
                        View 4-Week Learning Roadmap
                      </Button>
                    </Link>
                  </Card>

                  <Card title="Career Toolkit Quick Actions">
                    <div className="flex flex-col gap-sm">
                      <Link to="/interview">
                        <Button variant="secondary" fullWidth icon={Video} style={{ justifyContent: 'flex-start' }}>
                          Start AI Mock Interview
                        </Button>
                      </Link>
                      <Link to="/applications">
                        <Button variant="secondary" fullWidth icon={Kanban} style={{ justifyContent: 'flex-start' }}>
                          Manage Job Applications
                        </Button>
                      </Link>
                      <Link to="/jobs">
                        <Button variant="secondary" fullWidth icon={Sparkles} style={{ justifyContent: 'flex-start' }}>
                          Analyze Custom Job Posting
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
