from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from sentiment_analyzer import EventSentimentAnalyzer
from data_collector import EventDataCollector
import uvicorn
from datetime import datetime
from dotenv import load_dotenv
import os
import time
from functools import lru_cache
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Event Sentiment Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
sentiment_analyzer = EventSentimentAnalyzer()
data_collector = EventDataCollector()

class FeedbackRequest(BaseModel):
    event_hashtag: str
    event_id: str
    survey_id: str
    since_minutes: Optional[int] = 60

class TextAnalysisRequest(BaseModel):
    text: str

class BatchAnalysisRequest(BaseModel):
    texts: List[str]

class FeedbackItem(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    source: str = Field(..., regex="^(twitter|instagram|email|survey|chat)$")
    timestamp: Optional[str] = None

class AnalysisResponse(BaseModel):
    sentiment: str
    confidence: float
    key_points: List[str]
    priority: str
    suggested_actions: List[str]

# Cache sentiment analysis results
@lru_cache(maxsize=100)
def cached_analyze_sentiment(text: str) -> dict:
    return sentiment_analyzer.analyze_text(text)

@app.post("/analyze/text")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze sentiment and detect issues in a single text."""
    try:
        sentiment = sentiment_analyzer.analyze_sentiment(request.text)
        issues = sentiment_analyzer.detect_issues(request.text)
        
        return {
            "sentiment": sentiment,
            "issues": issues
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/batch")
async def analyze_batch(request: BatchAnalysisRequest):
    """Analyze a batch of texts and provide aggregated results."""
    try:
        results = sentiment_analyzer.analyze_batch(request.texts)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/collect/feedback")
async def collect_feedback(request: FeedbackRequest):
    """Collect and analyze feedback from various sources."""
    try:
        # Collect feedback from all sources
        feedback = data_collector.collect_all_feedback(
            request.event_hashtag,
            request.event_id,
            request.survey_id
        )
        
        # Extract texts for analysis
        texts = [item['text'] for item in feedback]
        
        # Analyze the collected feedback
        analysis_results = sentiment_analyzer.analyze_batch(texts)
        
        # Save feedback to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"feedback_{timestamp}.json"
        data_collector.save_feedback_to_file(feedback, filename)
        
        return {
            "feedback_count": len(feedback),
            "analysis": analysis_results,
            "feedback_file": filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_feedback(feedback: FeedbackItem):
    try:
        # Validate input
        if not feedback.text.strip():
            raise HTTPException(status_code=400, detail="Feedback text cannot be empty")
        
        # Add timestamp if not provided
        if not feedback.timestamp:
            feedback.timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Analyze sentiment with caching
        analysis_result = cached_analyze_sentiment(feedback.text)
        
        # Log the analysis
        logger.info(f"Analyzed feedback from {feedback.source}: {analysis_result['sentiment']}")
        
        return AnalysisResponse(
            sentiment=analysis_result["sentiment"],
            confidence=analysis_result["confidence"],
            key_points=analysis_result["key_points"],
            priority=analysis_result["priority"],
            suggested_actions=analysis_result["suggested_actions"]
        )
    except Exception as e:
        logger.error(f"Error analyzing feedback: {str(e)}")
        raise HTTPException(status_code=500, detail="Error analyzing feedback")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 