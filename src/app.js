// app.js

import React from 'react';
import ReactDOM from 'react-dom';
import TweetsApp from './components/TweetsApp.react';

// Snag the initial state that was passed from the server side
const initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

// Render the components, picking up where react left off on the server
ReactDOM.render(
  <TweetsApp tweets={initialState}/>,
  document.getElementById('react-app')
);
