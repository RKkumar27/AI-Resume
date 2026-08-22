import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreCircle from '../components/ScoreCircle';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { aiAPI, resumeAPI } from '../services/api';
import { Briefcase, Sparkles, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const JobMatchingPage = () => {
  const toast = useToast();
  const [jobTitle, setJobTitle] = useState('Senior Backend Engineer');
  const [jobDescription, setJobDescription] = useState(
    'We are seeking a Senior Backend Engineer proficient in Node.js, Express, Python, FastAPI, MongoDB, Docker, and Redis caching. Experience with microservice architecture and REST API optimization required.'
  );
  const [resumeText, setResumeText] = useState('');
  const [activeResumeFilename, setActiveResumeFilename] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    const fetchActiveResume = async () => {
      setLoadingResumes(true);
      try {
        const res = await resumeAPI.getResumes();
        if (res.data && res.data.data && res.data.data.length > 0) {
          const primary = res.data.data.find(r => r.isPrimary) || res.data.data[0];
          setResumeText(primary.extractedText || '');
          setActiveResumeFilename(primary.filename);
        }
      } catch (err) {
        console.warn('[Job Matching] Active resume fetch warning:', err.message);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchActiveResume();
  }, []);

  const handleAnalyzeMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || !resumeText.trim()) {
      toast.warning('Please provide both job description requirements and candidate resume text.');
      return;
    }

    setLoading(true);
    try {
      const res = await aiAPI.matchJob({
        job_title: jobTitle,
        job_description: jobDescription,
        resume_text: resumeText
      });

      if (res.data && res.data.data) {
        setMatchResult(res.data.data);
        toast.success(`Semantic job match score: ${res.data.data.match_score}%!`);
      }
    } catch (err) {
      console.error('[Job Matching Error]:', err);
      toast.error('Failed to compute job match score.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Semantic Job Description Matcher</h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Compare active candidate resume content against target job postings using TF-IDF text vectorization and skill overlap calculations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            {/* Left Column: Form Inputs */}
            <Card title="Job Description & Candidate Text Input">
              {loadingResumes ? (
                <Loader label="Loading active candidate resume text..." />
              ) : (
                <form onSubmit={handleAnalyzeMatch}>
                  {activeResumeFilename && (
                    <div style={{
                      padding: '0.5rem 0.875rem',
                      backgroundColor: 'var(--color-bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      marginBottom: '1rem',
                      fontSize: '0.8125rem'
                    }} className="flex items-center gap-xs">
                      <FileText size={16} color="var(--color-primary)" />
                      <span style={{ fontWeight: 600 }}>Source Resume:</span> {activeResumeFilename}
                    </div>
                  )}

                  <Input
                    label="Target Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    icon={Briefcase}
                    required
                  />

                  <Textarea
                    label="Target Job Description & Requirements"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste target job posting requirements..."
                    rows={5}
                    required
                  />

                  <Textarea
                    label="Candidate Resume Text (Extracted from Document)"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste candidate resume text or skill inventory..."
                    rows={5}
                    required
                  />

                  <Button type="submit" variant="primary" fullWidth loading={loading} icon={Sparkles} style={{ marginTop: '1rem' }}>
                    Compute Semantic Job Match
                  </Button>
                </form>
              )}
            </Card>

            {/* Right Column: Calculated Real Match Results */}
            <div className="flex flex-col gap-lg">
              {matchResult ? (
                <>
                  <Card title="AI Compatibility Match Summary">
                    <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                      <div>
                        <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Overall Match Score</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {matchResult.match_score}%
                        </div>
                      </div>
                      <ScoreCircle score={matchResult.match_score} maxScore={100} />
                    </div>

                    <div className="grid grid-cols-2 gap-sm" style={{ padding: '0.875rem', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <div className="text-subtle" style={{ fontSize: '0.75rem' }}>TF-IDF Similarity</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{Math.round(matchResult.tfidf_similarity * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-subtle" style={{ fontSize: '0.75rem' }}>Semantic Skill Overlap</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{Math.round(matchResult.semantic_similarity * 100)}%</div>
                      </div>
                    </div>
                  </Card>

                  <Card title="Matched Skills & Missing Keywords">
                    <div style={{ marginBottom: '1rem' }}>
                      <div className="flex items-center gap-xs text-success" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                        <CheckCircle2 size={16} /> Matched Skills ({matchResult.matched_skills.length}):
                      </div>
                      {matchResult.matched_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-xs">
                          {matchResult.matched_skills.map((skill, idx) => (
                            <Badge key={idx} variant="success">{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted" style={{ fontSize: '0.8125rem' }}>No direct keyword overlaps detected.</p>
                      )}
                    </div>

                    {matchResult.missing_skills && matchResult.missing_skills.length > 0 && (
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                        <div className="flex items-center gap-xs text-warning" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                          <AlertTriangle size={16} /> Missing Target Keywords ({matchResult.missing_skills.length}):
                        </div>
                        <div className="flex flex-wrap gap-xs">
                          {matchResult.missing_skills.map((skill, idx) => (
                            <Badge key={idx} variant="warning">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                    <Card title="AI Recommendations">
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {matchResult.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </>
              ) : (
                <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <Sparkles size={36} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3>Submit Job Posting to Calculate Match</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.4rem' }}>
                    Click "Compute Semantic Job Match" to evaluate keyword overlap, TF-IDF cosine vector similarity, and missing skill recommendations.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobMatchingPage;
