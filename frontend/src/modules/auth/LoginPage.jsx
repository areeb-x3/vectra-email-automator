import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from './AuthCard';
import InputField from './InputField';
import GradientButton from './GradientButton';
import useForm from '../../hooks/useForm';
import bgImage from '../../assets/login.jpeg';
import { authAPI } from '../../lib/api';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setApiError('');
        const res = await authAPI.login(values.email, values.password);
        if (res.status === 'success') {
          navigate('/dashboard');
        } else {
          setApiError(res.message || 'Login failed');
        }
      } catch (err) {
        setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <img src={bgImage} alt="Background" className="bg-image" />
      </div>



      <AuthCard>
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Vectra dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="auth-error-alert" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#f43f5e',
              padding: '0.75rem',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}>
              {apiError}
            </div>
          )}
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

