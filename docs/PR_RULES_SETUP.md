# Pull Request Rules Setup

This document explains how to set up branch protection rules for the `next-roots` repository to ensure that all changes to the main branch (`master`) go through pull requests while allowing `semantic-release` to continue working during automated releases.

## Overview

The PR rules implementation includes:

1. **Require pull requests** for all changes to the `master` branch
2. **Block merging** until all status checks pass
3. **Allow semantic-release** to bypass restrictions during automated releases
4. **Require at least one approving review** before merging
5. **Keep branches up to date** before merging

## Quick Setup (Automated)

Run the provided script to automatically configure branch protection rules:

```bash
# Make sure you have GitHub CLI installed and authenticated
gh auth login

# Run the setup script
./.github/scripts/setup-branch-protection.sh
```

## Manual Setup (GitHub UI)

If you prefer to configure the rules manually through the GitHub web interface:

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Branches**
4. Click **Add rule** button
5. Configure the following settings:

### Branch Name Pattern
- **Branch name pattern**: `master`

### Protect matching branches
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1
  - ✅ **Dismiss stale reviews when new commits are pushed**
  - ❌ **Require review from code owners** (optional, can be enabled if you have CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - **Status checks that are required**: 
    - `Test` (from the CI/CD workflow)

- ❌ **Restrict pushes that create matching branches** (leave unchecked to allow GitHub Actions)

- ❌ **Restrict pushes to matching branches** (leave unchecked to allow GitHub Actions)

- ❌ **Force push** (prevent force pushes)

- ❌ **Deletions** (prevent branch deletion)

6. Click **Create** to save the rule

## How It Works with Semantic Release

### The Challenge
- We want to block direct pushes to `master` from developers
- But `semantic-release` needs to push version updates and releases to `master`

### The Solution
The branch protection rules are configured to:

1. **Allow GitHub Actions** to bypass the pull request requirement
2. **Require status checks** but semantic-release runs after tests pass
3. **Allow administrators** to bypass rules for emergency situations

### Semantic Release Workflow
When a release is triggered:

1. Tests run and pass on the `master` branch
2. `semantic-release` generates version, changelog, and release notes  
3. `semantic-release` commits changes directly to `master` (bypassing PR requirement)
4. Release is published to npm and GitHub

This works because:
- The release workflow runs with GitHub Actions permissions
- GitHub Actions are explicitly allowed to bypass branch protection rules
- The workflow only runs after all tests have passed

## Status Checks

The current CI/CD workflow (`.github/workflows/ci-cd.yml`) includes a `Test` job that:

- Runs on all pull requests to any branch
- Builds the package
- Runs tests
- Validates examples

This `Test` job is configured as a required status check, meaning:
- PRs cannot be merged until tests pass
- Developers will see a clear indication when checks are failing
- The merge button will be disabled until all checks are green

## Verification

After setting up the rules, you can verify they're working by:

1. **Check branch protection status**:
   ```bash
   gh api /repos/svobik7/next-roots/branches/master/protection
   ```

2. **Test with a dummy PR**:
   - Create a new branch
   - Make a small change
   - Open a PR to `master`
   - Verify that merge is blocked until reviews and checks pass

3. **Test semantic-release**:
   - Ensure the release workflow can still commit to `master`
   - Check that releases continue to work normally

## Troubleshooting

### Semantic Release Issues
If semantic-release stops working after enabling branch protection:

1. **Check GitHub Actions permissions**: Ensure the release workflow has `contents: write` permission
2. **Verify bypass settings**: Make sure GitHub Actions are allowed to bypass branch protection
3. **Review token permissions**: The `GITHUB_TOKEN` should have sufficient permissions

### Status Check Issues
If status checks are not appearing:

1. **Check workflow names**: Ensure the status check names match exactly
2. **Verify workflow triggers**: Make sure workflows run on pull requests
3. **Review permissions**: Ensure workflows have necessary permissions

### Emergency Access
If you need to bypass rules in an emergency:

1. **Administrator bypass**: Repository administrators can override protection rules
2. **Temporary disable**: Temporarily disable branch protection if needed
3. **Force push alternatives**: Use administrator privileges instead of force pushing

## Best Practices

1. **Regular Reviews**: Regularly review and update branch protection settings
2. **Team Communication**: Ensure all team members understand the new workflow
3. **Status Monitoring**: Monitor failed status checks and address issues promptly
4. **Release Testing**: Test the release process in a staging environment first

## Support

If you encounter issues with the PR rules setup:

1. Check the GitHub documentation on [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
2. Review the [semantic-release documentation](https://semantic-release.gitbook.io/) for release-specific issues
3. Consult the repository's existing issues and discussions