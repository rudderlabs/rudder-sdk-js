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
  echo "Sync version in project.json: ${packageName}, $packageVersion"
  # This will not work on MAC system
  sed -i "s/$packageName@.*/$packageName@$packageVersion\",/" project.json
  cd ..
  cd ..
done
