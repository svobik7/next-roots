#!/bin/bash

# Script to setup repository rulesets for the next-roots repository
# This script uses GitHub CLI to configure repository rulesets (modern approach)

set -e

REPO_OWNER="svobik7"
REPO_NAME="next-roots"
RULESET_FILE=".github/rulesets/branch-protection.json"

echo "Setting up repository ruleset for ${REPO_OWNER}/${REPO_NAME}..."

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

# Check if ruleset file exists
if [ ! -f "$RULESET_FILE" ]; then
    echo "Error: Ruleset file '$RULESET_FILE' not found"
    exit 1
fi

echo "Creating repository ruleset from '$RULESET_FILE'..."

# Create the ruleset using GitHub CLI
gh api \
  --method POST \
  "/repos/${REPO_OWNER}/${REPO_NAME}/rulesets" \
  --input "$RULESET_FILE"

echo "Repository ruleset has been created successfully!"
echo ""
echo "The following rules are now active:"
echo "✓ Pull requests are required for changes to 'master' branch"
echo "✓ At least 1 approving review is required"
echo "✓ Status checks must pass ('Test' job from CI/CD workflow)"
echo "✓ Branches must be up to date before merging"
echo "✓ Force pushes and branch deletions are prevented"
echo "✓ GitHub Actions and repository administrators can bypass rules"
echo ""
echo "Note: semantic-release will continue to work as GitHub Actions can bypass the rules."

# List all rulesets to confirm
echo ""
echo "Current repository rulesets:"
gh api "/repos/${REPO_OWNER}/${REPO_NAME}/rulesets" --jq '.[] | {id: .id, name: .name, enforcement: .enforcement}'