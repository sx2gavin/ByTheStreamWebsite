var express = require('express');
var router = express.Router();

var article = require('./controllers/article.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/volume', function(req, res, next) {
  res.render('volume');
});

router.get('/article/get', article.get);

module.exports = router;
