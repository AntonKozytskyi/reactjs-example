// Tweet.js

import mongoose from 'mongoose';
let Schema = mongoose.Schema;

// Create a new schema for our tweet data
let TweetSchema = new Schema({
  twid       : String,
  active     : Boolean,
  author     : String,
  avatar     : String,
  body       : String,
  date       : Date,
  screenname : String
});

// Create a static getTweets method to return tweet data from the db
TweetSchema.statics.getTweets = function(page, skip, callback) {

  let tweets = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  return this
    .find(
      {},
      'twid active author avatar body date screenname',
      {skip: start, limit: 10}
    )
    .sort({date: 'desc'})
    .exec(function(err, docs) {

      // If everything is cool...
      if (!err) {
        tweets = docs;  // We got tweets
        tweets.forEach(function(tweet) {
          tweet.active = true; // Set them to active
        });
      }

      // Pass them back to the specified callback
      callback(tweets);

  });

};

// Return a Tweet model based upon the defined schema
export default mongoose.model('Tweet', TweetSchema);
