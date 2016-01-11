// server.js

// Require our dependencies
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import Twitter from 'twitter';
import routes from './routes';
import config from './config';
import streamHandler from './utils/streamHandler';

const server = global.server = express();
const port = process.env.PORT || 5000;
const hbs = exphbs.create({
  extname       : '.hbs',
  layoutsDir    : path.resolve(__dirname, './views/layouts/'),
  partialsDir   : path.resolve(__dirname, './views/partials/'),
  defaultLayout : 'main'
});
const twit = new Twitter(config.twitter);

server.set('port', port);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

//
// Set handlebars as the templating engine
// -----------------------------------------------------------------------------
server.engine('.hbs', hbs.engine);
server.set('view engine', '.hbs');
server.set('views', path.resolve(__dirname, './views'));

// Disable etag headers on responses
server.disable('etag');

// Index Route
server.get('/', routes.index);
// Page Route
server.get('/page/:page/:skip', routes.page);

// Set the error handlers
server.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//
// Launch the server
// -----------------------------------------------------------------------------
const httpServer = server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});

// Initialize socket.io
const io = require('socket.io')(httpServer);

// Connect to our mongo database
mongoose.connect('mongodb://localhost/react-tweets');

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter', { track: '#russia'}, function(stream) {
  streamHandler(stream, io);
});
