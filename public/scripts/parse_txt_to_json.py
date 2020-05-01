#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import io
import json
import logging
import subprocess

###############################################################################################################
# 2018.03.20
# Gavin Luo
#
# This script is used to convert a folder of text files to a folder of json files.
# You can use the script like this:
#   $ python parse_txt_to_json.py [VOLUME NUMBER] [INPUT FOLDER PATH] [OUTPUT FOLDER PATH]
# Before you use this script, please make sure that the text file has the following format:
#   1 line - Category.
#   2 line - Title of the article. 
#   3 line - Author of the article.
#   >3 line - Content of the article.
# if one article doesn't have category or title or author, do leave a blank line.
#
###############################################################################################################

# GenerateJsonFile
#   This function takes in a text file path and generate a json file that contains all the information about this file.
# Parameters:
#   filename - text file path
#   inputPath - the location of the text file, no trailing slash please.
#   outputPath - destination of the output json file, no trailing slash please.
# Output:
#   Create a Json file with the same name and save it in the provided directory. 
def GenerateJsonFile(filename, volume_number, version, inputPath, outputPath):

    filenameWithoutExtension = filename.split('.')[0]

    originalFile = open(inputPath + "/" + filename, "r")
    outputFile = open(outputPath + "/" + filenameWithoutExtension + ".json", "w")

    version_text = "simplified"
    if version == "s" :
        version_text = "simplified"
    elif version == "t" :
        version_text = "traditional"
    elif version == "e" :
        version_text = "english"

    text = []

    text.append("{")
    text.append("    \"volume\": \"" + volume_number + "\",")
    text.append("    \"id\": \"" + filenameWithoutExtension + "\",")
    text.append("    \"character\": \"" + version_text + "\",")

    theme = originalFile.readline()
    if theme:
        theme = theme.rstrip()
        text.append("    \"category\": \"" + theme + "\",")

    title = originalFile.readline()
    if title :
        title = title.rstrip()
        text.append("    \"title\": \"" + title + "\",")

    author = originalFile.readline()
    if author :
        author = author.rstrip()
        text.append("    \"author\": \"" + author + "\",")

    line = originalFile.readline()
    if line:
        text.append("    \"content\": [")
        while line:
            line = line.rstrip()
            line = line.replace("\"", "\\\"")
            content_line = "        \"" + line + "\""
            line = originalFile.readline()
            if line:
                content_line += ","
            text.append(content_line)

        text.append("    ]")
    text.append("}")

    for i in range(0, len(text)):
        text[i] = text[i] + "\n"

    outputFile.writelines(text)

    originalFile.close()
    outputFile.close()


# GenerateTableOfContent
# This function is used for generating a json file that contains the table of contents for the current folder.
# This file will open all .json files in the current folder, assuming that each .json file is a content file containing an article that is consisted
# with the following keys:
# - category
# - title
# - author
# - content
# i.e.:
# {
#   "category" : "YOUR CATEGORY HERE",
#   "title"    : "YOUR TITLE HERE",
#   "author"   : "YOUR AUTHOR HERE",
#   "content"  : ["YOUR ARTICLE CONTENT", "YOUR ARTICLE CONTENT", "YOUR ARTICLE CONTENT"]
# }
#
def GenerateTableOfContent(volumeNumber, filenamesDictionary, character, inputPath, outputPath, tableOfContentFilename, metadata):

    # main json object
    main_json_obj = {"table_of_content":[]}

    for key in sorted(filenamesDictionary.keys()):
        one_file_name = filenamesDictionary[key]
        with open(inputPath + "/" + one_file_name, 'r') as content_file:
            article_detail = {}

            category = content_file.readline()
            title = content_file.readline()
            author = content_file.readline()

            if category:
                category = category.rstrip()

            article_detail["title"] = ""
            if title:
                title = title.rstrip()
                article_detail["title"] = title

            article_detail["author"] = ""
            if author:
                author = author.rstrip()
                article_detail["author"] = author

            article_detail["id"] = one_file_name[:len(one_file_name)-4]
            article_detail["file"] = one_file_name[:len(one_file_name)-4] + ".json"

            need_new_category = True
            for each_category in main_json_obj["table_of_content"]:
                if (category and each_category["category"] == category) or (not category and each_category["category"] == ""):
                    each_category["articles"].append(article_detail)
                    need_new_category = False

            if need_new_category :
                if category:
                    main_json_obj["table_of_content"].append({"category":category, "articles":[article_detail]})
                else:
                    main_json_obj["table_of_content"].append({"category":"", "articles":[article_detail]})

    theme = ""
    if character == "simplified" and "theme_simplified" in metadata.keys() : 
        theme = metadata["theme_simplified"] + ' ' + metadata["theme_english"]
    elif character == "traditional" and "theme_traditional" in metadata.keys() :
        theme = metadata["theme_traditional"] + ' ' + metadata["theme_english"]

    year = ""
    if "year" in metadata.keys():
        year = metadata["year"]
    
    month = ""
    if "month" in metadata.keys():
        month = metadata["month"]

    with open(outputPath + "/" + tableOfContentFilename, 'w') as output_file:
        text = []
        text.append("{")
        text.append("    \"volume\": \"" + volumeNumber + "\",")
        text.append("    \"title\": \"溪水旁第" + volumeNumber + "期\",")
        text.append("    \"character\": \"" + character + "\",")
        if theme != "" :
            text.append("    \"theme\": \"" + theme + "\",")
        if year != "" :
            text.append("    \"year\": \"" + year + "\",")
        if month != "" :
            text.append("    \"month\": \"" + month + "\",")
        text.append("    \"table_of_content\": [")
        category_objects = main_json_obj["table_of_content"]
        for cat in range(0, len(category_objects)):
            category = category_objects[cat]
            text.append("        {")
            text.append("            \"category\": \"" + category["category"] + "\",")
            text.append("            \"articles\": [")
            for art in range(0, len(category["articles"])):
                article = category["articles"][art]
                text.append("                {")
                text.append("                    \"title\": \"" + article["title"] + "\",")
                text.append("                    \"author\": \"" + article["author"] + "\",")
                text.append("                    \"id\": \"" + article["id"] + "\"")
                text.append("                }")
                if art != len(category["articles"]) - 1:
                    text.append("                ,")

            text.append("            ]")
            text.append("        }")
            if cat != len(category_objects) - 1:
                text.append("        ,") 

        text.append("    ]")
        text.append("}")

        for i in range(0, len(text)):
            text[i] = text[i] + "\n"

        output_file.writelines(text)

def ReadMetadata(metadataFile) :
    metadata = {}
    fileInstance = open(metadataFile, 'r')
    for line in fileInstance :
        tokens = line.split(':')
        if len(tokens) >= 2:
            name = tokens[0].strip()
            value = tokens[1].strip()
            metadata[name] = value
    return metadata


def main():
    # create logger.
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    inputPath = "."
    outputPath = "."
    volume_number = 1

    if len(sys.argv) <= 1:
        logger.error("Please provide a volume number")
        sys.exit(0)

    # Read command line arguments
    if len(sys.argv) > 1:
        volume_number = sys.argv[1]

    inputPath = "../text/volume_" + volume_number
    outputPath = "../content/volume_" + volume_number

    if len(sys.argv) > 2:
        inputPath = sys.argv[2]

    if len(sys.argv) > 3:
        outputPath = sys.argv[3]

    if not os.path.exists(inputPath):
        logger.info("Error: " + inputPath + " does not exist.")
        sys.exit(0)

    if not os.path.exists(outputPath):
        os.mkdir(outputPath)

    files = os.listdir(inputPath)

    simplifiedTextFiles = {}
    traditionalTextFiles = {}

    metadata = {}

    for oneFile in files:
        if oneFile.endswith(".txt") and oneFile != "List.txt" :
            filename = oneFile.split('.')[0]
            if filename == "metadata" :
                metadata = ReadMetadata(inputPath + "/" + oneFile)
                continue

            segments = filename.split('_')
            if len(segments) > 0:
                index = int(segments[0])
                version = segments[-1] # get last item from the file name, normally it's either s(simplified) or t(traditional).

                logger.info("Reading " + oneFile)
                GenerateJsonFile(oneFile, volume_number, version, inputPath, outputPath)
                if version == "s" :
                    simplifiedTextFiles[index] = oneFile
                elif version == "t" :
                    traditionalTextFiles[index] = oneFile
                elif version == "e" :
                    simplifiedTextFiles[index] = oneFile
                    traditionalTextFiles[index] = oneFile
                else :
                    logger.error("ERROR: Text files did not follow the naming convention: <index>_<name>_<character_version>.txt")
                    sys.exit(0)

                logger.info(oneFile + " converted successfully.")

    if simplifiedTextFiles :
        GenerateTableOfContent(volume_number, simplifiedTextFiles, "simplified", inputPath, outputPath, "table_of_content_s.json", metadata)
        logger.info("Simplified table of content generated successfully.")
    if traditionalTextFiles :
        GenerateTableOfContent(volume_number, traditionalTextFiles, "traditional", inputPath, outputPath, "table_of_content_t.json", metadata)
        logger.info("Traditional table of content generated successfully.")

main()
