import os
from dotenv import load_dotenv
from typing import List, Dict
from datetime import datetime, timedelta
import json

class EventDataCollector:
    def __init__(self):
        load_dotenv()
        
    def collect_survey_responses(self, survey_id: str) -> List[Dict]:
        """Collect responses from event survey platform."""
        # This is a placeholder for survey data collection
        # In a real implementation, you would integrate with your survey platform's API
        return [
            {
                'source': 'survey',
                'text': 'Great event! Really enjoyed the speakers.',
                'timestamp': datetime.utcnow().isoformat(),
                'user': 'user123'
            },
            {
                'source': 'survey',
                'text': 'The audio quality was poor in the main hall.',
                'timestamp': datetime.utcnow().isoformat(),
                'user': 'user456'
            }
        ]
    
    def collect_chat_messages(self, event_id: str) -> List[Dict]:
        """Collect messages from event chat platform."""
        # This is a placeholder for chat data collection
        # In a real implementation, you would integrate with your chat platform's API
        return [
            {
                'source': 'chat',
                'text': 'When does the next session start?',
                'timestamp': datetime.utcnow().isoformat(),
                'user': 'user789'
            },
            {
                'source': 'chat',
                'text': 'The queue for registration is too long!',
                'timestamp': datetime.utcnow().isoformat(),
                'user': 'user101'
            }
        ]
    
    def collect_all_feedback(self, event_hashtag: str, event_id: str, survey_id: str) -> List[Dict]:
        """Collect feedback from all available sources."""
        all_feedback = []
        
        # Collect survey responses
        survey_responses = self.collect_survey_responses(survey_id)
        all_feedback.extend(survey_responses)
        
        # Collect chat messages
        chat_messages = self.collect_chat_messages(event_id)
        all_feedback.extend(chat_messages)
        
        return all_feedback
    
    def save_feedback_to_file(self, feedback: List[Dict], filename: str):
        """Save collected feedback to a JSON file."""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(feedback, f, ensure_ascii=False, indent=2) 