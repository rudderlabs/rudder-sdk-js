#!/bin/bash

#
# Deprecate Beta NPM Packages from Closed PRs
#
# This script deprecates beta NPM packages from closed PRs that are
# potentially part of the recent release.
# It is meant to be run after the release is published to NPM.
#

set -euo pipefail

# Configuration
PACKAGES=(
  "@rudderstack/analytics-js"
  "@rudderstack/analytics-js-service-worker"
  "@rudderstack/analytics-js-cookies"
)

# Track processed PRs to avoid duplicate API calls
declare -A PR_STATUSES

echo "🚀 Starting beta package deprecation for closed PRs"

# Validate required environment variables
if [[ -z "${GH_TOKEN:-}" || -z "${GITHUB_REPOSITORY:-}" ]]; then
  echo "❌ Missing required environment variables: GH_TOKEN, GITHUB_REPOSITORY"
  exit 1
fi

# Extract PR number from beta version
# Beta version format: <version>-beta.pr.<pr_number>.<short_sha>
# Example: 3.0.0-beta.pr.1234.abc1234
extract_pr_number() {
  local version=$1
  echo "$version" | grep -oE 'beta\.pr\.([0-9]+)\.' | grep -oE '[0-9]+' | head -n1 || echo ""
}

# Check PR status using GitHub API (with caching)
check_pr_status() {
  local pr_number=$1

  # Return cached result if already checked
  if [[ -n "${PR_STATUSES[$pr_number]:-}" ]]; then
    echo "${PR_STATUSES[$pr_number]}"
    return
  fi

  local repo_owner repo_name
  repo_owner=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f1)
  repo_name=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)

  local response
  response=$(gh pr view "$pr_number" --repo "$repo_owner/$repo_name" --json state,merged)

  local state merged
  state=$(echo "$response" | jq -r '.state // "unknown"')
  merged=$(echo "$response" | jq -r '.merged // false')

  local result="$state:$merged"
  PR_STATUSES[$pr_number]="$result"
  echo "$result"
}

# Process each package
for package_name in "${PACKAGES[@]}"; do
  echo "📦 Processing: $package_name"

  # Get beta versions
  versions=$(npm view "$package_name" versions --json 2>/dev/null | jq -r 'if type == "array" then .[] else . end | select(contains("-beta.pr."))' || true)

  if [[ -z "$versions" ]]; then
    echo "  No beta versions found"
    continue
  fi

  echo "  Beta versions found: $versions"

  # Process each version
  while IFS= read -r version; do
    [[ -z "$version" ]] && continue

    pr_number=$(extract_pr_number "$version")
    if [[ -z "$pr_number" ]]; then
      echo "  ⚠️  Skipping $version - could not extract PR number"
      continue
    fi

    echo "  PR number: $pr_number"

    pr_status=$(check_pr_status "$pr_number")
    state=$(echo "$pr_status" | cut -d':' -f1)
    merged=$(echo "$pr_status" | cut -d':' -f2)

    echo "  PR status: $state"
    echo "  PR merged: $merged"

    if [[ "$state" == "closed" ]]; then
      status_text="merged"
      [[ "$merged" == "false" ]] && status_text="closed (not merged)"

      deprecation_message="This beta version is no longer valid. Use the latest version of the package."

      echo "  🗑️  Deprecating $version (PR #$pr_number $status_text)"

      echo "  Deprecation message: $deprecation_message"

      if ! npm_output=$(npm deprecate "$package_name@$version" "$deprecation_message" 2>&1); then
        echo "  ❌ Failed to deprecate $package_name@$version: $npm_output"
      fi
    else
      echo "  ⏭️  Skipping $package_name@$version (PR #$pr_number is $state)"
    fi

    sleep 0.1
  done <<< "$versions"
done

echo "✅ Beta package deprecation completed"