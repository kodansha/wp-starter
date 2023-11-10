#!/usr/bin/env bash

#===============================================================================
# This script checks the diff of the most recent wp-starter Git tag
# and the most recent official Bedrock Git tag
#===============================================================================

set -uo pipefail

# Get the most recent Git tag that starts with "bedrock/"
wp_starter_bedrock_tag=$(git tag -l 'bedrock/*' | xargs -I{} git log -1 --format="%ai {}" {} | sort -r | head -n 1 | awk '{print $4}' | cut -d'/' -f2-)

pushd "$(dirname "$0")" >/dev/null 2>&1

git clone git@github.com:roots/bedrock.git >/dev/null 2>&1

pushd bedrock >/dev/null 2>&1

git pull

# Get the most recent Bedrock tag
original_bedrock_tag=`git describe --tags --abbrev=0`

echo "========================================================================="
echo $wp_starter_bedrock_tag : The most recent wp-starter tag
echo ↓
echo $original_bedrock_tag : The most recent Bedrock tag
echo "========================================================================="

git difftool -d ${wp_starter_bedrock_tag} ${original_bedrock_tag}
