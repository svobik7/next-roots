# Quick Setup Guide for PR Rules

This guide provides step-by-step instructions for setting up branch protection rules for the next-roots repository.

## Option 1: Automated Setup (Recommended)

### Using GitHub CLI (Branch Protection Rules)
```bash
# Ensure you have GitHub CLI installed and authenticated
gh auth login

# Run the setup script
./.github/scripts/setup-branch-protection.sh
```

### Using GitHub CLI (Repository Rulesets - Modern Approach)
```bash
# Ensure you have GitHub CLI installed and authenticated  
gh auth login

# Run the ruleset setup script
./.github/scripts/setup-rulesets.sh
```

## Option 2: Manual Setup via GitHub UI

1. Go to [Repository Settings](https://github.com/svobik7/next-roots/settings)
2. Click **"Branches"** in the left sidebar
3. Click **"Add rule"**
4. Set **Branch name pattern** to: `master`
5. Enable these options:
   - ✅ **Require a pull request before merging**
     - Set **Required number of approvals** to: `1`
     - ✅ **Dismiss stale reviews when new commits are pushed**
   - ✅ **Require status checks to pass before merging**
     - ✅ **Require branches to be up to date before merging**
     - Add status check: `Test`
   - ✅ **Restrict pushes that create matching branches**
   - ❌ **Do not require administrator review** (allow admin bypass)
   - ✅ **Include administrators** (for emergency access)
6. Click **"Create"**

## Verification

After setup, verify the rules are working:

```bash
# Check current protection status
gh api /repos/svobik7/next-roots/branches/master/protection

# Or view in browser
open https://github.com/svobik7/next-roots/settings/branches
```

## What These Rules Do

- **Block direct pushes** to `master` branch
- **Require pull requests** for all changes
- **Require at least 1 review** before merging
- **Require CI tests to pass** before merging
- **Allow GitHub Actions to bypass** (for semantic-release)
- **Allow repository admins to bypass** (for emergencies)

## Testing the Setup

1. Create a test branch: `git checkout -b test-pr-rules`
2. Make a small change and commit it
3. Push the branch: `git push origin test-pr-rules`
4. Open a PR to `master`
5. Verify that:
   - Merge is blocked until CI passes
   - At least 1 review is required
   - Once approved and CI passes, merge is allowed

## Troubleshooting

### Semantic Release Not Working
If semantic-release stops working after enabling rules:

1. Check that the Release workflow has `contents: write` permission
2. Verify GitHub Actions are in the bypass list
3. Review the workflow logs for permission errors

### Status Checks Not Appearing
If the "Test" status check isn't showing up:

1. Ensure the CI workflow job name is exactly "Test"
2. Check that the workflow runs on pull requests
3. Verify the workflow has completed at least once

### Emergency Access
If you need to bypass rules temporarily:

1. **Admin override**: Repository admins can force merge
2. **Temporary disable**: Disable protection rules temporarily
3. **Direct admin push**: Admins can push directly if needed

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Repository Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Semantic Release with Branch Protection](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration#github-actions)