#!/bin/bash
# List of package folders
projectFolderNames=("analytics-js" "analytics-js-common" "analytics-js-integrations" "analytics-js-plugins" "analytics-js-service-worker" "analytics-v1.1" "loading-scripts")

for projectFolder in "${projectFolderNames[@]}"; do
  # Set of package project name

  # Navigate to folder and perform the string replacement in project.json
  cd packages
  cd $projectFolder
  packageVersion=$(jq -r .version package.json)
  packageName=$(jq -r .name package.json)
  echo "Generate github release notes file: ${packageName}, $packageVersion"
  awk -v ver="$packageVersion" '
   /^(#|###) \[?[0-9]+.[0-9]+.[0-9]+/ {
      if (p) { exit };
      if (index($2, "[")) {
          split($2, a, "[");
          split(a[2], a, "]");
          if (a[1] == ver) {
              p = 1
          }
      } else {
          if ($2 == ver) {
              p = 1
          }
      }
  } p
  ' './CHANGELOG.md' > './CHANGELOG_LATEST.md'
  cd ..
  cd ..
done
