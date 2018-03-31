#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import json

# This script is used for generating a json file that contains the table of contents for the current folder.
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

def generate_table_of_content_json(filenames):

    # main json object
    main_json_obj = {"table_of_content":[]}

    for one_file_name in filenames:
        with open(one_file_name, 'r') as content_file:
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



            article_detail["file"] = one_file_name[:len(one_file_name)-4] + ".json";

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


    with open("table_of_content.json", 'w') as output_file:
        text = []
        text.append("{")
        text.append("   \"table_of_content\":[")
        category_objects = main_json_obj["table_of_content"];
        for cat in range(0, len(category_objects)):
            category = category_objects[cat]
            text.append("       {")
            text.append("           \"category\":\"" + category["category"] + "\",")
            text.append("           \"articles\":[")
            for art in range(0, len(category["articles"])):
                article = category["articles"][art]
                text.append("               {")
                text.append("                   \"title\":\"" + article["title"] + "\",")
                text.append("                   \"author\":\"" + article["author"] + "\",")
                text.append("                   \"file\":\"" + article["file"] + "\"")
                text.append("               }")
                if art != len(category["articles"]) - 1:
                    text.append("               ,")

            text.append("           ]")
            text.append("       }")
            if cat != len(category_objects) - 1:
                text.append("       ,") 

        text.append("   ]")
        text.append("}")

        for i in range(0, len(text)):
            text[i] = text[i] + "\n"

        #print(text)

        output_file.writelines(text);


def main():

    mode = "txt"

    # modes can be either txt or json
    if len(sys.argv) > 1:
        mode = sys.argv[1]
    
    
    path = '.' #current directory
    files = os.listdir(path)

    filenames = []

    for one_file in files:
        if one_file.endswith(".txt"):
            filenames.append(one_file)

    generate_table_of_content_json(filenames)

main()
