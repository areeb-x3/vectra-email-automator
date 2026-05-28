import { useState, useCallback } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, currentValues) => {
    const validationErrors = validate(currentValues || values);
    return validationErrors[name] || '';
  }, [validate, values]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    const newValues = { ...values, [id]: val };
    setValues(newValues);

    // Revalidate form for live feedback if errors exist
    const validationErrors = validate(newValues);
    
    // Only update errors for fields that were already touched or already had errors
    const updatedErrors = { ...errors };
    Object.keys(newValues).forEach(key => {
      if (touched[key] || errors[key]) {
        updatedErrors[key] = validationErrors[key] || '';
      }
    });

    // Special case: if password changes, always check confirmPassword if it's been touched
    if (id === 'password' && touched.confirmPassword) {
      updatedErrors.confirmPassword = validationErrors.confirmPassword || '';
    }

    setErrors(updatedErrors);
  };


  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    const fieldError = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: fieldError }));
  };

  const validateForm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return Object.keys(validationErrors).length === 0;
  };

  const isValid = Object.keys(validate(values)).length === 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isValid,
    setValues
  };
};

export default useForm;
