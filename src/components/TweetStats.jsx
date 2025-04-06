import React, { useState, useEffect } from 'react';
import { getTweetData, getTweetMetrics, getTweetSentiment, getReplySentiment } from '../services/tweetService';
import './TweetStats.css';

const TweetStats = () => {
  const [tweetData, setTweetData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [tweetSentiment, setTweetSentiment] = useState(null);
  const [replySentiment, setReplySentiment] = useState(null);

  useEffect(() => {
    // Load tweet data
    const data = getTweetData();
    setTweetData(data);
    
    // Load metrics
    const tweetMetrics = getTweetMetrics();
    setMetrics(tweetMetrics);
    
    // Load sentiment data
    const tweetSent = getTweetSentiment();
    setTweetSentiment(tweetSent);
    
    const replySent = getReplySentiment();
    setReplySentiment(replySent);
  }, []);

  if (!tweetData || !metrics || !tweetSentiment || !replySentiment) {
    return <div>Loading tweet data...</div>;
  }

  const originalTweet = tweetData.original_tweet.data;
  const author = tweetData.original_tweet.includes.users[0];
  const replies = tweetData.replies.data;

  return (
    <div className="tweet-stats-container">
      <div className="tweet-card">
        <div className="tweet-header">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`} 
            alt={author.name} 
            className="avatar"
          />
          <div className="tweet-author">
            <h3>{author.name}</h3>
            <p>@{author.username}</p>
          </div>
        </div>
        
        <div className="tweet-content">
          <p>{originalTweet.text}</p>
          <div className="tweet-metrics">
            <div className="metric">
              <span className="metric-value">{metrics.retweets}</span>
              <span className="metric-label">Retweets</span>
            </div>
            <div className="metric">
              <span className="metric-value">{metrics.likes}</span>
              <span className="metric-label">Likes</span>
            </div>
            <div className="metric">
              <span className="metric-value">{metrics.replies}</span>
              <span className="metric-label">Replies</span>
            </div>
            <div className="metric">
              <span className="metric-value">{metrics.impressions}</span>
              <span className="metric-label">Impressions</span>
            </div>
          </div>
        </div>

        <div className="sentiment-analysis">
          <h4>Sentiment Analysis</h4>
          <div className="sentiment-bars">
            <div className="sentiment-bar">
              <div 
                className="bar positive" 
                style={{ width: `${tweetSentiment.positive * 100}%` }}
              >
                <span>Positive</span>
              </div>
              <div 
                className="bar neutral" 
                style={{ width: `${tweetSentiment.neutral * 100}%` }}
              >
                <span>Neutral</span>
              </div>
              <div 
                className="bar negative" 
                style={{ width: `${tweetSentiment.negative * 100}%` }}
              >
                <span>Negative</span>
              </div>
            </div>
          </div>
        </div>

        {replies.length > 0 && (
          <div className="replies-section">
            <h4>Replies</h4>
            {replies.map(reply => {
              const replyAuthor = tweetData.replies.includes.users.find(
                user => user.id === reply.author_id
              );
              return (
                <div key={reply.id} className="reply-card">
                  <div className="reply-header">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(replyAuthor.name)}&background=random`} 
                      alt={replyAuthor.name} 
                      className="avatar"
                    />
                    <div className="reply-author">
                      <h4>{replyAuthor.name}</h4>
                      <p>@{replyAuthor.username}</p>
                    </div>
                  </div>
                  <p className="reply-text">{reply.text}</p>
                  <div className="reply-metrics">
                    <span>{reply.public_metrics.like_count} likes</span>
                    <span>{reply.public_metrics.retweet_count} retweets</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetStats; 