import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, ArrowRight, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setValidationErrors({ terms: 'You must agree to the terms and conditions' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate('/');
    }
  };

  const features = [
    'Track your immigration case status',
    'AI-powered document analysis',
    'Interview preparation tools',
    'Expert attorney connections'
  ];

  return (
    <div className="auth-page-split">
      {/* Left Panel - Branding */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo-row">
            <div className="auth-brand-logo">
              <Shield size={32} />
            </div>
            <span className="auth-brand-name">AEGIS</span>
          </div>

          <div className="auth-brand-text">
            <h1>Your Smart Path to Immigration Success</h1>
            <p>Navigate the complex immigration process with confidence using our AI-powered platform</p>
          </div>

          <div className="auth-features">
            {features.map((feature, index) => (
              <div key={index} className="auth-feature-item">
                <div className="auth-feature-check">
                  <Check size={14} />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Join AEGIS and start your immigration journey</p>
          </div>

          {/* Toggle */}
          <div className="auth-toggle">
            <Link to="/signin" className="auth-toggle-btn inactive">Sign In</Link>
            <button className="auth-toggle-btn active">Create Account</button>
          </div>

          {error && (
            <div className="auth-error-banner">
              <span>{error}</span>
              <button onClick={clearError}>×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className={`input-wrapper ${validationErrors.name ? 'error' : ''}`}>
                <User size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.name && (
                <span className="validation-error">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`input-wrapper ${validationErrors.email ? 'error' : ''}`}>
                <Mail size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <span className="validation-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${validationErrors.password ? 'error' : ''}`}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.password && (
                <span className="validation-error">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={`input-wrapper ${validationErrors.confirmPassword ? 'error' : ''}`}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
              {validationErrors.confirmPassword && (
                <span className="validation-error">{validationErrors.confirmPassword}</span>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me terms-checkbox">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked && validationErrors.terms) {
                      setValidationErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                />
                <span className="checkmark"></span>
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {validationErrors.terms && (
                <span className="validation-error">{validationErrors.terms}</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <div className="auth-social">
            <button className="social-btn" disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="social-btn" disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="auth-footer-text">
            <p>Already have an account? <Link to="/signin">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
