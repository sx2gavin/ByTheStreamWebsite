#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import logging
import subprocess

# create logger.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if len(sys.argv) < 3:
    logger.error("Error: you didn't provide input path and output path.");
    sys.exit(0);

inputPath = sys.argv[1]
outputPath = sys.argv[2]

if not os.path.exists(inputPath):
    logger.error("Error: inputPath doesn't exist.");
    sys.exit(0);

# create the new path.
if not os.path.exists(outputPath) :
    os.mkdir(outputPath)

# go through each content folder and generate new contents.
'''
for folder in os.listdir(inputPath) :
    if os.path.isdir(folder) and str.isdigit(folder) :
        volumePath = path + "/volume_" + folder
        if not os.path.exists(volumePath):
            logger.info("Creating directory " + volumePath + " ...")
            os.mkdir(volumePath)
'''

logger.info("Converting files to text files...")
for htmFile in os.listdir(inputPath) :
    if htmFile.endswith(".htm") or htmFile.endswith(".doc") :
        logger.info(htmFile)
        command = ["textutil", "-convert", "txt", inputPath + "/" + htmFile]
        subprocess.call(command)
        txtFile = htmFile[:len(htmFile)-4] + ".txt"
        subprocess.call(["cp", inputPath + "/" + txtFile, outputPath])
