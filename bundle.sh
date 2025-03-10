#!/bin/bash

set -ueo pipefail

ADDON="plugin.video.elementum"
PLATFORM=""
SUFFIX=""
TARGET=""

ZIPIGNORE=(-x "${ADDON}/web-src" -x "${ADDON}/.*" -x "${ADDON}/.git" -x "${ADDON}/resources/web-src/*" -x "${ADDON}/*.sh" -x "${ADDON}/*.zip" -x "${ADDON}/*.pyc")

PWD=$(pwd)
VERSION=$(git describe --tags)

version_update() {
    echo "## Creating 'version' files in platform folders"
    DIRS="$(find ${PWD}/resources/bin/ -mindepth 1 -maxdepth 1 -type d)"
    for d in $DIRS
    do
        echo "${VERSION}${SUFFIX}" > ${d}/version
    done
}

help() {
    cat <<EOD

Parameters available:
-p | --platform - Optional. Specific platform, otherwise all platforms would be used for bundling.
-b | --binaries - Required. Folder with binaries (should have folders inside, like android_x64, linux_arm64).
-s | --suffix - Optional. Suffix to add to a zip file.
-t | --target - Optional. Where to copy result zip file.

EOD
}

for i in "$@"; do
  case $i in
    -p=*|--platform=*)
      PLATFORM="${i#*=}"
      shift # past argument=value
      ;;
    -b=*|--binaries=*)
      BINARIES="${i#*=}"
      shift # past argument=value
      ;;
    -s=*|--suffix=*)
      SUFFIX="${i#*=}"
      shift # past argument=value
      ;;
    -t=*|--target=*)
      TARGET="${i#*=}"
      shift # past argument=value
      ;;
    -h=*|--help=*)
      help
      exit 1
      ;;
    -*|--*)
      echo "Unknown option $i"
      help
      exit 1
      ;;
    *)
      ;;
  esac
done

if [ -z "${BINARIES}" ]; then
    echo "## Error: Cannot continue without -b/--binaries argument pointing to a folder with Elementum binaries"
    exit 1
else
    echo "## Using ${BINARIES} folder with Elementum binaries"
fi

if [ ! -z "${SUFFIX}" ]; then
    SUFFIX=".${SUFFIX}"
fi

if [ -z "${PLATFORM}" ]; then
    echo "## Using all platform files"
    ZIPFILE="plugin.video.elementum-${VERSION}${SUFFIX}.zip"
else
    echo "## Using ${PLATFORM} platform files"
    ZIPFILE="plugin.video.elementum-${VERSION}.${PLATFORM}${SUFFIX}.zip"
fi

if [ -z "${TARGET}" ]; then
    ZIPPATH="${PWD}/${ZIPFILE}"
else
    [[ ! -d "${TARGET}" ]] && mkdir -p "${TARGET}"
    TARGET=$(readlink -f "${TARGET}") # make path absolute
    ZIPPATH="${TARGET}/${ZIPFILE}"
fi

make deps

echo
echo "## Creating ${ZIPPATH} archive file"
if [[ -f "${ZIPPATH}" ]]; then
    echo "## ${ZIPPATH} already exists, removing it"
    rm ${ZIPPATH}
fi

echo "## Cleaning up existing ${PWD}/resources/bin/ folder"
rm -rf ${PWD}/resources/bin/*

echo "## Adding plugin.video.elementum files into ${ZIPPATH}"
(cd .. && zip -r ${ZIPPATH} ${ADDON} "${ZIPIGNORE[@]}" -x "${ADDON}/resources/bin/*" )

if [ -z "${PLATFORM}" ]; then
    echo "## Copying binaries from ${BINARIES}/* to ${PWD}/resources/bin/"
    cp -rf ${BINARIES}/* ${PWD}/resources/bin/

    version_update

    echo "## Adding binaries from resources/bin/ into ${ZIPPATH}"
    (cd .. && zip -r -g ${ZIPPATH} ${ADDON}/resources/bin/ "${ZIPIGNORE[@]}")
else
    echo "## Copying binaries from ${BINARIES}/${PLATFORM} to ${PWD}/resources/bin/"
    cp -rf ${BINARIES}/${PLATFORM} ${PWD}/resources/bin/

    version_update

    echo "## Adding binaries from resources/bin/${PLATFORM} into ${ZIPPATH}"
    (cd .. && zip -r -g ${ZIPPATH} ${ADDON}/resources/bin/${PLATFORM} "${ZIPIGNORE[@]}")
fi

echo "## Zip location: ${ZIPPATH}"
