#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import logging
import subprocess

def main():

    # create logger.
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    currentPath = "."
    path = "content"

    # create the new path.
    if not os.path.exists(path) :
        os.mkdir(path)

    # go through each content folder and generate new contents.
    for folder in os.listdir(currentPath) :
        if os.path.isdir(folder) and str.isdigit(folder) :
            volumePath = path + "/volume_" + folder
            if not os.path.exists(volumePath):
                logger.info("Creating directory " + volumePath + " ...")
                os.mkdir(volumePath)

            # intermediate folder is used to store text files.
            # intermediateFolder = volumePath + "/intermediate"
            # if not os.path.exists(intermediateFolder):
            #     logger.info("Creating directory " + intermediateFolder + " ...")
            #     os.mkdir(intermediateFolder)

            logger.info("Converting htm files to text files...")
            logger.info("Copying all text files to intermediate folder...")
            for htmFile in os.listdir(folder):
                if htmFile.endswith(".htm") :
                    logger.info(htmFile)
                    command = ["textutil", "-convert", "txt", folder + "/" + htmFile]
                    subprocess.call(command)
                    txtFile = htmFile[:len(htmFile)-4] + ".txt"
                    subprocess.call(["cp", folder + "/" + txtFile, volumePath])

main()
