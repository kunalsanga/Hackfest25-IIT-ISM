import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiMail, FiAlertCircle, FiPieChart } from 'react-icons/fi';
import { IoMenu } from "react-icons/io5";
import SentimentAnalysis from './components/SentimentAnalysis';
import SocialMediaStats from './components/SocialMediaStats';
import Login from './components/Login';
import Home from './components/Home';
import { generateAISuggestions, analyzeSentiment } from './services/geminiService';
import { collectSocialMediaData, getSocialMediaStats } from './services/socialMediaService';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const [page, setPage] = useState('home');
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

  const [socialMediaData, setSocialMediaData] = useState({
    source: 'twitter',
    count: 0
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

  const navigateToDashboard = () => {
    setPage('dashboard');
  };

  const navigateToHome = () => {
    setPage('home');
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

    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Simulate initial data loading
        await Promise.all([
          fetchStats(),
          // Add any other initial data fetching here
        ]);
      } catch (err) {
        setError('Failed to load dashboard data. Please try refreshing the page.');
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      initializeApp();
      
      // Set up interval for social media data collection
      const socialMediaInterval = setInterval(async () => {
        try {
          const data = await collectSocialMediaData();
          setSocialMediaData(data);
        } catch (error) {
          console.error('Error collecting social media data:', error);
        }
      }, 5000); // Collect data every 5 seconds
      
      return () => {
        clearInterval(socialMediaInterval);
      };
    }
  }, [isLoggedIn]);

  // Add this function to handle social media data updates
  const handleSocialMediaUpdate = (data) => {
    setSocialMediaData(data);
  };

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <header className="top-bar">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <IoMenu />
            </button>
            <div className="app-title">
              <h1>SENTIVENT</h1>
            </div>
          </header>

          <main className="main-content">
            {isLoading ? (
              <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
              </div>
            ) : error ? (
              <div className="error-screen">
                <div className="error-icon">⚠️</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button className="retry-button" onClick={fetchStats}>
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {page === 'home' ? (
                  <Home onNavigateToDashboard={navigateToDashboard} />
                ) : (
                  <div className="dashboard-container">
                    <div className="grid-container">
                      <div className="grid-left">
                        <div className={`left-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                          <div className="card urgent-issues">
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

                          <div className="charts-container">
                            <div className="card chart-container">
                              <h3>Sentiment Distribution</h3>
                              <div className="chart-row">
                                <div className="pie-chart">
                                  <Pie data={sentimentChartData} options={chartOptions} />
                                </div>
                              </div>
                            </div>

                            <div className="card chart-container">
                              <h3>Social Media Engagement</h3>
                              <div className="chart-row">
                                <div className="social-media-chart">
                                  <SocialMediaStats data={socialMediaData} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid-right">
                        <SentimentAnalysis 
                          feedback={currentFeedback} 
                          onSentimentUpdate={handleSentimentUpdate}
                          sentimentAnalysis={sentimentAnalysis}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            style={{ 
              position: 'fixed', 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: page === 'dashboard' ? 'block' : 'none' // Hide video on home page
            }}
          >
            <source src="/dashvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <h2>Sentivent</h2>
            <nav>
              <a href="#" 
                 className={`menu-item ${page === 'home' ? 'active' : ''}`}
                 onClick={(e) => { e.preventDefault(); navigateToHome(); }}
              >
                <FiPieChart /> Home
              </a>
              <a href="#" 
                 className={`menu-item ${page === 'dashboard' ? 'active' : ''}`}
                 onClick={(e) => { e.preventDefault(); navigateToDashboard(); }}
              >
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
        </div>
      )}
    </>
  );
}

export default App;
