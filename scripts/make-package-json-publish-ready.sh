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

echo "Cleaning completed for all packages."
