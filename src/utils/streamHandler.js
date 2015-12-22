// streamHandler.js

import Tweet from '../models/Tweet';

export default function(stream, io) {

  // When tweets get sent our way ...
  stream.on('data', function(data) {

    if (data['user'] !== undefined) {

      // Construct a new tweet object
      let tweet = {
        twid      : data['id_str'],
        active    : false,
        author    : data['user']['name'],
        avatar    : data['user']['profile_image_url'],
        body      : data['text'],
        date      : data['created_at'],
        screenname: data['user']['screen_name']
      };

      // Create a new model instance with our object
      let tweetEntry = new Tweet(tweet);

      // Save 'er to the database
      tweetEntry.save(function(err) {
        if (!err) {
          // If everything is cool, socket.io emits the tweet.
          io.emit('tweet', tweet);
        }
      });

    }

  });

};
