#!/bin/bash

# Script to setup branch protection rules for the next-roots repository
# This script uses GitHub CLI to configure branch protection rules

set -e

REPO_OWNER="svobik7"
REPO_NAME="next-roots"
BRANCH="master"

echo "Setting up branch protection rules for ${REPO_OWNER}/${REPO_NAME}..."

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://github.com/cli/cli#installation"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

echo "Configuring branch protection for '${BRANCH}' branch..."

# Enable branch protection with the following rules:
# - Require pull request reviews before merging
# - Require status checks to pass before merging 
# - Require branches to be up to date before merging
# - Restrict pushes that create matching branches
# - Allow administrators and GitHub Actions to bypass rules
gh api \
  --method PUT \
  "/repos/${REPO_OWNER}/${REPO_NAME}/branches/${BRANCH}/protection" \
  --field required_status_checks='{"strict":true,"contexts":["Test"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions='{"users":[],"teams":[],"apps":["github-actions"]}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "Branch protection rules have been configured successfully!"
echo ""
echo "The following rules are now active on the '${BRANCH}' branch:"
echo "✓ Pull requests are required for all changes"
echo "✓ At least 1 approving review is required"
echo "✓ Status checks must pass (Test job from CI/CD workflow)"
echo "✓ Branches must be up to date before merging"
echo "✓ Administrators can bypass rules (for emergency fixes)"
echo "✓ GitHub Actions can bypass rules (for semantic-release)"
echo "✓ Force pushes and branch deletions are disabled"
echo ""
echo "Note: semantic-release will continue to work as it runs with GitHub Actions permissions."