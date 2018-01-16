#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys

# a file is a .txt file.
def generate_json_file(filename):
    file_name_without_extension = filename[:len(filename)-4]

    original_file = open(filename, "r")

    output_file = open(file_name_without_extension + ".json", "w")

    text = []

    text.append("{")

    theme = original_file.readline()
    if theme:
        theme = theme.rstrip()
        text.append("   \"category\": \"" + theme + "\",")

    title = original_file.readline()
    if title :
        title = title.rstrip()
        text.append("   \"title\": \"" + title + "\",")

    author = original_file.readline()
    if author :
        author = author.rstrip()
        text.append("   \"author\": \"" + author + "\",")

    line = original_file.readline()
    if line:
        text.append("   \"content\": [")
        while line:
            line = line.rstrip()
            content_line = "       \"" + line + "\""
            line = original_file.readline()
            if line:
                content_line += ","
            text.append(content_line)

        text.append("   ]")
    text.append("}")

    for i in range(0, len(text)):
        text[i] = text[i] + "\n"

    output_file.writelines(text)

    original_file.close()
    output_file.close()

def main():
    path = ""
    if len(sys.argv) > 1:
        path = sys.argv[1]
        generate_json_file(path)
    else :
        path = '.' #current directory
        files = os.listdir(path)

        for one_file in files:
            if one_file.endswith(".txt") :
                generate_json_file(one_file)

main()
