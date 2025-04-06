// Tweet data from the API
const tweetData = {
  original_tweet: {
    data: {
      author_id: "1854279625083691008",
      conversation_id: "1908372178036269546",
      id: "1908372178036269546",
      created_at: "2025-04-05T04:12:37.000Z",
      text: "\"Get ready to innovate! Team BigO is thrilled to announce that we're organizing a HACKATHON! Brace yourselves for code, creativity, and crazy ideas. Stay tuned for theme reveal, prizes & registration details! #HackWithBigO #Hackathon2025 #TechForChange",
      public_metrics: {
        retweet_count: 0,
        reply_count: 1,
        like_count: 0,
        quote_count: 0,
        bookmark_count: 0,
        impression_count: 27
      }
    },
    includes: {
      users: [
        {
          id: "1854279625083691008",
          name: "Sunny.k. Sebu",
          username: "SunnyKSebu"
        }
      ]
    }
  },
  replies: {
    data: [
      {
        text: "@SunnyKSebu #problem #HackWithBigO audio issues",
        edit_history_tweet_ids: [
          "1908388800574652823"
        ],
        public_metrics: {
          retweet_count: 0,
          reply_count: 0,
          like_count: 2,
          quote_count: 0,
          bookmark_count: 0,
          impression_count: 10
        },
        author_id: "1908387854255849472",
        created_at: "2025-04-05T05:18:40.000Z",
        id: "1908388800574652823",
        in_reply_to_user_id: "1854279625083691008"
      }
    ],
    includes: {
      users: [
        {
          id: "1908387854255849472",
          name: "Mugdha Naik",
          username: "mugdhanaik63"
        }
      ]
    },
    meta: {
      newest_id: "1908388800574652823",
      oldest_id: "1908388800574652823",
      result_count: 1
    }
  }
};

// Function to get the tweet data
export const getTweetData = () => {
  return tweetData;
};

// Function to get the original tweet
export const getOriginalTweet = () => {
  return tweetData.original_tweet;
};

// Function to get the replies
export const getReplies = () => {
  return tweetData.replies;
};

// Function to get tweet metrics
export const getTweetMetrics = () => {
  const originalTweet = tweetData.original_tweet.data;
  const metrics = originalTweet.public_metrics;
  
  return {
    retweets: metrics.retweet_count,
    likes: metrics.like_count,
    replies: metrics.reply_count,
    impressions: metrics.impression_count
  };
};

// Function to get tweet sentiment
export const getTweetSentiment = () => {
  // In a real application, this would use a sentiment analysis model
  // For now, we'll return a mock sentiment
  return {
    positive: 0.7,
    neutral: 0.2,
    negative: 0.1
  };
};

// Function to get reply sentiment
export const getReplySentiment = () => {
  // In a real application, this would use a sentiment analysis model
  // For now, we'll return a mock sentiment
  return {
    positive: 0.3,
    neutral: 0.3,
    negative: 0.4
  };
}; 