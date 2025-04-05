import { useState, useEffect } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

const SentimentAnalysis = ({ feedback, onSentimentUpdate }) => {
  const [analysis, setAnalysis] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
    recentFeedback: []
  });

  useEffect(() => {
    if (feedback) {
      const result = sentiment.analyze(feedback);
      const sentimentScore = result.score;
      
      let sentimentType = 'neutral';
      if (sentimentScore > 0) sentimentType = 'positive';
      if (sentimentScore < 0) sentimentType = 'negative';

      const newAnalysis = {
        ...analysis,
        [sentimentType]: analysis[sentimentType] + 1,
        recentFeedback: [
          { text: feedback, type: sentimentType, score: sentimentScore },
          ...analysis.recentFeedback
        ].slice(0, 5)
      };

      setAnalysis(newAnalysis);
      onSentimentUpdate(newAnalysis);
    }
  }, [feedback]);

  return (
    <div className="card">
      <h3>Sentiment Analysis</h3>
      <div className="sentiment-stats">
        <div className="sentiment-stat">
          <span className="sentiment-indicator sentiment-positive"></span>
          <span>Positive: {analysis.positive}</span>
        </div>
        <div className="sentiment-stat">
          <span className="sentiment-indicator sentiment-neutral"></span>
          <span>Neutral: {analysis.neutral}</span>
        </div>
        <div className="sentiment-stat">
          <span className="sentiment-indicator sentiment-negative"></span>
          <span>Negative: {analysis.negative}</span>
        </div>
      </div>

      <div className="recent-feedback">
        <h4>Recent Feedback</h4>
        {analysis.recentFeedback.map((item, index) => (
          <div key={index} className={`feedback-item sentiment-${item.type}`}>
            <p>{item.text}</p>
            <small>Score: {item.score}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentAnalysis; 