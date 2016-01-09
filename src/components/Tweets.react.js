// Tweets.react.js

import React, { Component, PropTypes } from 'react';
import Tweet from './Tweet.react.js';

class Tweets extends Component {

  // Render our tweets
  render() {
    // Build list items of single tweet components using map
    let content = this.props.tweets.map(function (tweet) {
      return (
          <Tweet key={tweet._id} tweet={tweet} />
      )
    });

    // Return ul filled with our mapped tweets
    return (
        <ul className="tweets">{content}</ul>
    )
  }

}

export default Tweets;
