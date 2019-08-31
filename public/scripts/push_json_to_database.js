////////////////////////////////////////////////////////////////////////////////////////////////////
//
// This script addes all the article json files to mongodb data base.
// Date created: 2018/3/31
// Author: Gavin Luo
//
// How to use this script:
//   $ node push_json_to_database.js <volume number> -t
// 
// Use this script to upload content to MongoDB server.
// 
// <volume number>:  
//      volume number indicates the content folder location. i.e. 50 indicates that
//      the volume location is at ../content/volume_50/
//
// -t: 
//      if -t flag is provided, then only the table of content json from the ../content/volume_<volume number> folder
//      will be uploaded to the MongoDB server. This is useful if you just want to update some information
//      in the table of content without having to reupload everything else again.
////////////////////////////////////////////////////////////////////////////////////////////////////

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

if (numArgs >= 3) {
	volume = process.argv[2];
	for (i in process.argv) {
		var argv = process.argv[i];
		if (argv === "--table-of-content-only" || argv == "-t") {
			tableOfContentOnly = true;
			console.log("Only uploading table of contents mode activated.");
		}
	}
} else {
	console.error("Error: volume number is not provided in the command line.");
	process.exit(1);
}

MongoClient.connect(url, function (err, db) {
	if (err) {
		throw err;
	}
	var xishuipangDb = db.db("Xishuipang");
	var volumeDirectory = "../content/volume_" + volume;
	// go to the volume folder and load each file.
	fs.readdir(volumeDirectory, function (err, files) {
		if (err) {
			console.error("Error: " + volumeDirectory + " doesn't exist. Please make sure that the volume data is available.");
			throw err;
		}
		console.log("In " + volumeDirectory + "...");
		var pending = 0;
		var finished = false;
		for (i in files) {
			var filename = files[i];
			var fullFilePath = volumeDirectory + "/" + filename;


			if (filename == "table_of_content_s.json" || filename == "table_of_content_t.json") {
				// read the table of content file and add it to the database.
				pending++;
				fs.readFile(fullFilePath, function (err, data) {
					if (err) {
						console.error("Error: " + fullFilePath + " doesn't exist or cannot be read.");
						throw err;
					}
					var jsonObj = JSON.parse(data);
					var volumeNum = jsonObj.volume;
					var character = jsonObj.character;

					// either insert a new article or update the current one.
					xishuipangDb.collection("TableOfContents").updateOne({ volume: volumeNum, character: character }, { $set: jsonObj }, { upsert: true }, function (err, res) {
						if (err) {
							throw err;
						}
						console.log("Table of content added.");
						pending--;
						if (pending == 0 && finished == true) {
							db.close();
						}
					});
				});
			} else if (path.extname(filename) == ".json" && tableOfContentOnly == false) {

				// read the file and add it to the database.
				fs.readFile(fullFilePath, function (err, data) {
					if (err) {
						console.error("Error: " + fullFilePath + " doesn't exist or cannot be read.");
						throw err;
					}
					var jsonObj = JSON.parse(data);
					var articleId = jsonObj.id;
					var volumeNum = jsonObj.volume;

					// either insert a new article or update the current one.
					xishuipangDb.collection("Articles").updateOne({ volume: volumeNum, id: articleId }, { $set: jsonObj }, { upsert: true }, function (err, res) {
						if (err) {
							throw err;
						}
						console.log(articleId + " added.");
						pending--;
						if (pending == 0 && finished == true) {
							db.close();
						}
					});
				});
			}
		}
		finished = true;
	});
	console.log("Xishuipang database connected!");
});
