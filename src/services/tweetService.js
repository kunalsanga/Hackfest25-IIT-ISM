// Data from tweet_data_20250406_113306.json
const data1 = {
  original_tweet: {
    data: { author_id: "1854279625083691008", conversation_id: "1908372178036269546", id: "1908372178036269546", created_at: "2025-04-05T04:12:37.000Z", text: "\"Get ready to innovate! Team BigO is thrilled to announce that we're organizing a HACKATHON! Brace yourselves for code, creativity, and crazy ideas. Stay tuned for theme reveal, prizes &amp; registration details! #HackWithBigO #Hackathon2025 #TechForChange", public_metrics: { retweet_count: 0, reply_count: 1, like_count: 0, quote_count: 0, bookmark_count: 0, impression_count: 27 }, edit_history_tweet_ids: ["1908372178036269546"] },
    includes: { users: [{ id: "1854279625083691008", name: "Sunny.k. Sebu", username: "SunnyKSebu" }] }
  },
  replies: {
    data: [{ text: "@SunnyKSebu #problem #HackWithBigO audio issues", edit_history_tweet_ids: ["1908388800574652823"], public_metrics: { retweet_count: 0, reply_count: 0, like_count: 2, quote_count: 0, bookmark_count: 0, impression_count: 10 }, author_id: "1908387854255849472", created_at: "2025-04-05T05:18:40.000Z", id: "1908388800574652823", in_reply_to_user_id: "1854279625083691008" }],
    includes: { users: [{ id: "1908387854255849472", name: "Mugdha Naik", username: "mugdhanaik63" }] },
    meta: { newest_id: "1908388800574652823", oldest_id: "1908388800574652823", result_count: 1 }
  }
};

// Data from tweet_data_20250406_114811.json (only replies section needed as original tweet is the same)
const data2_replies = {
  data: [
    { public_metrics: { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0, bookmark_count: 0, impression_count: 4 }, author_id: "1886052068198428672", id: "1908763892563534073", edit_history_tweet_ids: ["1908763892563534073"], text: "@SunnyKSebu The wifi was very slow. #hackwithbigo #problem", created_at: "2025-04-06T06:09:09.000Z", in_reply_to_user_id: "1854279625083691008" },
    { public_metrics: { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0, bookmark_count: 0, impression_count: 5 }, author_id: "1854279625083691008", id: "1908763750624063832", edit_history_tweet_ids: ["1908763750624063832"], text: "@SunnyKSebu low network bandwidth #problem #HackwithBigO", created_at: "2025-04-06T06:08:35.000Z", in_reply_to_user_id: "1854279625083691008" },
    // Reply from data1 is also present here, will be deduplicated later
    { public_metrics: { retweet_count: 0, reply_count: 0, like_count: 2, quote_count: 0, bookmark_count: 0, impression_count: 16 }, author_id: "1908387854255849472", id: "1908388800574652823", edit_history_tweet_ids: ["1908388800574652823"], text: "@SunnyKSebu #problem #HackWithBigO audio issues", created_at: "2025-04-05T05:18:40.000Z", in_reply_to_user_id: "1854279625083691008" }
  ],
  includes: {
    users: [
      { id: "1886052068198428672", name: "Kunal Sanga", username: "kunal_sanga" },
      { id: "1854279625083691008", name: "Sunny.k. Sebu", username: "SunnyKSebu" },
      { id: "1908387854255849472", name: "Mugdha Naik", username: "mugdhanaik63" }
    ]
  },
  meta: { newest_id: "1908763892563534073", oldest_id: "1908388800574652823", result_count: 3 }
};

// Data from tweet_data_20250406_120317.json (only replies section needed)
const data3_replies = {
    // Replies are identical to data2_replies in this sample, 
    // real implementation might fetch or load differently.
    // For demonstration, we'll use data2_replies again, 
    // deduplication will handle it.
    data: data2_replies.data,
    includes: data2_replies.includes,
    meta: data2_replies.meta
};


// --- Combined Data Function ---

export const getAllTweetData = () => {
  // Combine replies data, ensuring uniqueness based on reply ID
  const allRepliesData = [...data1.replies.data, ...data2_replies.data, ...data3_replies.data];
  const uniqueRepliesDataMap = new Map();
  allRepliesData.forEach(reply => {
    if (!uniqueRepliesDataMap.has(reply.id)) {
      uniqueRepliesDataMap.set(reply.id, reply);
    }
  });
  const uniqueRepliesData = Array.from(uniqueRepliesDataMap.values());

  // Combine user data, ensuring uniqueness based on user ID
  const allUsersData = [
      ...data1.original_tweet.includes.users, 
      ...data1.replies.includes.users, 
      ...data2_replies.includes.users, 
      ...data3_replies.includes.users
    ];
  const uniqueUsersDataMap = new Map();
  allUsersData.forEach(user => {
      if (!uniqueUsersDataMap.has(user.id)) {
          uniqueUsersDataMap.set(user.id, user);
      }
  });
  const uniqueUsersData = Array.from(uniqueUsersDataMap.values());

  // Find newest and oldest IDs from the unique replies
  let newest_id = null;
  let oldest_id = null;
  if (uniqueRepliesData.length > 0) {
      uniqueRepliesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      newest_id = uniqueRepliesData[0].id;
      oldest_id = uniqueRepliesData[uniqueRepliesData.length - 1].id;
  }


  // Construct the final combined data object
  const combinedData = {
    original_tweet: data1.original_tweet, // Assuming original tweet is the same
    replies: {
      data: uniqueRepliesData,
      includes: {
        users: uniqueUsersData 
      },
      meta: {
        newest_id: newest_id,
        oldest_id: oldest_id,
        result_count: uniqueRepliesData.length
      }
    }
  };

  return combinedData;
};


// --- Original Functions (kept for compatibility if needed elsewhere) ---

const tweetData = data1; // Keep original data1 for original functions

export const getTweetData = () => {
  return tweetData;
};

export const getOriginalTweet = () => {
  return tweetData.original_tweet;
};

export const getReplies = () => {
  return tweetData.replies;
};

export const getTweetMetrics = () => {
  return tweetData.original_tweet.data.public_metrics;
};

// Example sentiment analysis (replace with actual analysis)
export const getTweetSentiment = () => {
  return { positive: 0.6, neutral: 0.3, negative: 0.1 };
};

export const getReplySentiment = (replyId) => {
  // Mock sentiment based on reply ID or text
  const reply = tweetData.replies.data.find(r => r.id === replyId);
  if (reply && reply.text.toLowerCase().includes('issue')) {
    return { positive: 0.1, neutral: 0.2, negative: 0.7 };
  }
  return { positive: 0.4, neutral: 0.5, negative: 0.1 };
}; 