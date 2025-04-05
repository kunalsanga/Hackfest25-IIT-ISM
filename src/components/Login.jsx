import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiUser, FiChevronDown } from 'react-icons/fi';
import videoBackground from '../assets/login-page-video.mp4';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // In a real application, you would call an API here
      // For now, we'll just simulate a successful login
      onLogin({ email });
    }, 1500);
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
            <span>Login</span>
            <FiChevronDown className="scroll-icon" />
          </button>
        </div>
      </div>
      
      {/* Login Section */}
      <div id="login-section" className="login-section">
        <div className="login-card">
          <div className="login-header">
            <FiUser className="login-icon" />
            <h2>Sign In</h2>
            <p>Welcome back! Please login to your account</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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
                autoComplete="current-password"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#">Register</a></p>
            <p><a href="#">Forgot Password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 