var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var map = require('express-sitemap');

var routes = require('./routes');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/*
var sitemap = map({
    sitemap: "sitemap.xml",
    robots: "robots.txt",
    generate: app,
    route: {
        '/': {
            lastmod: '2018-07-02',
            changefreq: 'monthly',
            priority: 1.0,
        },
        '/volume': {
            lastmod: '2018-07-02',
            changefreq: 'monthly',
            priority: 1.0,
        },
    },
});

sitemap.toFile();
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
