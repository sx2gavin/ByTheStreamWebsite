////////////////////////////////////////////////////////////////////////////////////////////////////
//
// This script addes all the article json files to mongodb data base.
// Date created: 2018/3/31
// Author: Gavin Luo
//
////////////////////////////////////////////////////////////////////////////////////////////////////


var url = "mongodb://127.0.0.1:27017/" // Remember to change this url for the production database.
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');

// command line arguments
var numArgs = process.argv.length;

// volume
var volume = 0;
if (numArgs >= 3) {
	volume = process.argv[2];
}
else {
	console.error("Error: volume number is not provided in the command line.");
	process.exit(1);
}

var volumeDirectory = "../content/volume_" + volume;



MongoClient.connect(url, function(err, db) {
	if (err) {
		throw err;
	}
	var xishuipangDb = db.db("Xishuipang");
	xishuipangDb.collection("Articles").drop(function(err, delOK) {
		if (err) {
			console.log("Articles collection doesn't exist...");
		}

		if (delOK) {
			console.log("Articles collection cleared...");
		}

		xishuipangDb.createCollection("Articles", function(err, res) {
			if (err) {
				throw err;
			}
			console.log("Articles collection ready.");

			// go to the volume folder and load each file.
			fs.readdir(volumeDirectory, function(err, files) {
				if (err) {
					console.error("Error: " + volumeDirectory + " doesn't exist. Please make sure that the volume data is available.");
					throw err;
				}
				console.log("In " + volumeDirectory + "...");
				for (i in files) {
					var filename = files[i];
					if (path.extname(filename) == ".json") {
						var fullFilePath = volumeDirectory + "/" + filename;

						// read the file and add it to the database.
						fs.readFile(fullFilePath, function(err, data) {
							if (err) {
								console.error("Error: " + fullFilePath + " doesn't exist or cannot be read.");
								throw err;
							}
							var jsonObj = JSON.parse(data);
							var articleId = jsonObj.id;
							xishuipangDb.collection("Articles").insertOne(jsonObj, function(err, res) {
								if (err) {
									throw err;
								}
								console.log(articleId + " added.");
							});
						});
					}
				}
			});

		});
	});

	console.log("Xishuipang database connected!");
});
