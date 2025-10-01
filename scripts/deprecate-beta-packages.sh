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
if [[ -z "${GITHUB_TOKEN:-}" || -z "${NPM_TOKEN:-}" ]]; then
  echo "❌ Missing required environment variables: GITHUB_TOKEN, NPM_TOKEN"
  exit 1
fi

# Setup NPM authentication
npm set //registry.npmjs.org/:_authToken="$NPM_TOKEN"

# Extract PR number from beta version
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
  response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$repo_owner/$repo_name/pulls/$pr_number")

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
  versions=$(npm view "$package_name" versions --json 2>/dev/null | jq -r '.[] | select(contains("-beta.pr."))' || true)

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

      if ! npm deprecate "$package_name@$version" "$deprecation_message" 2>&1; then
        echo "  ❌ Failed to deprecate $version"
      fi
    else
      echo "  ⏭️  Skipping $version (PR #$pr_number is $state)"
    fi

    sleep 0.1
  done <<< "$versions"
done

echo "✅ Beta package deprecation completed"