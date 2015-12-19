// Require our dependencies
var express         = require('express');
var exphbs          = require('express-handlebars');
var http            = require('http');
var path            = require('path');
var mongoose        = require('mongoose');
var twitter         = require('twitter');
var routes          = require('./routes');
var config          = require('./config');
var streamHandler   = require('./utils/streamHandler');

module.exports = function() {
  var app = express();
  var port = process.env.PORT || 3000;
  var hbs = exphbs.create({
    extname       : '.hbs',
    layoutsDir    : path.resolve(__dirname, './views/layouts/'),
    partialsDir   : path.resolve(__dirname, './views/partials/'),
    defaultLayout : 'main'
  });
  var twit = new twitter(config.twitter);

  // Set /public as our static content dir
  app.use(express.static(path.resolve(__dirname, './public')));

  // Set handlebars as the templating engine
  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', path.resolve(__dirname, './views'));

  // Disable etag headers on responses
  app.disable('etag');

  // Index Route
  app.get('/', routes.index);
  // Page Route
  app.get('/page/:page/:skip', routes.page);

  // Set the error handlers
  app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Fire this bitch up (start our server)
  var server = app.listen(port, function() {
    console.log('Listening at http://localhost:' + port);
  });

  // Initialize socket.io
  var io = require('socket.io')(server);

  // Connect to our mongo database
  mongoose.connect('mongodb://localhost/react-tweets');

  // Set a stream listener for tweets matching tracking keywords
  twit.stream('statuses/filter', { track: '#russia'}, function(stream) {
    streamHandler(stream, io);
  });
};
