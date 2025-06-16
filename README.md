[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Introduction

NextRoots is i18n routes generator for the new Next.js APP directory. It is an alternative to [officially recommended way](https://beta.nextjs.org/docs/guides/internationalization#routing-overview) of handling i18n routes in Next.js app.

The main idea behind is to generate all localized file-routes (slugs) in advance rather than putting everything into dynamic `[lang]` segment. Read more about [benefits of generated i18n routes](https://dev.to/svobik7/dont-use-dynamic-lang-segment-for-your-i18n-nextjs-routes-3k05).

Working demo site built on top of next-roots can be seen https://next-roots-svobik7.vercel.app

## Versions

Current version requires Next.js version to be at least 15 and used with APP router. If you use older versions of next see the list bellow

- [next-roots@latest](https://github.com/svobik7/next-roots/): Next.js >=15 (latest version)
- [next-roots@v3](https://github.com/svobik7/next-roots/tree/v3): Next.js >=10 && <=14
- [next-roots@v2](https://github.com/svobik7/next-roots/tree/v2): Next.js <10

## Table of contents

- [Getting started](#1-getting-started)
  - [Installation](#installation)
  - [Migrating routes](#migrating-routes)
  - [Configuring generator](#configuring-generator)
  - [Generating routes](#generating-routes)
  - [Translating slugs](#translating-slugs)
- [Router & Links](#2-router-and-links)
  - [GetHref](#gethref)
  - [GetLocaleFromHref](#getlocalefromhref)
  - [GetRouteFromHref](#getroutefromhref)
- [Additional props](#3-additional-props)
- [Translation files](#4-translation-files)
  - [Static translations](#static-translations)
  - [Dynamic translations](#dynamic-translations)
- [Config params](#5-config-params)
- [FAQ](#6-faq)

## 1. Getting started

Let's consider simple project structure that was built with English as a default locale and now needs to be localized for Czech audience.

```bash
├── app
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

The requirement is to have English localization served from `/` and Czech from `/cs/...`. The goal is to have following URLs:

1. `/`
1. `/cs`
1. `/about`
1. `/cs/o-nas`

> NextRoots supports both prefixed `/en` and un-prefixed `/` default locale.

### Installation

1. Add the package to your project dev dependencies

`yarn add -D next-roots`

2. (optional) Add generate script to your `package.json`

```json
{
  "scripts": {
    "roots": "yarn next-roots",
    "roots:watch": "yarn next-roots -w"
  }
}
```

### Migrating routes

As default Next.js reads routes from the folder called `app`. Using NextRoots and generating i18n routes requires you to move all your original routes into different folder called `roots` (name is customizable).

Run following command from your project root:

`mv ./app/ ./roots`

This would be the new area where you are going to store your original routes, write your code and make changes. From now on you wont be editing the files under the `app` folder. The `app` folder will stands only as a keeper of localized routes and forwards everything to the original ones.

The project structure now looks like:

```bash
├── roots
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

For RSC support see [this alternative configuration](#how-to-keep-original-routes-within-APP-folder-to-support-rsc) in FAQ section.

### Configuring generator

To tell NextRoots which locales we want to generate and where the roots files and app files can be found the `roots.config.js` file must be defined in project root.

`touch ./roots.config.js`

Simple configuration for English and Czech localizations can looks like this:

```js
const path = require('path')

module.exports = {
  originDir: path.resolve(__dirname, 'roots'),
  localizedDir: path.resolve(__dirname, 'app'),
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  prefixDefaultLocale: false, // serves "en" locale on / instead of /en
}
```

### Generating routes

Generation is initiated by running following command from project root.

`yarn next-roots`

IMPORTANT: Please be aware that `app` folder is wiped out during generation so be sure to have proper git or other backup in place.

The `app` folder is now re-generated and project structure is shaped like this:

```bash
├── app
│   ├── (en)
│   │   ├── about
│   │   │   └── page.js
│   │   └── page.js
│   ├── cs
│   │   ├── about
│   │   │   └── page.js
│   │   └── page.js
├── roots
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

Without any further steps the project ends up with URLs like that:

1. /
1. /about
1. /cs
1. /cs/about // this path needs to be translated

### Translating slugs

Every URL path (slug) or even segment of the URL path can be translated or left untranslated (depends on project needs). To translate URL segment we need to add `i18n.js` file into the original route directory.

> Note that i18n.js, i18n.mjs and i18n.ts files are supported. Each of those file are compiled during the generation by [esbuild](https://esbuild.github.io/).

```bash
├── app  // app folder stays untouched now
├── roots
│   ├── about
│   │   ├── i18n.js  // i18n.js file is added to the route that URL path needs to be translated
│   │   └── page.js
│   └── page.js
└── ...
```

Adding translated paths into `i18n.js` does the trick:

```js
module.exports.routeNames = [
  { locale: 'cs', path: 'o-nas' },
  // you don't need to specify default translation as long as it match the route folder name
  // { locale: 'en', path: 'about' },
]
```

> For describing translations in promise-like way see [Translation files](#4-translation-files)

Running `yarn roots` again will update `app` folder routes with translated paths. The project structure now looks like:

```bash
├── app
│   ├── (en)
│   │   ├── about
│   │   │   └── page.js
│   │   └── page.js
│   ├── cs
│   │   ├── o-nas  // translated URL path
│   │   │   └── page.js
│   │   └── page.js
├── roots
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

Finally our project is served on URLs that match perfectly the initial requirements. If you need to change your routes or translation do not forget to run `yarn roots` again.

## 2. Router and Links

Roots comes with a strongly typed Router class for creating links between your pages. Thanks to the generated schema and types you will be notified if the desired route exists or requires additional parameters.

> It is good practice to use Router only on the server side so that the list of all possible routes is not sent to the client.

### GetHref

Creates page href.

```ts
getHref(name: string, params?: object)
```

The first parameter called `name` is the original route URL path.

The second parameter is an object which can define desired `locale` or additional dynamic params.

Thanks to strong types you can import the `RouteName` type which includes all available route name strings.

```ts
import { Router, schema, RouteName } from 'next-roots'

const router = new Router(schema)

// for getting '/cs/o-nas'
router.getHref('/about', { locale: 'cs' })

// typescript will yield at you here as /not-existing is not a valid route
router.getHref('/not-existing', { locale: 'cs' })

const routeNameValid: RouteName = '/about'
const routeNameInvalid: RouteName = '/invalid' // yields TS error
```

For dynamic routes like `[articleId]`:

```ts
// for getting '/cs/1'
router.getHref('/[articleId]', { locale: 'cs', articleId: '1' })

// typescript will yield at you here because of the missing required parameter called articleId
router.getHref('/[articleId]', { locale: 'cs' })

const routeDynamic: RouteName = '/[articleId]'
const paramsDynamicValid: RouteParamsDynamic<typeof routeDynamic> = {
  locale: 'cs',
  articleId: '1',
}

// typescript will yield at you here because of the missing required parameter called articleId
const paramsDynamicInvalid: RouteParamsDynamic<typeof routeDynamic> = {
  locale: 'cs',
}
```

Passing the `locale` parameter is not required. If you do not pass any `locale` param then the current page locale will be automatically used.

```ts
// on "/cs" page it will creates "/cs/o-nas" href while on "/" (en) it will create "/about" href
router.getHref('/about')
```

This is possible thanks to Router internal static context value of current href. Whenever user visit a page Router will sets the internal page href and determine the locale from that. If you look at generated page routes you can see that:

```tsx
// in "app/cs/o-nas/page.js
export default function AboutPage(props: any) {
  Router.setPageHref('/cs/about')
  return <AboutPageOrigin {...props} locale="cs" />
}

// in "app/(en)/about/page.js
export default function AboutPage(props: any) {
  Router.setPageHref('/about')
  return <AboutPageOrigin {...props} locale="en" />
}
```

Even you are allowed to change this static context down in the code by calling `Router.setPageHref`. It is not recommended and can break the links.

You can also use `Router.getPageHref` anywhere in your component to get the current page href. Be aware that it is async function because in it has to await page params.

### GetHref in standalone mode

When running Next.js as a standalone server for example in EC2 or docker container, the Router functionality breaks.
Since Next.js is ran as a basic Node.js server in a standalone mode, the Router class is shared for each page generation. As so, the Router.getPageHref() can return wrong values in the generation phase of the page.
in that case you always need to pass current `locale` param to `Router.getHref` function and do not use `Router.getPageHref`. See more in https://github.com/svobik7/next-roots/issues/99.

### GetLocaleFromHref

Detects locale from given href and send it back. When no valid locale is found then the default one is retrieved.

```ts
// retrieves "en"
router.getLocaleFromHref('/about')

// retrieves "cs"
router.getLocaleFromHref('/cs/o-nas')

// retrieves "en"
router.getLocaleFromHref('/invalid-locale/o-nas')
```

### GetRouteFromHref

Detects route from given href and send it back. When no valid route is found then undefined is retrieved.

```ts
// retrieves "{ name: "/about", href: "/about" }"
router.getRouteFromHref('/about')

// retrieves "{ name: "/about", href: "/cs/o-nas" }"
router.getRouteFromHref('/cs/o-nas')

// retrieves "undefined"
router.getRouteFromHref('/invalid-locale/o-nas')
```

## 3. Additional props

NextRoots pushes some additional props to your components and functions to be able to read current page href or locale directly.

1. [Page](https://github.com/svobik7/next-roots/blob/master/examples/basic/src/routes/about/page.tsx#L22) - `pageHref`
2. [Layout](https://github.com/svobik7/next-roots/blob/master/examples/basic/src/features/common/components/Layout.tsx#L39) - `locale`
3. [generateMetadata](https://github.com/svobik7/next-roots/blob/master/examples/basic/src/routes/about/page.tsx#L43) - `pageHref`
4. [generateStaticParams](https://github.com/svobik7/next-roots/blob/master/examples/basic/src/routes/blogs/%5Bauthor%5D/page.tsx#L103) - `pageLocale`

Following types are available for props above and can be imported from next-roots:

1. PageProps
2. LayoutProps
3. GenerateLayoutMetadataProps
4. GeneratePageMetadataProps
5. GenerateStaticParamsProps

## 4. Translation files

Translation of URL paths is done in `i18n.js` or `i18n.ts` files by placing this file right next to the `page.js` of `page.ts` file and running `yarn roots`. There are two main ways how you can define the i18n file.

### Static translations

Useful when you want to specify the translation in the i18n file itself:

```ts
// if you use "i18n.mjs"
export const routeNames = [
  { locale: 'en', path: 'about' },
  { locale: 'cs', path: 'o-nas' },
]

// if you use "i18n.js"
module.exports.routeNames = [
  { locale: 'en', path: 'about' },
  { locale: 'cs', path: 'o-nas' },
]
```

### Dynamic translations

Useful when you want to store the translations in DB or other async storage:

```ts
async function generateRouteNames() {
  // "getTranslation" is custom async function that loads translated paths from DB
  const { enPath, csPath } = await getTranslations('/about')

  return [
    { locale: 'en', path: enPath },
    { locale: 'cs', path: csPath },
  ]
}

// needs to be exported in cjs syntax
module.exports.generateRouteNames = generateRouteNames
```

You don't need to specify translations for default locale. Routes inherit the path names from origin folders by default. If you specify the translation for default locale then it is used instead of origin folder name.

### Translation of intercepting routes

If you have intercepting route like `@modal/(.)blogs/[author]/[articleId]/page.js` with corresponding normal route equals to `blogs/[author]/[articleId]/page.js` and you already translated normal route by creating `blogs/i18n.js` file with following contents:

```js
module.exports.routeNames = [
  { locale: 'en', path: 'blogs' },
  { locale: 'cs', path: 'blogy' },
  { locale: 'es', path: 'blogs' },
]
```

then you need to translate even the intercepting route. Otherwise the intercepting route will be generated with untranslated path and interception will not work. I18n file placed in `@modal/(.)blogs/i18n.js` can be use for example above with following contents:

```js
module.exports.routeNames = [
  { locale: 'en', path: '(.)blogs' },
  { locale: 'cs', path: '(.)blogy' },
  { locale: 'es', path: '(.)blogs' },
]
```

### Skipping Translation

You can skip the generation of page, layout and/or template for a given local using the `skip` option.
If you want to skip all those files for a given local at a given path, just add `skip: true` for taht locale:

```js
module.exports.routeNames = [
  { locale: 'en', path: 'blogs' },
  { locale: 'cs', path: 'blogy' },
  { locale: 'es', path: 'blogs', skip: true },
]
```

If you want to skip just some files, you can do it by passing an object to `skip` ( `{ page?: boolean; layout?: boolean; template?: boolean }` ):

```js
module.exports.routeNames = [
  { locale: 'en', path: 'blogs' },
  { locale: 'cs', path: 'blogy', skip: { layout: true, template: true } },
  { locale: 'es', path: 'blogs', skip: { page: true } },
]
```


## 5. Config params

| name                  | type     | default                     | required | description                                                                                                                                       |
| --------------------- | -------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `originDir`           | string   | `./roots`                   | optional | absolute path to the origin un-translated routes                                                                                                  |
| `localizedDir`        | string   | `./app`                     | optional | absolute path to the localized routes. This is where next-roots saves generated routes.                                                           |
| `locales`             | string[] | `[]`                        | required | localization prefixes that will be used in URL                                                                                                    |
| `defaultLocale`       | string   | `''`                        | required | default locale that is specified in `locales`                                                                                                     |
| `prefixDefaultLocale` | boolean  | `true`                      | optional | when default locale = en then TRUE means it will be served from "/en" and FALSE means it will be served without prefix on /                       |
| `packageDir`          | string   | `./node_modules/next-roots` | optional | absolute path to the next-root package itself. Should be changed only when package is stored in different location than project root node_modules |
| `afterGenerate`       | function | `undefined`                 | optional | custom function that will be called after files generation is done (see)                                                                          |

### AfterGenerate callback

If you need to do custom actions after the generation is done you can use `afterGenerate` callback. This callback is called with following params:

```ts
type AfterGenerateCallback = (params: {
  config: Config
  origins: Origin[]
  rewrites: Rewrite[]
  routes: Route[]
  routerSchema: RouterSchema
}) => Promise<void>
```

## 6. FAQ

### Why are generated routes better than recommended `[lang]` approach?

The `[lang]` approach works well until you need to translate URL slugs. Read more about generated routes in https://dev.to/svobik7/dont-use-dynamic-lang-segment-for-your-i18n-nextjs-routes-3k05

### Can I use Router in client?

While it is not recommended it is still possible. In that case the whole schema needs to be send to client as well which increases bundle size. Read more about server components https://beta.nextjs.org/docs/rendering/server-and-client-components

### Changes in I18n files are not propagated

1. Did you run next-roots? If not run it again.
2. Did you try to remove .next folder? Sometimes next.js caches previous schema and you need to delete its cache.

### How to serve content from un-translated routes like "/robots.txt"?

If you need to serve a content from un-translated routes like `/robots.txt` or others you can easily achieve that by placing those files/routes directly into "app" folder and set `localizedDir` target to nested group route.

```bash
├── app
│   ├── (routes)  // translated routes will be generated within this folder
│   │   ├── en
│   │   └── cs
│   └── robots.txt
├── roots
│   ├── ...
│   └── page.js
└── ...
```

```js
// roots.config.js
module.exports = {
  // ...
  localizedDir: path.resolve(__dirname, 'app/(routes)',
}
```

### How to redirect users to their preferred language?

There are two recommended way how to achieve this:

1. By `[[...catchAll]]` route - see `examples/with-preferred-language-catchall` example
2. By custom `middleware.ts` - see `examples/with-preferred-language-middleware` example

### How to keep original routes within APP folder to support RSC?

👉 You do not need to do anything as Next.js treats your components as server components by default unless you tell it not to by "use client" directive.

### How to fix Next.js typechecks during build?

As next-roots package generates localised page.tsx within yourapp folder and passes down additional props (like locale) to your origin page.tsx it might trigger an error during Next.js typecheck if you place your origin files in the app folder.

This is false positive error as your origin page.tsx files are not real entry point (real pages). Real pages are generated by the package. Unfortunatelly Next.js typechecks every single file named page.tsx that is placed in the app folder. Even when placed in private folder like \_roots.

👉 Moving your roots folder outside of the app folder omits your origin page.tsx files from being typechecked during build.

### How to use next-roots with type=module in package.json?

You can create `roots.config.cjs` and run next-roots command like this `yarn next-roots -c ./roots.config.cjs --esm`. For more details see `examples/basic-esm`.
