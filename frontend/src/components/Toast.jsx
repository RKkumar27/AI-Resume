import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <CheckCircle2 size={18} color="var(--color-success)" />,
    error: <AlertCircle size={18} color="var(--color-danger)" />,
    warning: <AlertTriangle size={18} color="var(--color-warning)" />,
    info: <Info size={18} color="var(--color-info)" />
  };

  const borders = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(59, 130, 246, 0.4)'
  };

  return (
    <div className="toast" style={{ borderColor: borders[type] || 'var(--color-border)' }}>
      {icons[type]}
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', display: 'flex' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
