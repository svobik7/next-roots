// General configuration: https://semantic-release.gitbook.io/semantic-release/usage/configuration
// For maintaining old major versions (1.x, 2.x): https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches
module.exports = {
  repositoryUrl: 'https://github.com/svobik7/next-roots',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/changelog',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
}
