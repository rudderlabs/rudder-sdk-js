#!/bin/bash
# List of package folders
absolutePathPrefix='home/runner/work/rudder-sdk-js/rudder-sdk-js'
prefixToReplace='/github/workspace'

# List of files to alter
sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js/reports/sonar/results-report.xml

sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-common/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-common/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-common/reports/sonar/results-report.xml

sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-integrations/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-integrations/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-integrations/reports/sonar/results-report.xml

sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-plugins/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-plugins/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-plugins/reports/sonar/results-report.xml

sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-service-worker/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-service-worker/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-js-service-worker/reports/sonar/results-report.xml

sed -i 's+home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-v1.1/reports/coverage/lcov.info
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-v1.1/reports/eslint.json
sed -i 's+/home/runner/work/rudder-sdk-js/rudder-sdk-js+/github/workspace+g' packages/analytics-v1.1/reports/sonar/results-report.xml
