import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from './AuthCard';
import InputField from './InputField';
import GradientButton from './GradientButton';
import useForm from '../../hooks/useForm';
import bgImage from '../../assets/auth-bg.jpeg';
import { authAPI } from '../../lib/api';
import Footer from '../../layouts/Footer';
import './Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setApiError('');
        const res = await authAPI.signup(
          values.firstName,
          values.lastName,
          values.email,
          values.password,
          values.confirmPassword
        );
        if (res.status === 'success') {
          navigate('/dashboard');
        } else {
          setApiError(res.message || 'Signup failed');
        }
      } catch (err) {
        setApiError(err.response?.data?.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <img src={bgImage} alt="Background" className="bg-image" />
      </div>



      <AuthCard className="signup-card">
        <div className="auth-card-content">
          <div className="auth-card-left">
            <div className="auth-header">
              <h1 className="auth-title">Create Your Account</h1>
              <p className="auth-subtitle">Start automating smarter today</p>
            </div>
            
            <div className="micro-text">
              <span>Secure</span>
              <span>•</span>
              <span>Encrypted</span>
              <span>•</span>
              <span>Reliable</span>
            </div>
          </div>

          <div className="auth-card-right">
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
          </div>
        </div>
      </AuthCard>
      <Footer />
    </div>
  );
};

export default SignupPage;

