import React from 'react';

export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-md" style={{ padding: 'var(--space-2xl) 0', width: '100%' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
};

export default Loader;
