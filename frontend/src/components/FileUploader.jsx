import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import Button from './Button';

export const FileUploader = ({
  onFileSelect,
  acceptedFormats = ['.pdf', '.docx'],
  maxSizeMB = 10
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndPass = (file) => {
    setError('');
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(ext)) {
      setError(`Invalid file type. Please upload ${acceptedFormats.join(' or ')}.`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect?.(null);
  };

  return (
    <div style={{ width: '100%' }}>
      {!selectedFile ? (
        <div 
          className={`file-uploader-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef} 
            type="file" 
            accept={acceptedFormats.join(',')} 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
          <div style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <UploadCloud size={40} />
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Click to upload or drag & drop resume
          </h4>
          <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
            Supported formats: {acceptedFormats.join(', ').toUpperCase()} (Max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-success)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="flex items-center gap-sm">
            <FileText size={28} color="var(--color-primary)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{selectedFile.name}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for parsing
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X size={16} />
          </Button>
        </div>
      )}

      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.4rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default FileUploader;
