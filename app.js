'use strict'
require('dotenv').config({silent: true})
require('dotenv').load();
const tsFormat = () => (new Date()).toLocaleTimeString();
const express    = require('express');
const fs = require('fs');
var Bunyan = require('bunyan');
var app        = express(), bunyanLogger = require('express-bunyan-logger');
var bodyParser = require('body-parser');
var compress = require('compression');
var port = process.env.PORT_PRODUCTION;
var path = require('path');



// set middleware
app.set('port', process.env.PORT || port);
app.use(compress());
app.use(bodyParser.json({limit: '25mb'}));                       //Added to avoid request entity too large error, stats.nba.com has large data endpoints
app.use(bodyParser.urlencoded({limit: '25mb', extended: true }));//Added to avoid request entity too large error, stats.nba.com has large data endpoints
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// set logging and debugging
app.use(bunyanLogger( {     // ENABLED:     comment out to remove stdout, lines 29 -> 41
    name: 'api',
    streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    {
        level: 'info',
        path: './logs/stash.log'
    }
  ]
}));

// set request options
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token, X-Day');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// route paths
app.use('/', require('./app/routes'));

// set 404 res
app.use(function(req, res, next) {
  var err = new Error('Invalid URL Found');
  console.log('not found');
    res.status(404).json({
      "status": 404,
      "message": "Invalid URL, for a list of valid endpoints, please ask glenn"
    });
  next(err);
});

// set port and env variables. 
app.listen(app.get('port'), function() {
  console.log('nba data fetch - Port: %d in %s mode', app.get('port'), app.get('env'), '- Process ID: ' + process.pid);
});

//launch
module.exports = app;
