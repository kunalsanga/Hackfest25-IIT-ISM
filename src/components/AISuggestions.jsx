import React, { useState, useEffect } from 'react';
import { getAllTweetData } from '../services/tweetService';
import { generateAISuggestions } from '../services/geminiService';
import './AISuggestions.css';

const AISuggestions = () => {
  const [tweetData, setTweetData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    try {
      const data = getAllTweetData();
      setTweetData(data);
      
      if (data && data.replies && data.replies.data) {
        const processedIssues = data.replies.data.map(reply => {
          const replyAuthor = data.replies.includes.users.find(
            user => user.id === reply.author_id
          );
          
          return {
            id: reply.id,
            text: reply.text,
            author: replyAuthor ? replyAuthor.name : 'Unknown',
            username: replyAuthor ? replyAuthor.username : 'unknown',
            created_at: reply.created_at,
            metrics: reply.public_metrics
          };
        });
        
        processedIssues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setIssues(processedIssues);
      } else {
        setIssues([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading or processing tweet data:", err);
      setError("Failed to load tweet data. Please try again.");
      setLoading(false);
    }
  }, []);

  const handleReplyClick = async (issue) => {
    setSelectedReply(issue);
    setLoadingAi(true);
    setAiResponse(null);
    
    try {
      const issueText = issue.text;
      
      const aiSuggestion = await generateAISuggestions([{
        title: "Issue from Twitter Reply",
        description: issueText
      }]);
      
      setAiResponse(aiSuggestion);
    } catch (err) {
      setError("Failed to generate AI suggestion. Please try again.");
      console.error("Error generating AI suggestion:", err);
      setAiResponse(null);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return <div className="ai-suggestions-loading"><div className="loading-spinner"></div><p>Loading tweet data...</p></div>;
  }

  if (error && !tweetData) {
    return <div className="ai-suggestions-error"><p>{error}</p></div>;
  }

  return (
    <div className="ai-suggestions-container">
      <div className="ai-suggestions-header">
        <h2>AI Suggestions for Twitter Issues</h2>
        <p>Click on a reply to see AI-generated solutions</p>
      </div>
      
      <div className="ai-suggestions-content">
        <div className="original-tweet-section">
          <h3>Original Tweet</h3>
          {tweetData && tweetData.original_tweet && tweetData.original_tweet.data && (
            <div className="tweet-card">
              <div className="tweet-header">
                {tweetData.replies.includes.users.find(u => u.id === tweetData.original_tweet.data.author_id) ? (
                    <div className="avatar" style={{}}>
                        {tweetData.replies.includes.users.find(u => u.id === tweetData.original_tweet.data.author_id).name.charAt(0)}
                    </div>
                ) : (
                    <div className="avatar">?</div>
                )}
                <div className="tweet-author">
                  <div className="author-name">{tweetData.replies.includes.users.find(u => u.id === tweetData.original_tweet.data.author_id)?.name ?? 'Unknown Author'}</div>
                  <div className="author-handle">@{tweetData.replies.includes.users.find(u => u.id === tweetData.original_tweet.data.author_id)?.username ?? 'unknown'}</div>
                </div>
              </div>
              <div className="tweet-content">
                <p>{tweetData.original_tweet.data.text}</p>
              </div>
              <div className="tweet-metrics">
                <span className="metric"><svg>...</svg> {tweetData.original_tweet.data.public_metrics.retweet_count} Retweets</span>
                <span className="metric"><svg>...</svg> {tweetData.original_tweet.data.public_metrics.like_count} Likes</span>
                <span className="metric"><svg>...</svg> {tweetData.original_tweet.data.public_metrics.reply_count} Replies</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="replies-section">
          <h3>Replies & Issues ({issues.length})</h3>
          <div className="replies-list">
            {issues.length > 0 ? (
              issues.map(issue => (
                <div 
                  key={issue.id} 
                  className={`reply-card ${selectedReply && selectedReply.id === issue.id ? 'selected' : ''}`}
                  onClick={() => handleReplyClick(issue)}
                >
                  <div className="reply-header">
                     <div className="reply-avatar">
                         {issue.author.charAt(0)}
                     </div>
                    <div className="reply-author">
                      <div className="reply-author-name">{issue.author}</div>
                      <div className="reply-author-handle">@{issue.username}</div>
                    </div>
                  </div>
                  <p className="reply-content">{issue.text}</p>
                  <div className="reply-metrics">
                    <span className="metric"><svg>...</svg> {issue.metrics.like_count} Likes</span>
                    <span className="metric"><svg>...</svg> {issue.metrics.retweet_count} Retweets</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="ai-placeholder"><p>No replies found for this tweet.</p></div>
            )}
          </div>
        </div>
        
        <div className="ai-suggestion-section">
          <h3>AI Solution</h3>
          {selectedReply ? (
            loadingAi ? (
              <div className="ai-loading">
                <div className="ai-loading-spinner"></div>
                <p>Generating AI solution for: "{selectedReply.text}"</p>
              </div>
            ) : aiResponse ? (
              <div className="ai-response">
                 <h4>🤖 Solution for: "{selectedReply.text}"</h4>
                {Array.isArray(aiResponse) ? (
                  aiResponse.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      {suggestion.title && <h5>{suggestion.title}</h5>}
                      <p>{suggestion.description || 'No description provided.'}</p>
                      {suggestion.steps && Array.isArray(suggestion.steps) && (
                        <div className="suggestion-steps">
                          <h6>Steps:</h6>
                          <ol>
                            {suggestion.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {(suggestion.priority || suggestion.impact) && (
                          <div className="suggestion-meta">
                              {suggestion.priority && <span className={`priority ${suggestion.priority.toLowerCase()}`}>Priority: {suggestion.priority}</span>}
                              {suggestion.impact && <span className="impact">Impact: {suggestion.impact}</span>}
                          </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>{typeof aiResponse === 'string' ? aiResponse : 'Generated suggestion format is unexpected.'}</p>
                )}
              </div>
            ) : (
              <div className="ai-error">
                <p>{error || "Failed to generate AI solution. Please try clicking the reply again."}</p>
              </div>
            )
          ) : (
            <div className="ai-placeholder">
              <p>Select a reply from the list to see AI-generated solutions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestions; 