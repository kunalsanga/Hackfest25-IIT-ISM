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

def handle_rate_limit(response):
    if response.status_code == 429:
        reset_time = int(response.headers.get('x-rate-limit-reset', 0))
        current_time = int(time.time())
        wait_time = max(reset_time - current_time, 0) + 5  # Add 5 seconds buffer
        print(f"Rate limit reached. Waiting for {wait_time} seconds...")
        time.sleep(wait_time)
        return True
    return False

def make_request(twitter, url, params, max_retries=3):
    for attempt in range(max_retries):
        response = twitter.get(url, params=params)
        if response.status_code == 200:
            return response
        elif handle_rate_limit(response):
            continue
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    return None

def get_tweet_and_replies(tweet_id):
    # Create OAuth1Session
    twitter = OAuth1Session(
        consumer_key,
        client_secret=consumer_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_token_secret
    )
    
    # First, get the main tweet
    tweet_url = f"https://api.twitter.com/1.1/statuses/show.json"
    tweet_params = {
        "id": tweet_id,
        "tweet_mode": "extended"
    }
    
    tweet_response = make_request(twitter, tweet_url, tweet_params)
    if not tweet_response:
        return
    
    # Add delay between requests
    time.sleep(2)
    
    # Get conversation thread using search
    search_url = "https://api.twitter.com/1.1/search/tweets.json"
    search_params = {
        "q": f"to:{tweet_response.json()['user']['screen_name']}",
        "since_id": tweet_id,
        "count": 100,
        "tweet_mode": "extended"
    }
    
    search_response = make_request(twitter, search_url, search_params)
    
    # Save results to a file
    results = {
        "original_tweet": tweet_response.json(),
        "replies": search_response.json() if search_response else {"error": "Failed to fetch replies"}
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"tweet_data_final_{timestamp}.json"
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    # Print summary
    tweet_data = tweet_response.json()
    print("\nTweet Summary:")
    print(f"Tweet text: {tweet_data.get('full_text', 'N/A')}")
    print(f"Created at: {tweet_data.get('created_at', 'N/A')}")
    print(f"Retweets: {tweet_data.get('retweet_count', 0)}")
    print(f"Likes: {tweet_data.get('favorite_count', 0)}")
    print(f"Replies: {tweet_data.get('reply_count', 0) if 'reply_count' in tweet_data else 'N/A'}")
    
    if search_response and 'statuses' in search_response.json():
        replies = search_response.json()['statuses']
        print(f"\nFound {len(replies)} potential replies:")
        for reply in replies:
            if reply.get('in_reply_to_status_id_str') == tweet_id:
                print(f"\nReply from @{reply['user']['screen_name']}:")
                print(f"Text: {reply.get('full_text', 'N/A')}")
                print(f"Created at: {reply.get('created_at', 'N/A')}")
    else:
        print("\nNo replies found or error fetching replies")

if __name__ == "__main__":
    tweet_id = "1908372178036269546"
    print(f"Collecting data for tweet ID: {tweet_id}")
    get_tweet_and_replies(tweet_id) 