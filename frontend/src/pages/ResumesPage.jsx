import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { resumeAPI } from '../services/api';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Award,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const ResumesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getResumes();
      if (res.data && res.data.data) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.warn('[Resumes Page] Fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSetActive = async (id, filename) => {
    try {
      await resumeAPI.setActiveResume(id);
      toast.success(`Set "${filename}" as active primary resume.`);
      fetchResumes();
    } catch (err) {
      toast.error('Failed to set active resume.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await resumeAPI.deleteResume(deleteTargetId);
      toast.success('Resume document deleted.');
      setDeleteTargetId(null);
      fetchResumes();
    } catch (err) {
      toast.error('Failed to delete resume.');
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
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Resumes & ATS Evaluation Records</h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                View your uploaded resume documents, switch the active dashboard resume, and compare calculated ATS scores.
              </p>
            </div>

            <Link to="/resumes/upload">
              <Button variant="primary" icon={Upload}>
                Upload New Resume
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card style={{ padding: '3rem', textAlign: 'center' }}>
              <Loader label="Loading resume documents from database..." />
            </Card>
          ) : resumes.length === 0 ? (
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <EmptyState
                title="No Resumes Uploaded Yet"
                description="Upload a PDF or DOCX resume document to extract technical skills and compute ATS compatibility scores."
                actionLabel="Upload First Resume"
                onAction={() => navigate('/resumes/upload')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-md">
              {resumes.map((resume) => {
                const skillsList = resume.skills 
                  ? String(resume.skills).split(' ').filter(Boolean) 
                  : [];

                return (
                  <Card key={resume._id}>
                    <div className="flex items-center justify-between flex-wrap gap-md">
                      <div className="flex items-center gap-md">
                        <div style={{
                          padding: '0.875rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-bg-main)',
                          color: 'var(--color-primary)'
                        }}>
                          <FileText size={32} />
                        </div>

                        <div>
                          <div className="flex items-center gap-sm">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{resume.filename}</h3>
                            {resume.isPrimary ? (
                              <Badge variant="success">Active Primary Profile</Badge>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSetActive(resume._id, resume.filename)}
                              >
                                Set as Active Dashboard Resume
                              </Button>
                            )}
                          </div>
                          <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.3rem' }}>
                            Uploaded: {new Date(resume.createdAt).toLocaleDateString()} · Text Length: {resume.extractedText?.length || 0} chars
                          </p>

                          {skillsList.length > 0 ? (
                            <div className="flex flex-wrap gap-xs" style={{ marginTop: '0.625rem' }}>
                              {skillsList.map((skill, idx) => (
                                <Badge key={idx} variant="info" style={{ fontSize: '0.7rem' }}>{skill}</Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>No technical skills extracted.</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-lg">
                        <div style={{ textAlign: 'right' }}>
                          <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Calculated ATS Score</div>
                          <div className="flex items-center gap-xs" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>
                            <Award size={20} />
                            <span>{resume.score}/100</span>
                          </div>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Trash2} 
                          onClick={() => setDeleteTargetId(resume._id)}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <ConfirmDialog
            isOpen={!!deleteTargetId}
            onClose={() => setDeleteTargetId(null)}
            onConfirm={handleDeleteConfirm}
            title="Delete Resume Document?"
            message="Are you sure you want to permanently delete this resume document and its associated ATS analysis from MongoDB?"
          />
        </main>
      </div>
    </div>
  );
};

export default ResumesPage;
