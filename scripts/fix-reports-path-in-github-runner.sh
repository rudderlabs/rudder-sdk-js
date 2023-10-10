#!/bin/bash
# Path variables
defaultPrefixToReplace="/github/workspace"
defaultAbsolutePathPrefix="home/runner/work/rudder-sdk-js/rudder-sdk-js"
selfHostedAbsolutePathPrefix="runner/_work/rudder-sdk-js/rudder-sdk-js"
absolutePathPrefix="$defaultAbsolutePathPrefix"
# List of package folders
projectFolderNames=("analytics-js" "analytics-js-common" "analytics-js-integrations" "analytics-js-plugins" "analytics-js-service-worker" "analytics-v1.1")

# List of files to alter
for projectFolder in "${projectFolderNames[@]}"; do
  echo "Replacing $absolutePathPrefix for $projectFolder reports"
  sed -i "s+$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/coverage/lcov.info"
  sed -i "s+/$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/eslint.json"
  sed -i "s+/$absolutePathPrefix+$defaultPrefixToReplace+g" "packages/$projectFolder/reports/sonar/results-report.xml"
done
