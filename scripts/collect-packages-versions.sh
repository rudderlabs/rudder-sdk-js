#!/bin/bash

# This script generates a Markdown table of all package versions in the monorepo.
#
# Purpose:
#   - Lists the root package and all packages under the 'packages' directory.
#   - For each package, compares its current version to the version on origin/main.
#   - If the version has changed, shows the new version; otherwise, shows 'N/A'.
#   - Output is a Markdown table suitable for pasting into PR descriptions or tickets.
#
# Usage:
#   ./scripts/collect-packages-versions.sh > package_versions.md
#
# Output format:
#   | Package | New version |
#   |---------|-------------|
#   | @package/name | 1.2.3 |
#   | ...           | N/A   |

set -e

echo "| Package | New version |"
echo "|---------|-------------|"

print_version_row() {
  local file_path="$1"
  if [ -f "$file_path" ]; then
    local name version prev_version
    name=$(jq -r .name "$file_path")
    version=$(jq -r .version "$file_path")
    prev_version=$(git show origin/main:"$file_path" 2>/dev/null | jq -r .version)
    if [ "$version" == "$prev_version" ]; then
      version="N/A"
    fi
    echo "| $name | $version |"
  fi
}

# Root package.json
print_version_row "package.json"

# All packages in packages/
find packages -name package.json | while read pkg; do
  print_version_row "$pkg"
done 
