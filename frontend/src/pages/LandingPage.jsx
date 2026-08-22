import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { 
  Sparkles, 
  FileCheck, 
  Target, 
  BookOpen, 
  Video, 
  Kanban, 
  ArrowRight, 
  Zap, 
  Cpu 
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.18) 0%, rgba(15, 23, 42, 0) 70%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <Badge variant="demo">
              <Sparkles size={12} style={{ marginRight: 4 }} />
              Next-Gen AI Career Platform
            </Badge>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem'
          }}>
            Analyze Your Resume.<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Find Your Perfect Job.
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            maxWidth: '720px',
            marginInline: 'auto'
          }}>
            AI-powered resume analysis, job matching, and personalized career guidance. Optimize your ATS score, discover skill gaps, and land interviews faster.
          </p>

          <div className="flex items-center justify-center gap-md" style={{ flexWrap: 'wrap' }}>
            <Link to="/login">
              <Button size="lg" icon={Sparkles}>
                Analyze My Resume
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-md" style={{
            marginTop: '4rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>86%</div>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>Avg ATS Score Boost</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>3.5x</div>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>More Interview Calls</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>94%</div>
              <div className="text-muted" style={{ fontSize: '0.875rem' }}>Job Compatibility Match</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Comprehensive AI Career Engine</h2>
            <p className="text-muted" style={{ fontSize: '1.0625rem', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need from parsing your CV to passing AI mock interviews.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-lg">
            <Card interactive title="ATS Resume Analyzer">
              <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                <FileCheck size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Parse PDF/DOCX resumes, extract key technical skills, identify formatting issues, and calculate a realistic ATS score.
              </p>
            </Card>

            <Card interactive title="Semantic Job Matching">
              <div style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                <Cpu size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Compare candidate profiles against target job descriptions using NLP & Transformer embeddings for true semantic relevance.
              </p>
            </Card>

            <Card interactive title="Skill Gap & Learning Roadmap">
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <Target size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Discover missing technical and domain skills with a week-by-week prioritized learning path tailored to target roles.
              </p>
            </Card>

            <Card interactive title="AI Resume Coach">
              <div style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>
                <Zap size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Receive actionable bullet-point rewrites with quantified achievements to make experience descriptions stand out.
              </p>
            </Card>

            <Card interactive title="AI Mock Interviews">
              <div style={{ color: 'var(--color-warning)', marginBottom: '1rem' }}>
                <Video size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Practice role-specific technical and behavioral interview questions with real-time AI evaluation and constructive feedback.
              </p>
            </Card>

            <Card interactive title="Application Tracker">
              <div style={{ color: '#ec4899', marginBottom: '1rem' }}>
                <Kanban size={32} />
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Organize job applications, track status stages from applied to offer, log interview notes, and analyze success rates.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How ResuMatch AI Works</h2>
            <p className="text-muted" style={{ fontSize: '1.0625rem' }}>Four simple steps to your dream tech job</p>
          </div>

          <div className="grid grid-cols-4 gap-md">
            <div style={{ padding: 'var(--space-md)' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>1</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Upload Resume</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Upload PDF or DOCX resume. Our parser extracts skills, history & format structure.</p>
            </div>

            <div style={{ padding: 'var(--space-md)' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>2</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Match Job Description</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Paste any job description to compute instant ATS match score and skill gaps.</p>
            </div>

            <div style={{ padding: 'var(--space-md)' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>3</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Optimize & Learn</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Accept AI resume suggestions and follow your customized 4-week learning roadmap.</p>
            </div>

            <div style={{ padding: 'var(--space-md)' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>4</div>
              <h4 style={{ marginBottom: '0.5rem' }}>Practice & Apply</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Run AI mock interviews, refine answers, and track your applications to offer stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Elevate Your Tech Career?</h2>
          <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Start analyzing your resume in under 60 seconds with our AI microservice.
          </p>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--color-bg-main)',
        borderTop: '1px solid var(--color-border)',
        padding: '2.5rem 0',
        color: 'var(--color-text-subtle)',
        fontSize: '0.875rem'
      }}>
        <div className="container flex items-center justify-between">
          <div>
            © {new Date().getFullYear()} ResuMatch AI Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-md">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
