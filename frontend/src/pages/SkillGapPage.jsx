import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Input from '../components/Input';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { aiAPI, resumeAPI } from '../services/api';
import { Target, Sparkles, Clock, CheckCircle2, FileText, BookOpen } from 'lucide-react';

export const SkillGapPage = () => {
  const toast = useToast();
  const [targetRole, setTargetRole] = useState('Senior Backend Engineer');
  const [loading, setLoading] = useState(true);
  const [activeResume, setActiveResume] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [skillGapResult, setSkillGapResult] = useState(null);

  const loadSkillGapData = async (roleOverride) => {
    setLoading(true);
    try {
      // 1. Fetch User Resumes to identify active primary resume and extracted skills
      const resumeRes = await resumeAPI.getResumes();
      let extractedSkills = [];
      let currentResume = null;

      if (resumeRes.data && resumeRes.data.data && resumeRes.data.data.length > 0) {
        currentResume = resumeRes.data.data.find(r => r.isPrimary) || resumeRes.data.data[0];
        setActiveResume(currentResume);
        extractedSkills = Array.isArray(currentResume.skills) 
          ? currentResume.skills 
          : String(currentResume.skills || '').split(' ').filter(Boolean);
        setUserSkills(extractedSkills);
      }

      // 2. Call FastAPI Skill Gap Endpoint with candidate's ACTUAL extracted skills
      const roleToEvaluate = roleOverride || targetRole;
      const gapRes = await aiAPI.skillGap({
        target_role: roleToEvaluate,
        user_skills: extractedSkills
      });

      if (gapRes.data && gapRes.data.data) {
        setSkillGapResult(gapRes.data.data);
      }
    } catch (err) {
      console.warn('[Skill Gap Page] Load warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillGapData();
  }, []);

  const handleRecalculate = (e) => {
    e.preventDefault();
    loadSkillGapData(targetRole);
    toast.success(`Recalculated skill gap analysis for role: "${targetRole}"!`);
  };

  const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Filter missing skills: ANY skill present in candidate's resume MUST NOT appear as missing!
  const filteredMissingSkills = (skillGapResult?.missing_skills || []).filter(
    item => !userSkillSet.has(item.name.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Dynamic Skill Gap Analysis & Learning Roadmap</h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Evaluates your active resume skills against target job role requirements to derive genuinely missing competencies and a 4-week curriculum.
              </p>
            </div>
          </div>

          {/* Active Resume Context Banner */}
          {activeResume && (
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
                    ({userSkills.length} extracted technical skills)
                  </span>
                </div>
              </div>
              <Badge variant="success">Source of Truth</Badge>
            </div>
          )}

          {/* Role Target Selector Form */}
          <Card style={{ marginBottom: 'var(--space-lg)' }}>
            <form onSubmit={handleRecalculate} className="flex items-center justify-between flex-wrap gap-md">
              <div style={{ flex: 1, minWidth: '280px' }}>
                <Input
                  label="Target Job Role Title"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  icon={Target}
                />
              </div>
              <Button type="submit" variant="primary" icon={Sparkles} style={{ marginTop: '0.5rem' }}>
                Recalculate Skill Gaps
              </Button>
            </form>
          </Card>

          {loading ? (
            <Card style={{ padding: '3rem', textAlign: 'center' }}>
              <Loader label="Evaluating resume skills against target role requirements..." />
            </Card>
          ) : !activeResume ? (
            <Card style={{ padding: '3rem', textAlign: 'center' }}>
              <EmptyState
                title="No Active Resume Found"
                description="Upload a resume first to extract your skills and compute genuine skill gaps against target job roles."
              />
            </Card>
          ) : (
            /* Skill Gap Breakdown and 4-Week Learning Curriculum */
            <div className="grid grid-cols-2 gap-lg">
              {/* Left Column: Missing Competencies Breakdown */}
              <Card title={`Missing Competencies for "${targetRole}"`} subtitle="Filtered against your actual resume skills">
                {filteredMissingSkills.length > 0 ? (
                  <div className="flex flex-col gap-sm">
                    {filteredMissingSkills.map((skill, idx) => (
                      <div key={idx} style={{
                        padding: '0.875rem 1rem',
                        backgroundColor: 'var(--color-bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{skill.name}</div>
                          <Badge variant={skill.priority === 'Must Learn' ? 'danger' : skill.priority === 'Recommended' ? 'warning' : 'info'}>
                            {skill.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-muted" style={{ fontSize: '0.8125rem' }}>
                          <span>Category: {skill.category || 'Technical'}</span>
                          <span className="flex items-center gap-xs"><Clock size={12} /> ~10 hrs learning time</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <CheckCircle2 size={40} color="var(--color-success)" style={{ margin: '0 auto 0.75rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Zero Skill Gaps Detected!</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.3rem' }}>
                      Your active resume document possesses all key technical skills required for <strong>{targetRole}</strong>!
                    </p>
                  </div>
                )}
              </Card>

              {/* Right Column: Dynamic 4-Week Learning Path */}
              <Card title="Dynamic 4-Week Learning Path" subtitle="Generated strictly from missing competencies">
                {skillGapResult?.roadmap_weeks && skillGapResult.roadmap_weeks.length > 0 ? (
                  <div className="flex flex-col gap-md">
                    {skillGapResult.roadmap_weeks.map((item, idx) => (
                      <div key={idx} style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                          <div className="flex items-center gap-sm">
                            <div style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8125rem'
                            }}>
                              W{item.week}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.topic}</span>
                          </div>
                          <Badge variant={idx === 0 ? 'info' : 'secondary'}>
                            {idx === 0 ? 'Week 1' : `Week ${item.week}`}
                          </Badge>
                        </div>

                        <ProgressBar label={`Estimated Study Time: ${item.hours || 10} hrs`} progress={idx === 0 ? 30 : 0} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>No roadmap needed. All role skills are matched!</p>
                )}
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SkillGapPage;
