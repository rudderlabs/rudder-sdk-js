#!/bin/bash
# List of package folders
defaultPrefixToReplace="/github/workspace"
defaultAbsolutePathPrefix="home/runner/work/rudder-sdk-js/rudder-sdk-js"
selfHostedAbsolutePathPrefix="runner/_work/rudder-sdk-js/rudder-sdk-js"

# List of files to alter
sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js/reports/sonar/results-report.xml

sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-common/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-common/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-common/reports/sonar/results-report.xml

sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-integrations/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-integrations/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-integrations/reports/sonar/results-report.xml

sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-plugins/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-plugins/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-plugins/reports/sonar/results-report.xml

sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-service-worker/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-service-worker/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-js-service-worker/reports/sonar/results-report.xml

sed -i "s+$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-v1.1/reports/coverage/lcov.info
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-v1.1/reports/eslint.json
sed -i "s+/$selfHostedAbsolutePathPrefix+$defaultPrefixToReplace+g" packages/analytics-v1.1/reports/sonar/results-report.xml
