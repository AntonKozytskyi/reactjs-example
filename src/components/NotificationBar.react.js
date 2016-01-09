// NotificationBar.react.js

import React, { Component, PropTypes } from 'react';

class NotificationBar extends Component {

  render() {
    let count = this.props.count;

    return (
        <div className={"notification-bar" + (count > 0 ? ' active' : '')}>
          <p>There are {count} new tweets! <a href="#top" onClick={this.props.onShowNewTweets}>Click here to see them.</a></p>
        </div>
    )
  }

}

export default NotificationBar;
