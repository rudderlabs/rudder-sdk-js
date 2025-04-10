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

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/$FULL_BRANCH_NAME; then
    error "Branch ($FULL_BRANCH_NAME) already exists"
fi

# Create the branch
git checkout -b $FULL_BRANCH_NAME

# Push the branch and handle potential errors
if ! git push origin $FULL_BRANCH_NAME; then
    error "Failed to push branch ($FULL_BRANCH_NAME) to remote. Please check your permissions and try again."
fi

# Verify the branch exists remotely
if ! git ls-remote --heads origin $FULL_BRANCH_NAME | grep -q $FULL_BRANCH_NAME; then
    error "Branch ($FULL_BRANCH_NAME) was not pushed to remote successfully"
fi

# Get the repository URL
REPO_URL=$(git config --get remote.origin.url)
REPO_URL=${REPO_URL#git@github.com:}
REPO_URL=${REPO_URL%.git}

success "Successfully created hotfix branch!"
echo "Branch URL: https://github.com/$REPO_URL/tree/$FULL_BRANCH_NAME" 
