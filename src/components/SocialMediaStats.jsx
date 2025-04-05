import { useState, useEffect } from 'react';
import './SocialMediaStats.css';

const SocialMediaStats = ({ data }) => {
  const [stats, setStats] = useState({
    twitter: 0,
    instagram: 0,
    linkedin: 0
  });

  useEffect(() => {
    if (data) {
      // Update stats when new data comes in
      setStats(prevStats => ({
        ...prevStats,
        [data.source]: prevStats[data.source] + 1
      }));
    }
  }, [data]);

  // Calculate the maximum value for scaling the bars
  const maxValue = Math.max(...Object.values(stats)) || 1;

  return (
    <div className="social-media-stats">
      <div className="stats-container">
        <div className="stat-bar">
          <div className="bar-label">Twitter</div>
          <div className="bar-container">
            <div 
              className="bar twitter-bar" 
              style={{ 
                height: `${(stats.twitter / maxValue) * 100}%`,
                backgroundColor: '#1DA1F2'
              }}
            >
              <span className="bar-value">{stats.twitter}</span>
            </div>
          </div>
        </div>
        <div className="stat-bar">
          <div className="bar-label">Instagram</div>
          <div className="bar-container">
            <div 
              className="bar instagram-bar" 
              style={{ 
                height: `${(stats.instagram / maxValue) * 100}%`,
                backgroundColor: '#E1306C'
              }}
            >
              <span className="bar-value">{stats.instagram}</span>
            </div>
          </div>
        </div>
        <div className="stat-bar">
          <div className="bar-label">LinkedIn</div>
          <div className="bar-container">
            <div 
              className="bar linkedin-bar" 
              style={{ 
                height: `${(stats.linkedin / maxValue) * 100}%`,
                backgroundColor: '#0077B5'
              }}
            >
              <span className="bar-value">{stats.linkedin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStats; 