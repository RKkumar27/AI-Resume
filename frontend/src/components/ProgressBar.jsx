import React from 'react';

export const ProgressBar = ({ progress = 0, label, showValue = true }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%', marginBottom: 'var(--space-sm)' }}>
      {(label || showValue) && (
        <div className="flex items-center justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
          {label && <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>{label}</span>}
          {showValue && <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clampedProgress}%</span>}
        </div>
      )}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${clampedProgress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
