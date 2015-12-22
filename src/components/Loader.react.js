// Loader.react.js

import React from 'react';

export default React.createClass({
  render: function(){
    return (
      <div className={"loader " + (this.props.paging ? "active" : "")}>
        <img src="svg/loader.svg" />
      </div>
    )
  }
});
