#!/bin/bash

set -o errexit
set -o nounset

git_dir="$(git rev-parse --show-toplevel)"
if [[ -f "$git_dir"/addon.xml ]]; then
    name="$(grep -Po '(?<=addon id=")[^"]+(?=")' "$git_dir"/addon.xml)"
else
    name="$(basename "$(git rev-parse --show-toplevel)")"
fi

echo "$name changelog"
echo "==============="

cat="$(command -v cat)"
export GIT_PAGER="$cat"

previous_tag=0
while read -r current_tag; do
    if [[ "$previous_tag" != 0 ]]; then
        tag_date=$(git log -1 --pretty=format:'%ad' --date=short ${previous_tag})
        printf "[B]%s[/B] - %s\n" "${previous_tag}" "${tag_date}"
        cmp="${current_tag}...${previous_tag}"
        [[ $current_tag == "LAST" ]] && cmp="${previous_tag}"
        git log "$cmp" --no-merges --pretty=format:' - %s' | awk -F ' - ' '
            {
                gsub(/.{50,60} /,"&\n   ", $2); \
                printf "%s - %s\n", $1, $2
            }'
    fi
    previous_tag="${current_tag}"
    printf "\n"
done < <(git tag -l | sort -u -r -V; echo LAST)
