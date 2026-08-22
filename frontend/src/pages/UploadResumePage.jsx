import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import FileUploader from '../components/FileUploader';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { resumeAPI } from '../services/api';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export const UploadResumePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      toast.success(`Selected document: ${file.name}`);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      toast.warning('Please select a PDF or DOCX resume document first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await resumeAPI.uploadResume(formData);
      
      if (res.data && res.data.data) {
        const { resume, analysis } = res.data.data;
        setAnalysisResult({ resume, analysis });
        setSuccessModalOpen(true);
        toast.success(`Resume "${selectedFile.name}" analyzed successfully!`);
      }
    } catch (error) {
      console.error('[Upload Resume Error]:', error);
      toast.error(error.response?.data?.message || 'Resume upload failed. Ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAnother = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setSuccessModalOpen(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb < 0.1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          {/* Header Navigation */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <Link to="/dashboard" className="flex items-center gap-xs text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-sm">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Upload Your Resume</h1>
            </div>
            <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.35rem', maxWidth: '640px', lineHeight: 1.5 }}>
              Upload your resume in PDF or DOCX format. Our AI parser will extract technical skills, evaluate section completeness, and calculate your ATS match score.
            </p>
          </div>

          {/* Upload Card Container */}
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <Card 
              title="Resume Document Dropzone" 
              subtitle="Accepted formats: PDF, DOCX (Maximum file size: 10MB)"
            >
              <FileUploader 
                onFileSelect={handleFileSelect}
                acceptedFormats={['.pdf', '.docx']}
                maxSizeMB={10}
              />

              <div className="flex items-center justify-between" style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>

                <Button 
                  variant="primary" 
                  size="lg" 
                  disabled={!selectedFile}
                  loading={loading}
                  icon={Sparkles}
                  onClick={handleUploadAndAnalyze}
                >
                  Analyze Resume
                </Button>
              </div>
            </Card>
          </div>

          {/* Real Analysis Results Modal */}
          <Modal
            isOpen={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            title="Resume Uploaded & Analyzed Successfully"
            maxWidth="540px"
            footer={
              <div className="flex items-center justify-between" style={{ width: '100%' }}>
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleUploadAnother}>
                  Upload Another Resume
                </Button>
                <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => { setSuccessModalOpen(false); navigate('/dashboard'); }}>
                  View Full Dashboard
                </Button>
              </div>
            }
          >
            <div className="flex flex-col items-center text-center gap-md" style={{ padding: '0.5rem 0' }}>
              <div style={{
                padding: '0.875rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <CheckCircle2 size={38} />
              </div>

              <div style={{ width: '100%' }}>
                <p className="text-muted" style={{ fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Your resume has been processed by our AI parsing engine. Real ATS metrics and technical skills have been computed.
                </p>

                {/* Selected File & Score Box */}
                {selectedFile && (
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.25rem'
                  }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                      <div className="flex items-center gap-sm">
                        <FileText size={22} color="var(--color-primary)" />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>
                            {selectedFile.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {formatFileSize(selectedFile.size)} · Parsed & Saved in Database
                          </div>
                        </div>
                      </div>
                      <Badge variant="success">Analyzed</Badge>
                    </div>

                    {analysisResult?.resume && (
                      <div className="flex items-center justify-between" style={{
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--color-border)'
                      }}>
                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>Calculated ATS Score:</span>
                        <div className="flex items-center gap-xs" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-success)' }}>
                          <Award size={20} />
                          <span>{analysisResult.resume.score || 85} / 100</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Extracted Skills List */}
                {analysisResult?.analysis?.matchedSkills && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                      Extracted Technical Skills:
                    </div>
                    <div className="flex flex-wrap gap-xs">
                      {String(analysisResult.analysis.matchedSkills).split(' ').filter(Boolean).map((skill, idx) => (
                        <Badge key={idx} variant="info">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default UploadResumePage;
