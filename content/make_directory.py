#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function
import os, sys
import logging
import subprocess


# create logger.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

path = "."

for i in range(2, 52):
    volumePath = path + "/volume_" + str(i)
    if not os.path.exists(volumePath):
        logger.info("Creating directory " + volumePath + " ...")
        os.mkdir(volumePath)

