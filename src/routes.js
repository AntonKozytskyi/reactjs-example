// routes.js

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Tweet from './models/Tweet';
import TweetsApp from './components/TweetsApp.react';

const routes = {

  index: function(req, res) {
    // Call static model method to get tweets in the db
    Tweet.getTweets(0, 0, function(tweets) {

      // Render React to a string, passing in our fetched tweets
      var markup = ReactDOMServer.renderToString(<TweetsApp tweets={tweets} />);

      // Render our 'home' template
      res.render('home', {
        markup: markup,               // Pass rendered react markup
        state: JSON.stringify(tweets) // Pass current state to client side
      });

    });
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {

      // Render as JSON
      res.send(tweets);

    });
  }

};

export default routes;
