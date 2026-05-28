import React from 'react';
import './Auth.css';

const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  onBlur,
  placeholder = " ", 
  required = true, 
  id,
  error,
  touched
}) => {
  const showError = error && touched;

  return (
    <div className={`input-group ${showError ? 'has-error' : ''}`}>
      <input
        id={id}
        type={type}
        className="input-field"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
      />
      <label htmlFor={id} className="floating-label">
        {label}
      </label>
      {showError && <span className="error-message">{error}</span>}
    </div>
  );
};

export default InputField;

