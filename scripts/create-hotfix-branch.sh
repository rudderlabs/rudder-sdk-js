#!/bin/bash

# Exit on error
set -e

# Function to print error and exit
error() {
    echo "Error: $1"
    exit 1
}

# Function to print success message
success() {
    echo "✅ $1"
}

# Get branch name from argument
BRANCH_NAME="$1"
if [ -z "$BRANCH_NAME" ]; then
    error "Branch name is required"
fi

FULL_BRANCH_NAME="hotfix/$BRANCH_NAME"

# Validate branch name
# Check if branch name is empty or contains only whitespace
if [[ -z "${BRANCH_NAME// }" ]]; then
    error "Branch name ($FULL_BRANCH_NAME) cannot be empty or contain only whitespace"
fi

# Check if branch name contains invalid characters
if [[ ! "$BRANCH_NAME" =~ ^[a-zA-Z0-9._-]+$ ]]; then
    error "Branch name ($FULL_BRANCH_NAME) can only contain letters, numbers, dots, underscores, and hyphens"
fi

# Check if full branch name (including hotfix/ prefix) is too long
if [ ${#FULL_BRANCH_NAME} -gt 255 ]; then
    error "Full branch name ($FULL_BRANCH_NAME) is too long (maximum 255 characters)"
fi

# Check if branch already exists locally
if git show-ref --verify --quiet refs/heads/$FULL_BRANCH_NAME; then
    error "Branch ($FULL_BRANCH_NAME) already exists locally"
fi

# Create the branch locally
git checkout -b $FULL_BRANCH_NAME

# Ensure required environment variables for GitHub API are present
if [ -z "$GH_TOKEN" ]; then
    error "GH_TOKEN environment variable is required to create remote branch via GitHub API"
fi

# Determine repository slug (owner/repo)
REPO_SLUG="${REPO:-$GITHUB_REPOSITORY}"
if [ -z "$REPO_SLUG" ]; then
    # Fallback to parsing from git remote if not provided
    REMOTE_URL=$(git config --get remote.origin.url)
    REMOTE_URL=${REMOTE_URL#git@github.com:}
    REMOTE_URL=${REMOTE_URL#https://github.com/}
    REPO_SLUG=${REMOTE_URL%.git}
fi

if [ -z "$REPO_SLUG" ]; then
    error "Unable to determine repository slug for GitHub API"
fi

# Create or update the remote branch ref via GitHub API before any future commits
sha=$(git rev-parse HEAD)
if gh api "repos/${REPO_SLUG}/git/ref/heads/${FULL_BRANCH_NAME}" >/dev/null 2>&1; then
    gh api "repos/${REPO_SLUG}/git/refs/heads/${FULL_BRANCH_NAME}" \
      --method PATCH \
      -f "sha=${sha}" \
      -F "force=true"
else
    gh api repos/${REPO_SLUG}/git/refs \
      --method POST \
      -f "ref=refs/heads/${FULL_BRANCH_NAME}" \
      -f "sha=${sha}"
fi

# Get the repository URL for success message
REPO_URL="https://github.com/$REPO_SLUG"

success "Successfully created hotfix branch locally and ensured remote branch via GitHub API."
echo "Branch URL: $REPO_URL/tree/$FULL_BRANCH_NAME"
