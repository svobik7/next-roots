## [4.0.3](https://github.com/svobik7/next-roots/compare/v4.0.2...v4.0.3) (2024-12-30)


### Bug Fixes

* **pkg:** removes yarn from postinstall ([4a678fe](https://github.com/svobik7/next-roots/commit/4a678feacc0820b2e4b95b82483e3b04844db0e3)), closes [#336](https://github.com/svobik7/next-roots/issues/336)

## [4.0.2](https://github.com/svobik7/next-roots/compare/v4.0.1...v4.0.2) (2024-12-17)


### Bug Fixes

* **templates:** removed unused compileHref from page template and fixed generateViewport function ([ebc5e0f](https://github.com/svobik7/next-roots/commit/ebc5e0fa5c5d4c2c060aba5542f8dac5bd90ba11)), closes [#320](https://github.com/svobik7/next-roots/issues/320)

## [4.0.1](https://github.com/svobik7/next-roots/compare/v4.0.0...v4.0.1) (2024-12-02)


### Bug Fixes

* **deps:** bump cross-spawn from 7.0.3 to 7.0.6 ([697b683](https://github.com/svobik7/next-roots/commit/697b6839dd76da6b6bbc204e9798bc039e7cc768))

# [4.0.0](https://github.com/svobik7/next-roots/compare/v3.11.3...v4.0.0) (2024-12-02)


### Bug Fixes

* **deps:** adds support for path-to-regexp v8 ([5f21593](https://github.com/svobik7/next-roots/commit/5f215935084b0297dbf9d61429eb3cc43cfa06bc)), closes [#294](https://github.com/svobik7/next-roots/issues/294)
* **deps:** fixed package missing deps ([f6ae2fa](https://github.com/svobik7/next-roots/commit/f6ae2fa77fcede5ca462de285d24a51c92983c6d))
* **deps:** switched to jest because latest version of vitest did break dts-bundle-generator ([537cecb](https://github.com/svobik7/next-roots/commit/537cecbfca940fbea6ad6d08f9527a3af560a315))
* **example:** fixed example basic build step ([2e8c25e](https://github.com/svobik7/next-roots/commit/2e8c25ebf203199cca99f9515ed6d319a861a90b))
* **examples-basic:** remove code that is dependent of the package itself from i18n file ([d83d26f](https://github.com/svobik7/next-roots/commit/d83d26fe1255729ccaa486c86d618e262d547085))
* **i18n:** updated compilation on i18.ts files ([b09ee9b](https://github.com/svobik7/next-roots/commit/b09ee9bf90e790e0f3c7e46a6b439ff4ada11648))


### Features

* add support for Next.js 15 async params ([1c76871](https://github.com/svobik7/next-roots/commit/1c768710e39e73152c6b7b42cd1d01e9a08dab74)), closes [#302](https://github.com/svobik7/next-roots/issues/302)


### BREAKING CHANGES

* StaticRouter.getPageHref() returns a promised string instead of a string
* Function generateMetadata and generateViewPort will be passed an async getPageHref function and locale as a string instead of a compiled pageHref
* **i18n:** export async function generateRouteNames is no longer supported. Must be defined as
module.exports.generateRouteNames = generateRouteNames
* **deps:** Catch all params like [...slug] must now be provided as array of strings e.g.
["first", "second"]. Passing them as a string like "first/second" is not supported anymore

## [3.11.3](https://github.com/svobik7/next-roots/compare/v3.11.2...v3.11.3) (2024-09-27)


### Bug Fixes

* **deps:** bump rollup from 3.29.4 to 3.29.5 ([27ac13a](https://github.com/svobik7/next-roots/commit/27ac13a386bdd9cae8fac30b9e64962bb122ecad))

## [3.11.2](https://github.com/svobik7/next-roots/compare/v3.11.1...v3.11.2) (2024-09-21)


### Bug Fixes

* **deps:** bump path-to-regexp from 6.2.2 to 6.3.0 ([62e755b](https://github.com/svobik7/next-roots/commit/62e755b0918351f15c945398b9b3b50733e959be))

## [3.11.1](https://github.com/svobik7/next-roots/compare/v3.11.0...v3.11.1) (2024-09-21)


### Bug Fixes

* **deps:** bump esbuild from 0.23.0 to 0.23.1 ([b2a9767](https://github.com/svobik7/next-roots/commit/b2a9767dcfc3cb012785f9588243d76355ecf538))
* **deps:** bump micromatch from 4.0.7 to 4.0.8 ([a30ccbc](https://github.com/svobik7/next-roots/commit/a30ccbcbbcbd60a628d319d837a908108ab5b587))

# [3.11.0](https://github.com/svobik7/next-roots/compare/v3.10.2...v3.11.0) (2024-08-14)


### Features

* **templates:** add support for viewport object and generateViewport function ([b0ce7df](https://github.com/svobik7/next-roots/commit/b0ce7dfbe78c674d01406131a1ee3af72054cde6)), closes [#271](https://github.com/svobik7/next-roots/issues/271)

## [3.10.2](https://github.com/svobik7/next-roots/compare/v3.10.1...v3.10.2) (2024-07-31)


### Bug Fixes

* **deps:** moved required deps to package dependencies ([14de3a4](https://github.com/svobik7/next-roots/commit/14de3a43babaed9e85dc79be0949c1bbf97bd0ee))

## [3.10.1](https://github.com/svobik7/next-roots/compare/v3.10.0...v3.10.1) (2024-07-24)


### Bug Fixes

* **router:** fix the sort function of the router ([9dc055c](https://github.com/svobik7/next-roots/commit/9dc055cd8b30bd4245422d2b0c3b8e8a88bc658e)), closes [#248](https://github.com/svobik7/next-roots/issues/248)

# [3.10.0](https://github.com/svobik7/next-roots/compare/v3.9.0...v3.10.0) (2024-07-24)


### Features

* **templates:** support: passing the received params to the origin `generateStaticParams` function ([56cad89](https://github.com/svobik7/next-roots/commit/56cad89588bf5779c0b36254dd62d46d994f1cb5)), closes [#242](https://github.com/svobik7/next-roots/issues/242)

# [3.9.0](https://github.com/svobik7/next-roots/compare/v3.8.0...v3.9.0) (2024-07-21)


### Features

* **templates:** include generateStaticParams Function in Generated layout.tsx ([070153c](https://github.com/svobik7/next-roots/commit/070153caa352d54dcf37b1983e356c1c8e8c6738)), closes [#245](https://github.com/svobik7/next-roots/issues/245)

# [3.8.0](https://github.com/svobik7/next-roots/compare/v3.7.0...v3.8.0) (2024-07-19)


### Bug Fixes

* **basic-esm:** added esm option to script ([0e0419c](https://github.com/svobik7/next-roots/commit/0e0419c10f73c6f296946b4545ddef0a460347f3))
* **examples:** update basic-esm to the latest next ([499ab83](https://github.com/svobik7/next-roots/commit/499ab83fbae7d148023485fb05a46691b42ac742))


### Features

* **esm:** allowed roots.config.cjs ([a107f9d](https://github.com/svobik7/next-roots/commit/a107f9d5ad32f69933dafc4155320a6fbe527a4f))

# [3.7.0](https://github.com/svobik7/next-roots/compare/v3.6.1...v3.7.0) (2024-05-15)


### Bug Fixes

* **cli:** fixed localisation of page.js ([07f477f](https://github.com/svobik7/next-roots/commit/07f477fb88e12bfad38b48151f3d8ece570a8828)), closes [#222](https://github.com/svobik7/next-roots/issues/222)


### Features

* **cli:** added number of generated routes into logs ([0a75138](https://github.com/svobik7/next-roots/commit/0a75138688434504b13b8a293a343df38ddd88be))

## [3.6.1](https://github.com/svobik7/next-roots/compare/v3.6.0...v3.6.1) (2024-05-06)


### Bug Fixes

* **deps:** bump tar from 6.2.0 to 6.2.1 ([eb6f8cc](https://github.com/svobik7/next-roots/commit/eb6f8cc0815e7944337e47f77e755062145c522c))

# [3.6.0](https://github.com/svobik7/next-roots/compare/v3.5.1...v3.6.0) (2024-03-04)


### Features

* **routes:** added support for catch all non-optional routes ([57d800e](https://github.com/svobik7/next-roots/commit/57d800ecca77d37fd61c98a0d2a7df340bbf8bb3))

## [3.5.1](https://github.com/svobik7/next-roots/compare/v3.5.0...v3.5.1) (2024-02-26)


### Bug Fixes

* **deps:** bump ip from 2.0.0 to 2.0.1 ([e383c3f](https://github.com/svobik7/next-roots/commit/e383c3f9840cccc71ffca477e590dca13f074852))

# [3.5.0](https://github.com/svobik7/next-roots/compare/v3.4.1...v3.5.0) (2024-02-26)


### Bug Fixes

* **formathref:** fiexd replacing slashes ([d62de76](https://github.com/svobik7/next-roots/commit/d62de76b4eedf18860baeb2503671fa4ae5a9572))


### Features

* **routes:** add support for optional catch all routes ([1330cf4](https://github.com/svobik7/next-roots/commit/1330cf4f7bcf6deb18d8454c620837d7fc625612))

## [3.4.1](https://github.com/svobik7/next-roots/compare/v3.4.0...v3.4.1) (2023-10-28)

### Bug Fixes

- **deps:** bump @babel/traverse from 7.21.3 to 7.23.2 ([11f04ba](https://github.com/svobik7/next-roots/commit/11f04baa74295764b81d41f2f9befb38527b9a4d))

# [3.4.0](https://github.com/svobik7/next-roots/compare/v3.3.0...v3.4.0) (2023-10-07)

### Features

- **cli:** added watch option ang cfg option to cli ([7e26a29](https://github.com/svobik7/next-roots/commit/7e26a2963f3f48690e44e28e634d2c36e85a8e98))

# [3.3.0](https://github.com/svobik7/next-roots/compare/v3.2.2...v3.3.0) (2023-09-20)

### Features

- **cli:** added afterGenerate callback to cli params ([3348f4e](https://github.com/svobik7/next-roots/commit/3348f4e2ef8866417ed396b809d9ae86d6cec58b))

## [3.2.2](https://github.com/svobik7/next-roots/compare/v3.2.1...v3.2.2) (2023-09-19)

### Bug Fixes

- **ci:** added commitizen, semantic-release, release workflow ([e0db0f3](https://github.com/svobik7/next-roots/commit/e0db0f3d199c5e726e8e11c1a597fafa5e85daca))
