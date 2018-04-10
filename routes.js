
var database_url = "mongodb+srv://sx2gavin:glXishuipang@xishuipang-db-qo1sq.mongodb.net/"
// var database_url = "mongodb://127.0.0.1:27017/" // Remember to change this url for the production database.
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

var express = require('express');
var url = require('url');
var router = express.Router();

var article = require('./controllers/article.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/volume', function(req, res, next) {
  res.render('volume');
});

router.get('/article/get', function(req, res, next) {
	var volumeId = url.parse(req.url, true).query.volume;

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}
		var articleCollection = db.db("Xishuipang").collection("Articles");

		articleCollection.find({volume:volumeId}).toArray(function(err, result){
			if (err) {
				throw err;
			}
			res.json(result);
			db.close();
		});

	});

});

module.exports = router;
