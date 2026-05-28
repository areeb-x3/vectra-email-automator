import React from 'react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';
import InputField from './InputField';
import GradientButton from './GradientButton';
import useForm from '../../hooks/useForm';
import bgImage from '../../assets/auth-bg.png';
import './Auth.css';

const LoginPage = () => {
  const initialValues = {
    email: '',
    password: ''
  };

  const validate = (values) => {
    const errors = {};
    
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
      console.log('Login successful:', values);
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Vectra dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

          <div className="auth-extras">
            <label className="checkbox-wrapper">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="#" className="forgot-link">Forgot Password?</Link>
          </div>

          <GradientButton disabled={!isValid}>Sign In</GradientButton>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/signup" className="footer-link">Sign Up</Link>
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

export default LoginPage;

