import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Delete",
  confirmVariant = "danger",
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="440px"
      footer={
        <div className="flex items-center justify-end gap-sm" style={{ width: '100%' }}>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-md items-center">
        <div style={{
          padding: '0.75rem',
          borderRadius: '50%',
          backgroundColor: confirmVariant === 'danger' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
          color: confirmVariant === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)'
        }}>
          <AlertTriangle size={24} />
        </div>
        <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
