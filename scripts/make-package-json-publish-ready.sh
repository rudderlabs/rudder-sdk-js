#!/bin/sh

# Define the base directory of your monorepo
BASE_DIR=$(pwd)
# Define the directory containing your packages
PACKAGES_DIR="$BASE_DIR/packages"

# Iterate over each package directory
for package in "$PACKAGES_DIR"/*; do
  if [ -d "$package" ]; then
    PACKAGE_JSON="$package/package.json"
    if [ -f "$PACKAGE_JSON" ]; then
      echo "Cleaning $PACKAGE_JSON..."
      jq 'del(.dependencies, .devDependencies, .peerDependencies, .optionalDependencies, .overrides, .scripts, .browserslist)' "$PACKAGE_JSON" > "$package/package_cleaned.json" && mv "$package/package_cleaned.json" "$PACKAGE_JSON"
    else
      echo "No package.json found in $package"
    fi
  fi
done

# Add postinstall script to the legacy SDK package.json
legacy_sdk_package="$PACKAGES_DIR/analytics-v1.1"
package_json="$legacy_sdk_package/package.json"

echo "Adding postinstall script to $package_json..."
jq '.scripts = (.scripts // {}) | .scripts.postinstall = "echo '\''This package is deprecated and no longer maintained. While your events are still being tracked and delivered, we strongly recommend you to migrate to the latest @rudderstack/analytics-js (https://www.npmjs.com/package/@rudderstack/analytics-js) package for enhanced features, security updates, and ongoing support. For more details, visit the migration guide: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/migration-guide/'\''"' "$package_json" > "$legacy_sdk_package/package_cleaned.json" && mv "$legacy_sdk_package/package_cleaned.json" "$package_json"

echo "Cleaning completed for all packages."
