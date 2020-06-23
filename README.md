# next-roots

Next.js utility to generate internationalized (i18n) pages according to custom roots rules and with **no need to use Vercel dev server, Rewrites neither Routes**

## ABOUT

This package is highly inspired by [next-translate](https://github.com/vinissimus/next-translate#readme).
It solves some additional features like `static routing schema`, `url tokenizing`, `page meta` and more ... and is completely **TypeScript friendly!**

Similar as `next-translate` this package holds all pages implementation in separate directory. We call it `roots`. Required `pages` directory is then created during `build` time.

## GETTING STARTED

Complete example can be seen in `example` directory.

### INSTALLATION

1. Add package to your project dependencies

   `yarn add next-roots`

2. Add pages builder script to your `package.json`

   ```json
   {
     "scripts": {
       "dev": "yarn next-roots && next dev",
       "build": "yarn next-roots && next build"
     }
   }
   ```

3. create [roots.config.js](#config-options)
4. Add [RootsContext](#context) to your `_app`
5. Run `yarn dev`

### BASIC USAGE

Default behavior is to have `roots.config.js` file placed in your project root folder (next to your package.json file).

This file defines roots schema for your pages and config params for pages builder.

Basic configuration can look like:

```js
module.exports = {
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  schemas: [
    {
      root: '*',
      metaData: { title: 'Next Roots', background: 'grey' },
    },
    {
      root: 'index',
      pages: [{ locale: '*', path: 'index', alias: '/', suffix: '' }],
    },
    {
      root: 'auth/signup',
      pages: [
        { locale: 'en', path: 'auth/signup-:token' },
        { locale: 'cs', path: 'auth/registrace-:token' },
      ],
      params: { token: 'p1' },
    },
    {
      root: 'dynamic',
      pages: [{ locale: '*', path: '[...slug]', suffix: '' }],
      params: { token: 'p1' },
      metaData: { background: 'magenta' },
    },
  ],
}
```

Before build job for mentioned example is done your project structure needs to look like this:

```bash
.
├── roots
│   ├── index.tsx
│   ├── dynamic.tsx
│   └── auth
│       └── signup.tsx
```

After build job is done your project structure will look like this:

```bash
.
├── roots
│   ├── index.tsx
│   └── auth
│       └── signup.tsx
├── pages
│   └── en
│       └── index.tsx
│       └── [...slug].tsx
│       └── auth
│         └── signup-p1.htm.tsx
│   └── cs
│       └── index.tsx
│       └── [...slug].tsx
│       └── auth
│         └── registrace-p1.htm.tsx
```

Static schema file `roots.schema.js` will be also generated and placed to project root folder. This file contains routing map for each page in your roots configuration and other static data. This file is minified because it is used in runtime.

```js
module.exports = {
  defaultLocale: 'en',
  locales: ['en', 'cs'],
  rules: [
    {
      key: 'en/index',
      href: '/en',
    },
    {
      key: 'cs/index',
      href: '/cs',
    },
    {
      key: 'en/account/signup',
      href: '/en/auth-signup-p1.htm',
    },
    {
      key: 'cs/account/signup',
      href: '/cs/ucet-registrace-p1.htm',
    },
    { key: 'en:dynamic', href: '/en/[...slug]' },
    { key: 'cs:dynamic', href: '/cs/[...slug]' },
  ],
  meta: [
    { key: '*', data: { title: 'Next Roots', background: 'grey' } },
    { key: 'dynamic', data: { background: 'magenta' } },
  ],
}
```

> NOTE: If some rule does not contain `as` it means that it is same as `href`.

## CONFIG OPTIONS

| Name           | Default                                         | Description                                                     |
| -------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| schemas        | []                                              | builder rules for generating pages                              |
| locales        | []                                              | all allowed locales which will be generated                     |
| defaultLocales | ''                                              | locale which will be used as default when no locale is detected |
| defaultSuffix  | ''                                              | default page suffix which will be added to page name            |
| dirRoot        | `roots`                                         | source folder with all roots files                              |
| dirPages       | `pages`                                         | target folder where pages will be generated into                |
| staticRoots    | `['api', '_app', '_document', '_error', '404']` | static roots which will be generated outside locales folders    |
| extRoots       | `['.tsx']`                                      | suffix of all roots files                                       |

## SCHEMAS

Each schema rule represent one root - page combination. Here you defines routing map for your localized pages.

```js
{
  root: 'auth/signup',
  pages: [
    { locale: 'en', path: 'auth/signup-:token' },
    { locale: 'cs', path: 'auth/registrace-:token' },
  ],
  params: { token: 'p1' },
}
```

- `root` - root file name for builder.
- `pages` - localized aliases for current root
- `params` - params which will be used as replace value in page `path` or `alias` during build
- `metaData` - custom params which can be used during runtime based on router path and `useRootMeta` hook

### SCHEMAS PAGES

Each schema rule must define pages array. Otherwise it must be defined as [catch all rule](#schemas-catch-all-rule).

```js
pages: [{
  locale: '*',
  path: 'index',
  alias: '/',
  suffix: ''
}],
```

- `locale` - locale folder name (use `*` to generate same schema for all locales)
- `path` - page file name which also be used for routing as link `href`
- `alias` - page alias which will be used for routing as link `as`
- `suffix` - custom suffix which will be appended to `path` param

### SCHEMAS META DATA

Each schema rule can define custom meta data. Type of `metaData` param must be `Record<string, ReactText>`

```js
metaData: { background: 'magenta' },
```

This data can be used to change layout, css, background images and more based on current router path.

### SCHEMAS CATCH ALL RULE

Catch all rule is used only for setting default meta data values which will be then merged with router path specific meta data.

```js
{
  root: '*',
  metaData: { title: 'Next Roots', background: 'grey' },
},
{
  root: 'index',
  metaData: { title: 'Index Page' },
  // ...
},
```

Router meta data for `index` will be `{ title: 'Index Page', background: 'grey' }`

### SCHEMAS CATCH ALL RULE

Catch all rule is used only for setting default meta data values which will be then merged with router path specific meta data.

```js
{
  root: '*',
  metaData: { title: 'Next Roots', background: 'grey' },
},
{
  root: 'index',
  metaData: { title: 'Index Page' },
  // ...
},
```

Router meta data for `index` will be `{ title: 'Index Page', background: 'grey' }`

## useRoots

## RootLink

## useRootLink

## useRootMeta
