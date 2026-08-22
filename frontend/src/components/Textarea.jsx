import React from 'react';

export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  helperText,
  required = false,
  disabled = false,
  style = {},
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      
      <textarea
        className={`textarea-field ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        style={style}
        {...props}
      />

      {error && <span className="text-danger" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</span>}
      {helperText && !error && <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{helperText}</span>}
    </div>
  );
};

export default Textarea;
