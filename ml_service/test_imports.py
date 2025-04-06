try:
    from api import app
    print("Successfully imported app from api")
except Exception as e:
    print(f"Error importing app from api: {e}")

try:
    from sentiment_analyzer import EventSentimentAnalyzer
    print("Successfully imported EventSentimentAnalyzer")
except Exception as e:
    print(f"Error importing EventSentimentAnalyzer: {e}")

try:
    from data_collector import EventDataCollector
    print("Successfully imported EventDataCollector")
except Exception as e:
    print(f"Error importing EventDataCollector: {e}") 