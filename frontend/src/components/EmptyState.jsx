import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data available",
  description = "Get started by adding or creating a new item.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <div style={{
        padding: '1rem',
        borderRadius: '50%',
        backgroundColor: 'var(--color-bg-card-hover)',
        color: 'var(--color-text-subtle)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={36} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.35rem' }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: '0.875rem', maxWidth: '360px', marginBottom: '1.25rem' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
