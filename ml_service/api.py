from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from sentiment_analyzer import EventSentimentAnalyzer
from data_collector import EventDataCollector
import uvicorn
from datetime import datetime

app = FastAPI(title="Event Sentiment Analysis API")

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 