import React from 'react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';
import InputField from './InputField';
import GradientButton from './GradientButton';
import useForm from '../../hooks/useForm';
import bgImage from '../../assets/auth-bg.png';
import './Auth.css';

const SignupPage = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  const validate = (values) => {
    const errors = {};
    
    if (!values.firstName) errors.firstName = 'First name is required';
    if (!values.lastName) errors.lastName = 'Last name is required';
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email format is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!values.terms) {
      errors.terms = 'You must accept the terms';
    }

    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isValid
  } = useForm(initialValues, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signup successful:', values);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <img src={bgImage} alt="Background" className="bg-image" />
        <div className="bg-gradient-overlay" />
        <div className="animated-gradient" />
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-dot" />
        <span>Vectra System Active</span>
      </div>

      <AuthCard>
        <div className="auth-header">
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Start automating smarter today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group-row">
            <InputField
              id="firstName"
              label="First Name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
              touched={touched.firstName}
            />
            <InputField
              id="lastName"
              label="Last Name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
              touched={touched.lastName}
            />
          </div>
          
          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
          />

          <div className="auth-extras">
            <label className={`checkbox-wrapper ${errors.terms && touched.terms ? 'has-error' : ''}`}>
              <input 
                id="terms"
                type="checkbox" 
                checked={values.terms}
                onChange={handleChange}
              />
              <span>I agree to the Terms & Conditions</span>
            </label>
          </div>

          <GradientButton disabled={!isValid}>Create Account</GradientButton>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login" className="footer-link">Sign In</Link>
          </p>
        </div>

        <div className="micro-text">
          <span>Secure</span>
          <span>•</span>
          <span>Encrypted</span>
          <span>•</span>
          <span>Reliable</span>
        </div>
      </AuthCard>
    </div>
  );
};

export default SignupPage;

