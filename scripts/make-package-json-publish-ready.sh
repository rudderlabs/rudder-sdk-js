#!/bin/sh

# Accept base and head as parameters (default to develop and HEAD)
BASE_REF=${1:-develop}
HEAD_REF=${2:-HEAD}

# Define the base directory of your monorepo
BASE_DIR=$(pwd)
# Define the directory containing your packages
PACKAGES_DIR="$BASE_DIR/packages"

# Get affected projects using Nx
echo "Getting affected packages (base: $BASE_REF, head: $HEAD_REF)..."
AFFECTED_PROJECTS=$(npx nx show projects --affected --base="$BASE_REF" --head="$HEAD_REF" 2>/dev/null)

if [ -z "$AFFECTED_PROJECTS" ]; then
  echo "No affected packages found."
  exit 0
fi

echo "Affected packages:"
echo "$AFFECTED_PROJECTS"
echo ""

# Convert project names to package directories
for project in $AFFECTED_PROJECTS; do
  # Extract package name from @rudderstack/analytics-js format
  package_name=$(echo "$project" | sed 's/@rudderstack\///')

  # Map project names to their directory names
  case "$package_name" in
    "analytics-js-loading-scripts") package_dir="loading-scripts" ;;
    "analytics-js-sanity-suite") package_dir="sanity-suite" ;;
    "rudder-sdk-js") package_dir="analytics-v1.1" ;;
    *) package_dir="$package_name" ;;
  esac

  package="$PACKAGES_DIR/$package_dir"

  if [ -d "$package" ]; then
    PACKAGE_JSON="$package/package.json"
    if [ -f "$PACKAGE_JSON" ]; then
      echo "Cleaning $PACKAGE_JSON..."

      # Special handling for legacy SDK (rudder-sdk-js)
      if [ "$package_name" = "rudder-sdk-js" ]; then
        # Clean and then add back the postinstall script
        jq 'del(.dependencies, .devDependencies, .peerDependencies, .optionalDependencies, .overrides, .scripts, .browserslist) | .scripts = {"postinstall": "echo '\''This package is deprecated and no longer maintained. While your events are still being tracked and delivered, we strongly recommend you to migrate to the latest @rudderstack/analytics-js (https://www.npmjs.com/package/@rudderstack/analytics-js) package for enhanced features, security updates, and ongoing support. For more details, visit the migration guide: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/migration-guide/'\''" }' "$PACKAGE_JSON" > "$package/package_cleaned.json" && mv "$package/package_cleaned.json" "$PACKAGE_JSON"
      else
        # Standard cleaning for all other packages
        jq 'del(.dependencies, .devDependencies, .peerDependencies, .optionalDependencies, .overrides, .scripts, .browserslist)' "$PACKAGE_JSON" > "$package/package_cleaned.json" && mv "$package/package_cleaned.json" "$PACKAGE_JSON"
      fi
    else
      echo "No package.json found in $package"
    fi
  else
    echo "Package directory not found: $package"
  fi
done

echo "Cleaning completed for affected packages."
