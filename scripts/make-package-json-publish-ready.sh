#!/bin/sh

# Define the base directory of your monorepo
BASE_DIR=$(pwd)

# If arguments are provided, use them; otherwise process all packages
if [ $# -eq 0 ]; then
  PACKAGES_DIR="$BASE_DIR/packages"
  PACKAGES=$(find "$PACKAGES_DIR" -mindepth 1 -maxdepth 1 -type d)
else
  PACKAGES="$@"
fi

# Iterate over each package directory
for package in $PACKAGES; do
  # Convert to absolute path if relative
  if [ "${package#/}" = "$package" ]; then
    package="$BASE_DIR/$package"
  fi

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

# Add postinstall script to the legacy SDK package.json if it's being processed
for package in $PACKAGES; do
  # Convert to absolute path if relative
  if [ "${package#/}" = "$package" ]; then
    package="$BASE_DIR/$package"
  fi

  # Check if this is the legacy SDK package
  if [ "$(basename "$package")" = "analytics-v1.1" ]; then
    package_json="$package/package.json"
    echo "Adding postinstall script to $package_json..."
    jq '.scripts = (.scripts // {}) | .scripts.postinstall = "echo '\''This package is deprecated and no longer maintained. While your events are still being tracked and delivered, we strongly recommend you to migrate to the latest @rudderstack/analytics-js (https://www.npmjs.com/package/@rudderstack/analytics-js) package for enhanced features, security updates, and ongoing support. For more details, visit the migration guide: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/migration-guide/'\''"' "$package_json" > "$package/package_cleaned.json" && mv "$package/package_cleaned.json" "$package_json"
  fi
done

echo "Cleaning completed for all packages."
