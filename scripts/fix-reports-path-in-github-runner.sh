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
  
  # Check and process lcov.info file
  if [ -f "packages/$projectFolder/reports/coverage/lcov.info" ]; then
    sed -i "s+$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/coverage/lcov.info"
  fi
  
  # Check and process eslint.json file
  if [ -f "packages/$projectFolder/reports/eslint.json" ]; then
    sed -i "s+/$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/eslint.json"
  fi
  
  # Check and process sonar results-report.xml file
  if [ -f "packages/$projectFolder/reports/sonar/results-report.xml" ]; then
    sed -i "s+/$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/sonar/results-report.xml"
  fi
done
