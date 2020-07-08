# next-roots

Next.js utility to generate internationalized (i18n) pages according to custom roots rules and with **no need to use Vercel dev server, Rewrites neither Routes**

## 1. About next-roots

This package is highly inspired by [next-translate](https://github.com/vinissimus/next-translate#readme).
It solves some additional features like `static routing schema`, `url tokenizing`, `page meta` and more ... and is completely **TypeScript friendly!**

Similar as `next-translate` this package holds all pages implementation in separate directory. We call it `roots`. Required `pages` directory is then created during `build` time.

## 2. Getting started

Complete example can be seen in `example` directory.

### Installation

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

3. Create [roots.config.js](#config-options) in your project root
4. Add [RootsContext](#rootscontext) to your `_app`
5. Run `yarn dev`

### How to use it

Default behavior is to have `roots.config.js` file placed in your project root folder (next to your package.json file).

This file defines roots schema for your pages and config params for pages builder.

Basic configuration can look like:

```js
module.exports = {
  locales: ['en', 'cs'],
  defaultLocale: 'cs',
  defaultSuffix: '.htm',
  schemas: [
    {
      root: '*',
      metaData: { title: 'Next Roots', background: 'grey' },
    },
    {
      root: 'home',
      pages: [{ locale: '*', path: 'index', alias: '/', suffix: '' }],
    },
    {
      root: 'auth/signup',
      pages: [
        { locale: 'en', path: 'auth/signup-:token' },
        { locale: 'cs', path: 'overeni/registrace-:token' },
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

> NOTE: all following examples are based on above config.

Before build your project structure needs to look like this:

```bash
.
├── roots
│   ├── home.tsx
│   ├── dynamic.tsx
│   └── auth
│       └── signup.tsx
```

After build your project structure will look like this:

```bash
.
├── roots
│   ├── home.tsx
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
  locales: ['en', 'cs'],
  defaultLocale: 'cs',
  rules: [
    {
      key: 'en:home',
      href: '/en',
    },
    {
      key: 'cs:home',
      href: '/cs',
    },
    {
      key: 'en:auth/signup',
      href: '/en/auth-signup-p1.htm',
    },
    {
      key: 'cs:auth/signup',
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

## 3. Configuration

| Name          | Default                                         | Description                                                     |
| ------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| schemas       | []                                              | builder rules for generating pages                              |
| locales       | []                                              | all allowed locales which will be generated                     |
| defaultLocale | ''                                              | locale which will be used as default when no locale is detected |
| defaultSuffix | ''                                              | default page suffix which will be added to page name            |
| dirRoot       | `roots`                                         | source folder with all roots files                              |
| dirPages      | `pages`                                         | target folder where pages will be generated into                |
| staticRoots   | `['api', '_app', '_document', '_error', '404']` | static roots which will be generated outside locales folders    |
| extRoots      | `['.tsx']`                                      | suffix of all roots files                                       |

## 4. Schemas

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

### Pages

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

### Meta data

Each schema rule can define custom meta data. Type of `metaData` param must be `Record<string, ReactText>`

```js
metaData: { background: 'magenta' },
```

This data can be used to change layout, css, background images and more based on current router path.

### Catch All Rule

Catch all rule is used only for setting default meta data values which will be then merged with router path specific meta data.

```js
{
  root: '*',
  metaData: { title: 'Next Roots', background: 'grey' },
},
{
  root: 'home',
  metaData: { title: 'Home Page' },
  // ...
},
```

Router meta data for `home` will be `{ title: 'Home Page', background: 'grey' }`

## 5. Hooks

Next-roots package provides handy hooks to read and manipulate its context values.

### useRoots

Provides main roots values according to current router path.

- `locales: string[]` - array of all active locales
- `defaultLocale: string` - string of default locale value
- `currentLocale: string` - router path locale
- `currentRule: Roots.SchemaRule | undefined` - object of current containing current rule `key`, `href` and optionally `alias`

Example usage:

```js
import { useRoots } from 'next-roots/context'

// router path = /en/auth/signup-p1.htm
const roots = useRoots()

roots.locales // ['en', 'cs', ...]
roots.defaultLocale // 'cs'
roots.currentLocale // 'en'
roots.currentRoot // 'auth/signup'
roots.currentRule // { key: 'en:auth/signup', href: '/en/auth/signup' }
```

### useRootLink

Provides api to create localized links based on `roots.schema.js` rules.

Example usage:

```js
import { useRootLink } from 'next-roots/link'

const link = useRootLink()

// 1. generates href with current locale using root name (currentLocale = en)
link.href('auth/signup')
// result: /en/auth/signup-p1.htm`

// 2. generates href with custom locale using root name and explicit locale option
link.href('auth/signup', { locale: 'cs' })
// result: `/cs/overeni/registrace-p1.htm`

// 3. generate href with custom locale using rule key
link.href('cs:auth/signup')
// result: '/cs/overeni/registrace-p1.htm'

// 4. generate href with custom locale using current rule key and explicit locale option (currentRule = cs:auth/signup)
link.href('cs:auth/signup', { locale: 'en' })
// result: '/en/auth-signup-p1.htm'

// 5. generate href for dynamic page
link.href('dynamic', { locale: 'en' })
// result: '/en/[...slug]'

// 6. generate href for home page using shortcut
link.href('/', { locale: 'en' })
// result: '/en'
```

> NOTE: There is predefined home page shortcut `/` in roots package. So you do not need to use `home` if you don't want to.

The same options work for link alias plus dynamic params can be explicitly pushed:

```js
// same options as for link.href() plus:

const link = useRootLink()

// 1. generate alias for dynamic page
link.as('dynamic', { locale: 'en', params: { slug: 'some-slug' } })
// result: '/en/some-slug'
```

### useRootMeta

Provides api to read static meta data attached to router paths and specified in roots schema.

Example usage:

```js
// example values when current root is 'dynamic'
const meta = useRootMeta()

// 1. read all meta data for current router path (data is merged with general meta data - schema.meta.key === '*')
meta.data()
// result: { title: 'Next Roots', background: 'magenta' }

// 2. read all meta data when using strict param (data is not merged with general meta data - schema.meta.key === '*')
meta.data('*', { strict: true })
// result: { background: 'magenta' }

// 3. cherry pick meta data using custom selector
meta.data('background')
// result: 'magenta'
```

## 6. Components

Next-roots package provides ready-to-use components with injected roots context.

### RootsContext

Main roots context component which holds current values according to router pathname changes.

This component is required to use in your app so that other components can consume current roots context.

Recommended usage:

```js
// in your _app.tsx
import RootsContext, { parsePathname } from 'next-roots/context'
import { AppProps } from 'next/app'
import schema from 'roots.schema'

function MyApp({ Component, pageProps, router }: AppProps) {
  // parse current roots values from router pathname
  const { locale, root, rule } = parsePathname(router.pathname, schema)

  return (
    <RootsContext.Provider
      value={{
        currentRule: rule,
        currentRoot: root,
        currentLocale: locale || schema.defaultLocale,
        defaultLocale: schema.defaultLocale,
        locales: schema.locales,
        rules: schema.rules,
        meta: schema.meta,
      }}
    >
      <Component {...pageProps} />
    </RootsContext.Provider>
  )
}

export default MyApp
```

### RootLink

Extends native `link/next` with roots context. Generates links based on roots schema when rule is found otherwise link generation is handled by native link .

Works similar as `useRootLink` as this hook is used under the hood of `RootLink` component.

Example usage:

```js
import RootLink from 'next-roots/link'

// 1. Using with current locale and root name (currentLocale = en)
<RootLink href="auth/signup">
  <a>...</a>
</RootLink>
// result <a href="/en/auth/signup-p1.htm">...</a>

// 2. Using with custom locale and root name
<RootLink href="auth/signup" locale="cs">
  <a>...</a>
</RootLink>
// result <a href="/cs/overeni/registrace-p1.htm">...</a>

// 3. Using with rule key
<RootLink href="cs:auth/signup">
  <a>...</a>
</RootLink>
// result <a href="/cs/overeni/registrace-p1.htm">...</a>

// 4. Using with rule key and custom locale
<RootLink href="cs:auth/signup" locale="en">
  <a>...</a>
</RootLink>
// result <a href="/en/auth/signup-p1.htm">...</a>

// 5. Using with dynamic root (e.g. page = [...slug])
<RootLink href="dynamic" locale="en" params={{slug: 'some-slug'}}>
  <a>...</a>
</RootLink>
// result <a href="/en/auth/some-slug">...</a>

// 6. Using home page shortcut (currentLocale = en)
<RootLink href="/">
  <a>...</a>
</RootLink>
// result <a href="/en">...</a>

```

### RootDebug

> COMMING SOON

## 7. Utils

### parsePathname

Handy util used to parse current router path into following roots context values:

- `locale: string`
- `root: string`
- `rule: string`

This is alway used in your `_app` to provide values to `RootsContext.Provider`

Example usage:

```js
import { parsePathname } from 'next-roots/context'

// router instance can be  obtained from useRouter hook
// or directly from _app props
const { locale, root, rule } = parsePathname(router.pathname)
```

## 8. Example

Example usage with lightweight schema can be found in example folder

- `cd example`
- `yarn install`
- `yarn dev`
