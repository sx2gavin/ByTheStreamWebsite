var url = "mongodb+srv://sx2gavin:glXishuipang@xishuipang-db-qo1sq.mongodb.net/"
// var url = "mongodb://127.0.0.1:27017/" // Remember to change this url for the production database.
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

// command line arguments
var numArgs = process.argv.length;

// volume
var volume = 0;
var tableOfContentOnly = false;

if (numArgs >= 2) {
    volume = process.argv[2];
} else {
    console.log("Please provide a volume number to delete.");
}

MongoClient.connect(url, function(err, db) {
	if (err) {
		throw err;
	}

	var xishuipangDb = db.db("Xishuipang");

    xishuipangDb.collection("Articles").deleteMany({volume:volume}, function(err, res) {
	    if (err) {
            throw err;
        }

        console.log("Articles from volume " + volume + " are deleted from the database.");

        xishuipangDb.collection("TableOfContents").deleteMany({volume:volume}, function(err, res) {
            if (err) {
                throw err;
            }

            console.log("Table of contents for volume " + volume + " are deleted from the database.");

            db.close();
        });
    });
});
