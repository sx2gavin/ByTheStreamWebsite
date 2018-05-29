
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

router.get('/article', function(req, res, next) {
  res.render('article');
});

router.get('/version-available', function(req, res, next) {
	var parameters = url.parse(req.url, true).query;
	var traditionalAvailable = false;
	var character = "simplified";
	if ("character" in parameters)
	{
		character = parameters["character"];
	}

	var volumeId = 1;
	if ("volume" in parameters)
	{
		volumeId = parameters["volume"];
	}

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}
		var tableOfContents = db.db("Xishuipang").collection("TableOfContents");

		tableOfContents.find({volume:volumeId, character:character},{_id:1}).limit(1).toArray(function(err, result){
			if (err) {
				throw err;
			}

			if (result.length == 0) {
				res.json({"result":false});
			} else {
				res.json({"result":true});
			}
			// res.json(result);
			db.close();
		});
	});
});

router.get('/article/get', function(req, res, next) {
	var parameters = url.parse(req.url, true).query;

	var volumeId = 1;
	if ("volume" in parameters)
	{
		volumeId = parameters["volume"];
	}

	/*
	var characterVersion = "simplified";
	if ("character" in parameters)
	{
		characterVersion = parameters["character"];
	}
	*/

	var name = "";
	if ("name" in parameters)
	{
		name = parameters["name"];
	}

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}
		var articleCollection = db.db("Xishuipang").collection("Articles");

		if (name != "")
		{
			articleCollection.findOne({volume:volumeId, id:name}, function(err, result){
				if (err) {
					throw err;
				}
				res.json(result);
				db.close();
			});
		}
		else
		{
			articleCollection.find({volume:volumeId}).toArray(function(err, result){
				if (err) {
					throw err;
				}
				var dictionary = {};
				for (i in result) {
					dictionary[result[i].id] = result[i];
				}

				res.json(dictionary);
				db.close();
			});
		}
	});
});

router.get('/article/list', function(req, res, next) {
	var parameters = url.parse(req.url, true).query;

	var volumeId = 1;
	if ("volume" in parameters) {
		volumeId = parameters["volume"];
	}

	var character = "simplified";
	if ("character" in parameters)
	{
		character = parameters["character"];
	}

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}
		var tableOfContents = db.db("Xishuipang").collection("TableOfContents");

		tableOfContents.findOne({volume:volumeId, character:character},function(err, result){
			if (err) {
				throw err;
			}
			res.json(result);
			db.close();
		});
	});
});

router.get('/volume/list', function(req, res, next) {
	var parameters = url.parse(req.url, true).query;

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}

		var tableOfContents = db.db("Xishuipang").collection("TableOfContents");

		tableOfContents.distinct("volume", {}, function(err, result) {
			if (err) {
				throw err;
			}
			res.json(result);
			db.close();
		});
	});
});

router.get('/feedback', function(req, res, next) {
	res.render('feedback');
});

router.get('/contribution', function(req, res, next) {
	res.render('contribution');
});

router.get('/legal', function(req, res, next) {
	res.render('legal');
});

router.get('/search', function(req, res, next) {
	res.render('search-results');
});

router.get('/search/get', function(req, res, next) {
	var parameters = url.parse(req.url, true).query;

	var text = "";
	if ("text" in parameters)
	{
		text = parameters["text"];
	}

	MongoClient.connect(database_url, function(err, db) {
		if (err) {
			throw err;
		}
		var articleCollection = db.db("Xishuipang").collection("Articles");

		articleCollection.find({$text:{$search: text}}).toArray(function(err, result){
			if (err) {
				throw err;
			}
			res.json(result);
			db.close();
		});
	});
});

router.post('/search', function(req, res, next) {
	var text = req.body.search;
	if (text) {
		res.redirect('/search?text='+text);
	}
	else
	{
		res.status(204).end();
	}
});


module.exports = router;
