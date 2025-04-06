import React, { useState, useEffect } from 'react';
import { getTweetData } from '../services/tweetService';
import { generateAISuggestions } from '../services/geminiService';
import './AISuggestions.css';

const AISuggestions = () => {
  const [tweetData, setTweetData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // Load tweet data
    const data = getTweetData();
    setTweetData(data);
    
    // Extract issues from replies
    if (data && data.replies && data.replies.data) {
      const issues = data.replies.data.map(reply => {
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
      
      setSuggestions(issues);
    }
    
    setLoading(false);
  }, []);

  const handleReplyClick = async (reply) => {
    setSelectedReply(reply);
    setLoadingAi(true);
    setAiResponse(null);
    
    try {
      // Extract the issue from the reply text
      const issueText = reply.text;
      
      // Generate AI suggestion using Gemini API
      const aiSuggestion = await generateAISuggestions([{
        title: "Issue from Twitter Reply",
        description: issueText
      }]);
      
      setAiResponse(aiSuggestion);
    } catch (err) {
      setError("Failed to generate AI suggestion. Please try again.");
      console.error("Error generating AI suggestion:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return <div className="ai-suggestions-loading">Loading tweet data...</div>;
  }

  if (error) {
    return <div className="ai-suggestions-error">{error}</div>;
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
          {tweetData && tweetData.original_tweet && (
            <div className="tweet-card">
              <div className="tweet-header">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tweetData.original_tweet.includes.users[0].name)}&background=random`} 
                  alt={tweetData.original_tweet.includes.users[0].name} 
                  className="avatar"
                />
                <div className="tweet-author">
                  <h4>{tweetData.original_tweet.includes.users[0].name}</h4>
                  <p>@{tweetData.original_tweet.includes.users[0].username}</p>
                </div>
              </div>
              <div className="tweet-content">
                <p>{tweetData.original_tweet.data.text}</p>
                <div className="tweet-metrics">
                  <span>{tweetData.original_tweet.data.public_metrics.retweet_count} retweets</span>
                  <span>{tweetData.original_tweet.data.public_metrics.like_count} likes</span>
                  <span>{tweetData.original_tweet.data.public_metrics.reply_count} replies</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="replies-section">
          <h3>Replies & Issues</h3>
          <div className="replies-list">
            {suggestions.map(reply => (
              <div 
                key={reply.id} 
                className={`reply-card ${selectedReply && selectedReply.id === reply.id ? 'selected' : ''}`}
                onClick={() => handleReplyClick(reply)}
              >
                <div className="reply-header">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author)}&background=random`} 
                    alt={reply.author} 
                    className="avatar"
                  />
                  <div className="reply-author">
                    <h4>{reply.author}</h4>
                    <p>@{reply.username}</p>
                  </div>
                </div>
                <p className="reply-text">{reply.text}</p>
                <div className="reply-metrics">
                  <span>{reply.metrics.like_count} likes</span>
                  <span>{reply.metrics.retweet_count} retweets</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="ai-suggestion-section">
          <h3>AI Solution</h3>
          {selectedReply ? (
            loadingAi ? (
              <div className="ai-loading">
                <div className="ai-loading-spinner"></div>
                <p>Generating AI solution...</p>
              </div>
            ) : aiResponse ? (
              <div className="ai-suggestion-card">
                <div className="ai-suggestion-header">
                  <span className="ai-icon">🤖</span>
                  <h4>Solution for: {selectedReply.text}</h4>
                </div>
                <div className="ai-suggestion-content">
                  {aiResponse.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <h5>{suggestion.title}</h5>
                      <p>{suggestion.description}</p>
                      {suggestion.steps && (
                        <div className="suggestion-steps">
                          <h6>Steps to resolve:</h6>
                          <ol>
                            {suggestion.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ai-error">
                <p>Failed to generate AI solution. Please try again.</p>
              </div>
            )
          ) : (
            <div className="ai-placeholder">
              <p>Select a reply to see AI-generated solutions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestions; 