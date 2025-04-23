#!/bin/sh
echo "Elementum changelog"
echo "==============="
git tag -l | sort -u -r -V | while read TAG ; do
    if [ $NEXT ];then
        TAG_DATE=$(git log --no-merges --date=short --format="%ad" $TAG..$NEXT | head -1)
        echo "[B]$NEXT[/B] - $TAG_DATE"
    fi
    GIT_PAGER=cat git log --no-merges --format=" - %s" $TAG..$NEXT | awk -F ' - ' '
      { gsub(/.{50,60} /,"&\n   ", $2); \
        printf "%s - %s\n", $1, $2 }'
    NEXT=$TAG
    echo
done
FIRST=$(git tag -l | head -1)
TAG_DATE=$(git log --no-merges --date=short --format="%ad" $FIRST | head -1)
echo "[B]$FIRST[/B] - $TAG_DATE"
GIT_PAGER=cat git log --no-merges --format=" - %s" $FIRST
echo
