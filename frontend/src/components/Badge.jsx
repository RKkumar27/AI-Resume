import React from 'react';

export const Badge = ({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'demo'
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
