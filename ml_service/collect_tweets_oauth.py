import requests
from requests_oauthlib import OAuth1Session
import json
from datetime import datetime
import time

# Twitter API credentials
consumer_key = "v5pTHz5UR0iDcX0SwEfw5HqC7"
consumer_secret = "P1JsQtoDTEns0eZMQzytaksWjkkEscddJUOYvXKz14bU8IUMur"
access_token = "1854279625083691008-spo33E0l68O62BKAvSYNUvGDkg7PxO"
access_token_secret = "wuEXTLCwosoXjVHK0VB1mElJrDNjR5vIMaX3U5IORmjWo"

def get_tweet_and_replies(tweet_id):
    # Create OAuth1Session
    twitter = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_token_secret
    )
    
    # First, get the main tweet
    tweet_url = f"https://api.twitter.com/2/tweets/{tweet_id}"
    tweet_params = {
        "tweet.fields": "created_at,author_id,conversation_id,public_metrics,text",
        "expansions": "author_id",
        "user.fields": "username,name"
    }
    
    tweet_response = twitter.get(tweet_url, params=tweet_params)
    
    if tweet_response.status_code != 200:
        print(f"Error fetching tweet: {tweet_response.status_code}")
        print(tweet_response.text)
        return
    
    # Add delay between requests
    time.sleep(1)
    
    # Get conversation thread
    conversation_url = "https://api.twitter.com/2/tweets/search/recent"
    conversation_params = {
        "query": f"conversation_id:{tweet_id}",
        "tweet.fields": "created_at,author_id,in_reply_to_user_id,public_metrics,text",
        "expansions": "author_id,in_reply_to_user_id",
        "user.fields": "username,name",
        "max_results": 100
    }
    
    conversation_response = twitter.get(conversation_url, params=conversation_params)
    
    # Save results to a file
    results = {
        "original_tweet": tweet_response.json(),
        "conversation": conversation_response.json() if conversation_response.status_code == 200 else {"error": conversation_response.text}
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"tweet_data_oauth_{timestamp}.json"
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    # Print summary
    print("\nTweet Summary:")
    tweet_data = tweet_response.json()["data"]
    print(f"Tweet text: {tweet_data.get('text', 'N/A')}")
    print(f"Created at: {tweet_data.get('created_at', 'N/A')}")
    metrics = tweet_data.get("public_metrics", {})
    print(f"Retweets: {metrics.get('retweet_count', 0)}")
    print(f"Likes: {metrics.get('like_count', 0)}")
    print(f"Replies: {metrics.get('reply_count', 0)}")
    
    if conversation_response.status_code == 200:
        conversation_data = conversation_response.json()
        if "data" in conversation_data:
            replies = conversation_data["data"]
            print(f"\nFound {len(replies)} replies/conversation tweets:")
            for reply in replies:
                print(f"\nReply from user ID {reply.get('author_id', 'unknown')}:")
                print(f"Text: {reply.get('text', 'N/A')}")
                print(f"Created at: {reply.get('created_at', 'N/A')}")
        else:
            print("\nNo replies found in the conversation")
    else:
        print(f"\nError fetching conversation: {conversation_response.status_code}")
        print(conversation_response.text)

if __name__ == "__main__":
    tweet_id = "1908372178036269546"
    print(f"Collecting data for tweet ID: {tweet_id}")
    get_tweet_and_replies(tweet_id) 