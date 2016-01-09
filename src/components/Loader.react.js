// Loader.react.js

import React, { Component, PropTypes } from 'react';

class Loader extends Component {

  render() {
    return (
        <div className={"loader " + (this.props.paging ? "active" : "")}>
          <img src="svg/loader.svg" />
        </div>
    )
  }

}

export default Loader;
