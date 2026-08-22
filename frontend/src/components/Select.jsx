import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [], // array of { value, label } or strings
  placeholder = "Select an option",
  error,
  required = false
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="select-field"
        style={{ borderColor: error ? 'var(--color-danger)' : undefined }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.2rem' }}>{error}</span>}
    </div>
  );
};

export default Select;
