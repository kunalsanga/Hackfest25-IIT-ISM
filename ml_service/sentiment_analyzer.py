import numpy as np
from typing import Dict, List, Tuple
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

class EventSentimentAnalyzer:
    def __init__(self):
        # Initialize NLTK
        nltk.download('punkt')
        nltk.download('stopwords')
        self.stop_words = set(stopwords.words('english'))
        
        # Define issue keywords
        self.issue_keywords = {
            'queue': ['queue', 'line', 'wait', 'waiting', 'crowd'],
            'technical': ['audio', 'video', 'sound', 'connection', 'stream', 'glitch'],
            'safety': ['crowded', 'overcrowded', 'unsafe', 'dangerous', 'emergency'],
            'logistics': ['food', 'drink', 'bathroom', 'restroom', 'toilet', 'parking'],
            'content': ['boring', 'confusing', 'unclear', 'difficult', 'hard to follow']
        }
        
        # Initialize text processing
        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.classifier = LogisticRegression()
        
        # Train a simple sentiment classifier
        self._train_simple_classifier()

    def _train_simple_classifier(self):
        """Train a simple sentiment classifier with some example data."""
        # Example training data
        texts = [
            "Great event! Really enjoyed it",
            "The speaker was amazing",
            "Excellent organization",
            "Poor audio quality",
            "Too crowded, couldn't see anything",
            "Terrible experience",
            "Loved every minute",
            "Best conference ever",
            "Waste of time",
            "The queue was too long"
        ]
        labels = [1, 1, 1, -1, -1, -1, 1, 1, -1, -1]  # 1 for positive, -1 for negative
        
        # Transform text to features
        X = self.vectorizer.fit_transform(texts)
        
        # Train classifier
        self.classifier.fit(X, labels)

    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of a given text."""
        # Transform text
        X = self.vectorizer.transform([text])
        
        # Get prediction and probability
        sentiment_score = self.classifier.predict(X)[0]
        confidence = self.classifier.predict_proba(X)[0].max()
        
        # Convert to normalized score (-1 to 1)
        normalized_score = float(sentiment_score)
        
        return {
            'sentiment_score': normalized_score,
            'sentiment_label': self._get_sentiment_label(normalized_score),
            'confidence': float(confidence)
        }

    def detect_issues(self, text: str) -> List[Dict]:
        """Detect potential issues in the text."""
        issues = []
        text_lower = text.lower()
        
        for category, keywords in self.issue_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    # Calculate severity based on sentiment and keyword presence
                    sentiment = self.analyze_sentiment(text)
                    severity = self._calculate_severity(sentiment['sentiment_score'], text)
                    
                    issues.append({
                        'category': category,
                        'keyword': keyword,
                        'severity': severity,
                        'text': text,
                        'sentiment': sentiment
                    })
                    break  # Only report one issue per category
        
        return issues

    def _get_sentiment_label(self, score: float) -> str:
        """Convert sentiment score to label."""
        if score >= 0.5:
            return "Very Positive"
        elif score >= 0:
            return "Positive"
        elif score >= -0.5:
            return "Negative"
        else:
            return "Very Negative"

    def _calculate_severity(self, sentiment_score: float, text: str) -> float:
        """Calculate issue severity based on sentiment and text features."""
        # Base severity on sentiment
        severity = abs(sentiment_score)
        
        # Increase severity if text contains urgency indicators
        urgency_indicators = ['urgent', 'emergency', 'immediately', 'now', 'right away']
        if any(indicator in text.lower() for indicator in urgency_indicators):
            severity = min(1.0, severity + 0.3)
        
        return severity

    def analyze_batch(self, texts: List[str]) -> Dict:
        """Analyze a batch of texts and aggregate results."""
        results = {
            'overall_sentiment': 0.0,
            'issues': [],
            'sentiment_distribution': {
                'Very Positive': 0,
                'Positive': 0,
                'Negative': 0,
                'Very Negative': 0
            }
        }
        
        for text in texts:
            sentiment = self.analyze_sentiment(text)
            issues = self.detect_issues(text)
            
            results['overall_sentiment'] += sentiment['sentiment_score']
            results['issues'].extend(issues)
            results['sentiment_distribution'][sentiment['sentiment_label']] += 1
        
        if texts:
            results['overall_sentiment'] /= len(texts)
        
        return results 