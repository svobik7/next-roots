# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2020-07-17

### BREAKING CHANGES

- `parsePathname` is no longer used to detect current roots context values so it has been removed from `next-root/context`
- meta data are now specified in same was as pages so any page level metaData in `roots.config.js` are ignored
- `rewriteMetaData` is no longer needed as meta data are injected directly to pages so it has been removed from `next-roots/utils`

### NEW BEHAVIOR

- rules are now directly injected into pages during build time - https://github.com/svobik7/next-roots/issues/29
- only rules with same locale or same root are injected to pages - https://github.com/svobik7/next-roots/issues/31
- `currentMeta` is now available in roots context
- meta data are now merged and injected directly into pages during build time - https://github.com/svobik7/next-roots/issues/28
- prototype schemas are now supported - https://github.com/svobik7/next-roots/issues/31

See simple steps required to migrate from 1.0.x to 2.0.0 in README.md](https://github.com/svobik7/next-roots/tree/issues/schema-separate#10-migrating-from-1x-to-2x)

## [1.0.6] - 2020-07-09

- Fixed issue with creating link using `rule key` only - see [README.md](https://github.com/svobik7/next-roots#userootlink)

## [1.0.5] - 2020-07-09

- Fixed issues to keep package stable

### Added

- RootsConsole component for debugging

## [0.0.2] - 2020-05-26

- RollUp fix

### Changed

- Changed rollup typescript plugin so that declarations can be emitted in single file

## [0.0.1] - 2020-05-26

- Initial publish

### Added

- Possibility to rewrite pages with static slugs
- Possibility to define static roots
- Possibility to have multiple locales
