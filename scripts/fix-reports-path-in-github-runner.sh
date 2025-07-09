#!/bin/bash
# Path variables
defaultPrefixToReplace=""
defaultAbsolutePathPrefix="home/runner/work/rudder-sdk-js/rudder-sdk-js/"
selfHostedAbsolutePathPrefix="runner/_work/rudder-sdk-js/rudder-sdk-js/"
absolutePathPrefix="$selfHostedAbsolutePathPrefix"
# List of package folders
projectFolderNames=("analytics-js" "analytics-js-common" "analytics-js-integrations" "analytics-js-plugins" "analytics-js-service-worker" "analytics-v1.1" "analytics-js-cookies")

# List of files to alter
for projectFolder in "${projectFolderNames[@]}"; do
  echo "Replacing $absolutePathPrefix for $projectFolder reports"
  
  # Define report files to process with their sed patterns
  declare -A reportFiles=(
    ["reports/coverage/lcov.info"]="$absolutePathPrefix"
    ["reports/eslint.json"]="/$absolutePathPrefix"
    ["reports/sonar/results-report.xml"]="/$absolutePathPrefix"
  )
  
  # Process each report file
  for reportFile in "${!reportFiles[@]}"; do
    fullPath="packages/$projectFolder/$reportFile"
    if [ -f "$fullPath" ]; then
      sed -i "s+${reportFiles[$reportFile]}+$defaultPrefixToReplace+g" "$fullPath"
    fi
  done
done
