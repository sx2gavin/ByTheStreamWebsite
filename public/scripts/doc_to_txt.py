#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import logging
import subprocess

# create logger.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if len(sys.argv) < 2:
    logger.error("Error: you didn't provide a volume number.");
    sys.exit(0);

volume_number = sys.argv[1];

inputPath = "../docs/" + volume_number
outputPath = "../text/volume_" + volume_number

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
    if htmFile.endswith(".htm") or htmFile.endswith(".doc") or htmFile.endswith(".docx") :
        logger.info(htmFile)
        command = ["textutil", "-convert", "txt", inputPath + "/" + htmFile]
        subprocess.call(command)
        fileNameNoExtension = htmFile.split(".")[0];
        txtFile = fileNameNoExtension + ".txt"
        subprocess.call(["cp", inputPath + "/" + txtFile, outputPath])
