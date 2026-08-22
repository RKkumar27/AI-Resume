import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't process this request. Please try again.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <div style={{
        padding: '1rem',
        borderRadius: '50%',
        backgroundColor: 'var(--color-danger-bg)',
        color: 'var(--color-danger)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AlertCircle size={36} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.35rem' }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: '0.875rem', maxWidth: '360px', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
