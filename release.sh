#!/bin/bash

set -e
set -x

TAG=$(git describe --tags)

# git checkout master

rm -rf plugin.video.elementum

# Get Elementum binaries
wget https://github.com/elgatito/elementum-binaries/archive/master.zip && \
unzip master.zip && \
mv elementum-binaries-master/* resources/bin/ && \
rm -rf elementum-binaries-master && \
rm master.zip

# Get platform_detect library
wget https://github.com/ElementumOrg/platform_detect/archive/master.zip && \
unzip master.zip && \
cp -rf platform_detect-master/python resources/site-packages/platform_detect && \
cp -rf platform_detect-master/libraries resources/site-packages/platform_detect/ && \
rm -rf platform_detect-master && \
rm master.zip

sudo -S true

# Install Python dependencies
pip3 install -r requirements.txt

# Run linting
python3 -m flake8
./scripts/xgettext.sh

# Compile zip artifacts
make
make deps
make zipfiles

# Run artifact uploads if we are on the tag
if [[ $TAG != *-* ]]
then
    make upload
fi
