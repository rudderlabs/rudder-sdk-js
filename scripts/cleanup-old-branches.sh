#!/bin/bash

# Script to cleanup old branches that haven't been modified in the last 2 months
# Requires GitHub CLI (gh) to be installed and authenticated

set -e

# Default values
MONTHS_OLD=2
PROTECTED_BRANCHES="^(main|develop)$"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --months)
      MONTHS_OLD="$2"
      shift 2
      ;;
    --protected-branches)
      PROTECTED_BRANCHES="$2"
      shift 2
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
done

# Calculate the cutoff date (2 months ago)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS date command
  CUTOFF_DATE=$(date -v-${MONTHS_OLD}m +%Y-%m-%d)
else
  # GNU date command
  CUTOFF_DATE=$(date -d "${MONTHS_OLD} months ago" +%Y-%m-%d)
fi

echo "Starting branch cleanup process..."
echo "Cutoff date: ${CUTOFF_DATE}"
echo "Protected branches pattern: ${PROTECTED_BRANCHES}"

# Get all remote branches
BRANCHES=$(git branch -r | grep -v "HEAD" | sed 's/origin\///')

# Counter for deleted branches
DELETED_COUNT=0

for BRANCH in $BRANCHES; do
  # Skip protected branches
  if echo "$BRANCH" | grep -qE "$PROTECTED_BRANCHES"; then
    echo "Skipping protected branch: $BRANCH"
    continue
  fi

  # Get the last commit date for the branch
  LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=short origin/$BRANCH)

  # Skip if branch has open PRs
  if gh pr list --head "$BRANCH" --state open --json number | grep -q "number"; then
    echo "Skipping branch with open PR: $BRANCH"
    continue
  fi

  # Compare dates
  if [[ "$LAST_COMMIT_DATE" < "$CUTOFF_DATE" ]]; then
    echo "Deleting branch: $BRANCH (last commit: $LAST_COMMIT_DATE)"
    git push origin --delete "$BRANCH" || {
      echo "Failed to delete branch: $BRANCH"
      continue
    }
    ((DELETED_COUNT++))
  fi
done

echo "Branch cleanup completed."
echo "Total branches deleted: $DELETED_COUNT" 
