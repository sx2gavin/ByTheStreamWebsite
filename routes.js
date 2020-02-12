var database_url = "mongodb+srv://li-chen_19:chenli123@xishuipang-db-qo1sq.mongodb.net/"
// var database_url = "mongodb://127.0.0.1:27017/" // Remember to change this url for the production database.
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

var express = require('express');
var url = require('url');
var router = express.Router();

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

router.get('/privacy', function(req, res, next) {
    res.render('privacy');
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

router.post('/user/new', function(req, res, next) {
	MongoClient.connect(database_url, function(err1, db) {
		if (err1) throw err1;
		
		const userCollection = db.db("Xishuipang").collection("Users");
		const email = req.body.email;
		if (email) {
			userCollection.findOne({email: email}, function(err2, result2) {
				if (err2) throw err2;
				if (result2) {
					res.json({id: result2.id, email: result2.email, name: result2.name});
					db.close();
				} else {
					userCollection.find().sort({id:-1}).limit(1).toArray(function(err3, result3) {
						if (err3) throw err3;
						const nextUserId = result3.length ? result3[0].id + 1 : 1;
						userCollection.insertOne({id: nextUserId, email: email, name: req.body.name}, function() {
							res.status(201).json({id: nextUserId, email: email, name: req.body.name});
							db.close();
						});
					});
				}
			});
		} else {
			userCollection.find().sort({id:-1}).limit(1).toArray(function(err2, result2) {
				if (err2) throw err2;
				const nextUserId = result2.length ? result2[0].id + 1 : 1;
				userCollection.insertOne({id: nextUserId, name: req.body.name}, function() {
					res.status(201).json({id: nextUserId, name: req.body.name});
					db.close();
				});
			});
		}
	});
});

router.post('/usage/new', function(req, res, next) {
	const userId = req.body.userId;
	if (!userId) res.status(500).send("User Id missing.");
	const volumeId = req.body.volumeId;
	if (!volumeId) res.status(500).send("Volume missing.");
	MongoClient.connect(database_url, function(err1, db) {
		if (err1) throw err1;
		const usageCollection = db.db("Xishuipang").collection("Usage");
		const category = req.body.category;
		const articleTitle = req.body.articleTitle;
		const articleId = req.body.articleId;
		usageCollection.insertOne({userId, volumeId, category, articleTitle, articleId, time: new Date()}, function(err2, result2) {
			if (err2) throw err2;
			res.status(201).send("success");
			db.close();
		});
	})
});
module.exports = router;
