# Event Sentiment Analysis System

This system provides real-time sentiment analysis and issue detection for event feedback across multiple channels including social media, surveys, and chat platforms.

## Features

- Real-time sentiment analysis using BERT model
- Multi-channel feedback collection (Twitter, surveys, chat)
- Issue detection and severity assessment
- Batch processing of feedback
- REST API for easy integration

## Setup

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your API credentials:
```
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

4. Download required NLTK data:
```python
import nltk
nltk.download('punkt')
nltk.download('stopwords')
```

5. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

## Usage

1. Start the API server:
```bash
python api.py
```

2. The API will be available at `http://localhost:8000`

### API Endpoints

#### Analyze Single Text
```bash
POST /analyze/text
{
    "text": "The event was great but the audio quality was poor."
}
```

#### Analyze Batch of Texts
```bash
POST /analyze/batch
{
    "texts": [
        "Great event!",
        "The queue was too long.",
        "Audio issues in the main hall."
    ]
}
```

#### Collect and Analyze Feedback
```bash
POST /collect/feedback
{
    "event_hashtag": "MyEvent2023",
    "event_id": "event123",
    "survey_id": "survey456",
    "since_minutes": 60
}
```

## Response Format

### Single Text Analysis
```json
{
    "sentiment": {
        "sentiment_score": 0.2,
        "sentiment_label": "Positive",
        "confidence": 0.95
    },
    "issues": [
        {
            "category": "technical",
            "keyword": "audio",
            "severity": 0.7,
            "text": "The event was great but the audio quality was poor.",
            "sentiment": {
                "sentiment_score": 0.2,
                "sentiment_label": "Positive",
                "confidence": 0.95
            }
        }
    ]
}
```

### Batch Analysis
```json
{
    "overall_sentiment": 0.1,
    "issues": [...],
    "sentiment_distribution": {
        "Very Positive": 10,
        "Positive": 20,
        "Negative": 5,
        "Very Negative": 2
    }
}
```

## Integration

The system can be integrated with your event management platform by:

1. Making HTTP requests to the API endpoints
2. Using the provided Python classes directly in your code
3. Setting up automated feedback collection and analysis

## Customization

You can customize the system by:

1. Modifying issue keywords in `sentiment_analyzer.py`
2. Adding new data sources in `data_collector.py`
3. Adjusting sentiment thresholds in the analyzer
4. Adding new issue categories and detection rules

## License

MIT License 