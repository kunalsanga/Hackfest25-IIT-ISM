import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiMail, FiAlertCircle, FiPieChart } from 'react-icons/fi';
import { IoMenu } from "react-icons/io5";
import SentimentAnalysis from './components/SentimentAnalysis';
import Login from './components/Login';
import { generateAISuggestions, analyzeSentiment } from './services/geminiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [sentimentData, setSentimentData] = useState({
    messages: { count: 120, change: '+20%' },
    emails: { count: 85, change: '+35%' },
    avgFirstReply: '30:15',
    avgFullResolve: '22:40'
  });

  const [sentimentAnalysis, setSentimentAnalysis] = useState({
    positive: 60,
    neutral: 15,
    negative: 25,
    recentFeedback: []
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);

  const [stats, setStats] = useState({
    twitterTweets: 0,
    instagramQueries: 0,
    messagesReceived: 0,
    emailsReceived: 0,
    messagesPercentage: 0,
    emailsPercentage: 0
  });

  const handleSentimentUpdate = (newAnalysis) => {
    setSentimentAnalysis(newAnalysis);
  };

  // Simulated feedback for testing
  const [currentFeedback, setCurrentFeedback] = useState('');
  
  useEffect(() => {
    const feedbackExamples = [
      "Great session! Loved the speaker's energy!",
      "The registration process was too slow.",
      "Audio quality could be better in Hall B.",
      "Amazing organization and helpful staff!",
      "Long queues at the food court.",
      "The mobile app keeps crashing."
    ];

    const interval = setInterval(() => {
      const randomFeedback = feedbackExamples[Math.floor(Math.random() * feedbackExamples.length)];
      setCurrentFeedback(randomFeedback);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestionError(null);
    try {
      const issues = [
        {
          title: "Long Queue",
          description: "Main entrance experiencing extremely long wait times"
        },
        {
          title: "Audio Glitch",
          description: "Intermittent audio issues reported in Hall A"
        }
      ];
      
      const suggestions = await generateAISuggestions(issues);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestionError("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const analyzeFeedback = async () => {
      if (currentFeedback) {
        try {
          const analysis = await analyzeSentiment(currentFeedback);
          // Update sentiment analysis based on the AI response
          setSentimentAnalysis(prev => ({
            ...prev,
            [analysis.sentiment]: prev[analysis.sentiment] + 1,
            recentFeedback: [...prev.recentFeedback, {
              text: currentFeedback,
              sentiment: analysis.sentiment,
              confidence: analysis.confidence,
              keyPoints: analysis.keyPoints
            }].slice(-5) // Keep only the last 5 feedback items
          }));
        } catch (error) {
          console.error("Error analyzing feedback:", error);
        }
      }
    };

    analyzeFeedback();
  }, [currentFeedback]);

  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentAnalysis.positive, sentimentAnalysis.neutral, sentimentAnalysis.negative],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green for positive
          'rgba(234, 179, 8, 0.8)',  // Yellow for neutral
          'rgba(239, 68, 68, 0.8)'   // Red for negative
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f8fafc',
          padding: 20,
        },
      },
    },
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    // Simulate fetching stats data
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        const mockStats = {
          twitterTweets: 1245,
          instagramQueries: 876,
          messagesReceived: 532,
          emailsReceived: 789,
          messagesPercentage: 15,
          emailsPercentage: 8
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="dashboard">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ position: 'fixed', width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/dashvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <h2>Sentivent</h2>
            <nav>
              <a href="#" className="menu-item active">
                <FiPieChart /> Dashboard
              </a>
              <a href="#" className="menu-item">
                <FiMessageCircle /> Messages
              </a>
              <a href="#" className="menu-item">
                <FiMail /> Emails
              </a>
              <a href="#" className="menu-item">
                <FiAlertCircle /> Alerts
              </a>
            </nav>
            <div className="user-section">
              <div className="user-info">
                <span className="user-email">{user?.email}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </aside>

          <main className="main-content">
            <div className="menu-toggle">
              <IoMenu onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <header className="dashboard-header">
              <div className="header-content">
                <h1>Sentivent</h1>
                <div className="date-display">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </header>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Twitter Tweets</h3>
                  <p className="stat-value">{stats.twitterTweets}</p>
                  <p className="stat-label">Total tweets received</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Instagram Queries</h3>
                  <p className="stat-value">{stats.instagramQueries}</p>
                  <p className="stat-label">Total queries received</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon message">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Messages Received</h3>
                  <p className="stat-value">{stats.messagesReceived}</p>
                  <div className="stat-percentage positive">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                    </svg>
                    {stats.messagesPercentage}%
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon email">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Emails Received</h3>
                  <p className="stat-value">{stats.emailsReceived}</p>
                  <div className="stat-percentage positive">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                    </svg>
                    {stats.emailsPercentage}%
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className={`card urgent-issues ${isSidebarOpen ? 'blur' : ''}`}>
                <div className="card-header">
                  <h3>Urgent Issues</h3>
                  <button 
                    className="refresh-button"
                    onClick={fetchSuggestions}
                    disabled={isLoadingSuggestions}
                  >
                    {isLoadingSuggestions ? 'Refreshing...' : 'Refresh Suggestions'}
                  </button>
                </div>
                <div className="urgent-issues-list">
                  <div className="urgent-issue-item">
                    <div className="issue-header">
                      <span className="severity-badge very-high">Very High</span>
                      <h4>Long Queue</h4>
                    </div>
                    <p>Main entrance experiencing extremely long wait times</p>
                    <div className="issue-meta">
                      <span className="location">Location: Main Entrance</span>
                      <span className="time">Reported: 5 minutes ago</span>
                    </div>
                  </div>
                  <div className="urgent-issue-item">
                    <div className="issue-header">
                      <span className="severity-badge high">High</span>
                      <h4>Audio Glitch</h4>
                    </div>
                    <p>Intermittent audio issues reported in Hall A</p>
                    <div className="issue-meta">
                      <span className="location">Location: Hall A</span>
                      <span className="time">Reported: 15 minutes ago</span>
                    </div>
                  </div>
                </div>

                <div className="ai-suggestions">
                  <h3>AI Generated Suggestions</h3>
                  {suggestionError ? (
                    <div className="error-message">
                      {suggestionError}
                      <button onClick={fetchSuggestions} className="retry-button">
                        Retry
                      </button>
                    </div>
                  ) : isLoadingSuggestions ? (
                    <div className="loading-suggestions">
                      <div className="loading-spinner"></div>
                      Generating suggestions...
                    </div>
                  ) : aiSuggestions.length > 0 ? (
                    aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="suggestion-item">
                        <div className="suggestion-header">
                          <span className="suggestion-icon">🤖</span>
                          <h4>{suggestion.title}</h4>
                        </div>
                        <p>{suggestion.description}</p>
                        <div className="suggestion-meta">
                          <span className={`priority ${suggestion.priority.toLowerCase()}`}>
                            Priority: {suggestion.priority}
                          </span>
                          <span className="impact">Impact: {suggestion.impact}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-suggestions">
                      No suggestions available at the moment.
                    </div>
                  )}
                </div>
              </div>

              <SentimentAnalysis 
                feedback={currentFeedback} 
                onSentimentUpdate={handleSentimentUpdate}
                sentimentAnalysis={sentimentAnalysis}
              />
            </div>

            <div className="card chart-container">
              <h3>Sentiment Distribution</h3>
              <div className="pie-chart">
                <Pie data={sentimentChartData} options={chartOptions} />
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
