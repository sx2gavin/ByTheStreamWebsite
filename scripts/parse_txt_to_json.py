#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys

# a file is a .txt file.
def GenerateJsonFile(filename):
    filenameWithoutExtension = filename[:len(filename)-4]

    originalFile = open(filename, "r")

    outputFile = open(filenameWithoutExtension + ".json", "w")

    text = []

    text.append("{")

    theme = originalFile.readline()
    if theme:
        theme = theme.rstrip()
        text.append("   \"category\": \"" + theme + "\",")

    title = originalFile.readline()
    if title :
        title = title.rstrip()
        text.append("   \"title\": \"" + title + "\",")

    author = originalFile.readline()
    if author :
        author = author.rstrip()
        text.append("   \"author\": \"" + author + "\",")

    line = originalFile.readline()
    if line:
        text.append("   \"content\": [")
        while line:
            line = line.rstrip()
            content_line = "       \"" + line + "\""
            line = originalFile.readline()
            if line:
                content_line += ","
            text.append(content_line)

        text.append("   ]")
    text.append("}")

    for i in range(0, len(text)):
        text[i] = text[i] + "\n"

    outputFile.writelines(text)

    originalFile.close()
    outputFile.close()

def main():
    path = ""
    if len(sys.argv) > 1:
        path = sys.argv[1]
        GenerateJsonFile(path)
    else :
        path = '.' #current directory
        files = os.listdir(path)

        for one_file in files:
            if one_file.endswith(".txt") :
                GenerateJsonFile(one_file)

main()
