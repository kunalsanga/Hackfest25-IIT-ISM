import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiUser, FiChevronDown } from 'react-icons/fi';
import videoBackground from '../assets/login-page-video.mp4';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const particlesCount = 15;
      const newParticles = [];
      
      for (let i = 0; i < particlesCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 30 + 10,
          animationDuration: Math.random() * 20 + 10,
          opacity: Math.random() * 0.6 + 0.1
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);

  const scrollToLogin = () => {
    const loginForm = document.getElementById('login-section');
    loginForm.scrollIntoView({ behavior: 'smooth' });
  };

  const validateForm = () => {
    setError('');
    
    // Basic validation
    if (isRegistering && !name) {
      setError('Please enter your name');
      return false;
    }
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Bypass authentication - allow access regardless of credentials
      // Create a mock user object
      const mockUser = {
        id: '1',
        name: name || 'Demo User',
        email: email,
        role: 'admin'
      };
      
      // Store mock token in localStorage
      localStorage.setItem('token', 'mock-token-123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Call the onLogin function with the mock user
      onLogin(mockUser);
      
      // No need to make API calls
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRegisterMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="login-container">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video-element">
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      
      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.animationDuration}s`
          }}
        />
      ))}
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to SENTIVENT</h1>
          <p className="welcome-subtitle">Advanced sentiment analysis for your events and attendee feedback</p>
          <button className="scroll-down-button" onClick={scrollToLogin}>
            <span>{isRegistering ? 'Register' : 'Login'}</span>
            <FiChevronDown className="scroll-icon" />
          </button>
        </div>
      </div>
      
      {/* Login/Register Section */}
      <div id="login-section" className="login-section">
        <div className="login-card">
          <div className="login-header">
            <FiUser className="login-icon" />
            <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
            <p>{isRegistering 
              ? 'Register to access SENTIVENT dashboard' 
              : 'Welcome back! Please login to your account'}
            </p>
          </div>

          {error && <div className={error.includes('successful') ? 'login-success' : 'login-error'}>{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Name field - only shown during registration */}
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser className="input-icon" />
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="input-icon" />
                <span>Password</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isRegistering ? 'Registering...' : 'Signing in...') 
                  : (isRegistering ? 'Register' : 'Sign In')}
              </button>
            </div>
          </form>

          <div className="login-footer">
            {isRegistering ? (
              <p>Already have an account? <a href="#" onClick={toggleRegisterMode}>Sign In</a></p>
            ) : (
              <p>Don't have an account? <a href="#" onClick={toggleRegisterMode}>Register</a></p>
            )}
            {!isRegistering && <p><a href="#">Forgot Password?</a></p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 