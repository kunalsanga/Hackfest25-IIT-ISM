import requests
import os
from dotenv import load_dotenv
from requests_oauthlib import OAuth1

# Load environment variables
load_dotenv()

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

try:
    # Test the connection by getting user information
    url = "https://api.twitter.com/2/users/me"
    response = requests.get(url, auth=auth)
    
    if response.status_code == 200:
        user_data = response.json()['data']
        print("✅ Twitter API Connection Successful!")
        print(f"Connected as: @{user_data['username']}")
        print(f"User ID: {user_data['id']}")
        print(f"Name: {user_data['name']}")
    else:
        print("❌ Error: Could not retrieve user information")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
    
except Exception as e:
    print("❌ Error connecting to Twitter API:")
    print(str(e)) 