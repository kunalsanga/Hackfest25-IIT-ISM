import { useState, useEffect } from 'react';
import { FiMessageCircle, FiMail, FiAlertCircle, FiPieChart } from 'react-icons/fi';
import { IoMenu } from "react-icons/io5";
import SentimentAnalysis from './components/SentimentAnalysis';
import Login from './components/Login';
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

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="dashboard">
          <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <h2>CRM Dashboard</h2>
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
            <div className="dashboard-grid">
              <div className={`card urgent-issues ${isSidebarOpen ? 'blur' : ''}`}>
                <h3>Urgent Issues</h3>
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
                  <div className="suggestion-item">
                    <div className="suggestion-header">
                      <span className="suggestion-icon">🤖</span>
                      <h4>Deploy Additional Staff</h4>
                    </div>
                    <p>Based on the long queue issue at the main entrance, consider deploying 2-3 additional staff members to handle the increased traffic.</p>
                    <div className="suggestion-meta">
                      <span className="priority">Priority: High</span>
                      <span className="impact">Impact: Immediate</span>
                    </div>
                  </div>
                  <div className="suggestion-item">
                    <div className="suggestion-header">
                      <span className="suggestion-icon">🤖</span>
                      <h4>Check Sound System</h4>
                    </div>
                    <p>For the audio glitch in Hall A, recommend conducting a thorough sound system check and having backup equipment ready.</p>
                    <div className="suggestion-meta">
                      <span className="priority">Priority: High</span>
                      <span className="impact">Impact: Immediate</span>
                    </div>
                  </div>
                </div>
              </div>

              <SentimentAnalysis 
                feedback={currentFeedback} 
                onSentimentUpdate={handleSentimentUpdate}
              />
            </div>

            <div className="card chart-container">
              <h3>Sentiment Distribution</h3>
              <div className="pie-chart">
                <Pie data={sentimentChartData} options={chartOptions} />
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Avg First Reply Time</h3>
                <div className="stat-value">{sentimentData.avgFirstReply}</div>
              </div>
              <div className="stat-card">
                <h3>Avg Full Resolve Time</h3>
                <div className="stat-value">{sentimentData.avgFullResolve}</div>
              </div>
              <div className="stat-card">
                <h3>Messages</h3>
                <div className="stat-value">
                  {sentimentData.messages.count}
                  <span className="stat-change">{sentimentData.messages.change}</span>
                </div>
              </div>
              <div className="stat-card">
                <h3>Emails</h3>
                <div className="stat-value">
                  {sentimentData.emails.count}
                  <span className="stat-change">{sentimentData.emails.change}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
