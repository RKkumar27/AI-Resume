import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  interactive = false,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      style={style}
    >
      {(title || action) && (
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.2rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
