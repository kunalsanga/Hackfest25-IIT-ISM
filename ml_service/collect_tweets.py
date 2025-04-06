import requests
import os
from dotenv import load_dotenv
from requests_oauthlib import OAuth1
import json
from datetime import datetime
import time

# Twitter API credentials
consumer_key = "v5pTHz5UR0iDcX0SwEfw5HqC7"
consumer_secret = "P1JsQtoDTEns0eZMQzytaksWjkkEscddJUOYvXKz14bU8IUMur"
access_token = "1854279625083691008-spo33E0l68O62BKAvSYNUvGDkg7PxO"
access_token_secret = "wuEXTLCwosoXjVHK0VB1mElJrDNjR5vIMaX3U5IORmjWo"

# Create OAuth1 authentication object
auth = OAuth1(
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret
)

def handle_rate_limit(response):
    if response.status_code == 429:
        reset_time = int(response.headers.get('x-rate-limit-reset', 0))
        current_time = int(time.time())
        wait_time = max(reset_time - current_time, 0)
        print(f"Rate limit reached. Waiting for {wait_time} seconds...")
        time.sleep(wait_time + 1)  # Add 1 second buffer
        return True
    return False

def get_tweet_and_replies(tweet_id):
    # First, get the main tweet
    tweet_url = f"https://api.twitter.com/2/tweets/{tweet_id}"
    tweet_params = {
        "tweet.fields": "created_at,author_id,conversation_id,public_metrics",
        "expansions": "author_id",
        "user.fields": "username,name"
    }
    
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        tweet_response = requests.get(tweet_url, auth=auth, params=tweet_params)
        
        if tweet_response.status_code == 200:
            break
            
        if handle_rate_limit(tweet_response):
            retry_count += 1
            continue
            
        print(f"Error fetching tweet: {tweet_response.status_code}")
        print(tweet_response.text)
        return
    
    # Add delay between requests
    time.sleep(2)
    
    # Get replies to the tweet
    replies_url = "https://api.twitter.com/2/tweets/search/recent"
    replies_params = {
        "query": f"conversation_id:{tweet_id}",
        "tweet.fields": "created_at,author_id,in_reply_to_user_id,public_metrics",
        "expansions": "author_id",
        "user.fields": "username,name",
        "max_results": 100
    }
    
    retry_count = 0
    while retry_count < max_retries:
        replies_response = requests.get(replies_url, auth=auth, params=replies_params)
        
        if replies_response.status_code == 200:
            break
            
        if handle_rate_limit(replies_response):
            retry_count += 1
            continue
            
        print(f"Error fetching replies: {replies_response.status_code}")
        print(replies_response.text)
        return
    
    # Save results to a file
    results = {
        "original_tweet": tweet_response.json(),
        "replies": replies_response.json() if replies_response.status_code == 200 else {"error": replies_response.text}
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"tweet_data_{timestamp}.json"
    
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
    
    if replies_response.status_code == 200 and "data" in replies_response.json():
        print(f"\nFound {len(replies_response.json()['data'])} replies")
        # Print reply details
        for reply in replies_response.json()['data']:
            print(f"\nReply from @{reply.get('author_id', 'unknown')}:")
            print(f"Text: {reply.get('text', 'N/A')}")
            print(f"Created at: {reply.get('created_at', 'N/A')}")
    else:
        print("\nNo replies found or error fetching replies")

if __name__ == "__main__":
    tweet_id = "1908372178036269546"
    print(f"Collecting data for tweet ID: {tweet_id}")
    get_tweet_and_replies(tweet_id) 