# next-roots

NextRoots is package for generating i18n file-based routes for the new Next.js APP directory. It leverages server-side concept of APP folder. That means router code lives always on the server and should not be populated to the client. Generating i18n routes is alternative to well known (and suggested) option of having one dynamic `[lang]` folder sitting as a root above all other routes. It makes the sites SEO friendly and does not bother client with routing maps and toher additional bundles.

> If you are using old Next.js pages directory check [next-roots@v2](https://github.com/svobik7/next-roots/tree/v2).

Bellow we are going to cover localization of simple site containing just two routes. Check out the `example` folder to see more real world example of translating blog site.

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

1. Add the package to your project dependencies

`yarn add next-roots esbuild --dev`

2. Add generate script to your `package.json`

```json
{
  "scripts": {
    "roots": "yarn next-roots"
  }
}
```

### Migrate routes to the roots directory

As default Next.js reads routes from the folder called `app`. Using NextRoots and generating i18n routes requires you to move all your current routes into different folder called `roots` by default (name is customizable). Run following command from your project root:

`mv ./app/ ./roots`

This would be the new area where you are going to store your original routes, write your code and make changes. From now on you wont be editing the files under the `app` folder. The `app` folder will stands only as a keeper of localized routes and forwards everything to original routes.

The project structure now looks like:

```bash
├── roots
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

### Setting roots config

To tell NextRoots which locales we want to generate and where the roots files and app files can be found the `roots.config.js` file must to be defined in project root.

`touch ./roots.config.js`

Simple configuration for English and Spanish localization can looks like this:

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

### Generate localized routes

Generation is initiated by running `yarn next-roots` or just `yarn roots` in our case (we added it to our package.json scripts) from the project root folder. The `app` folder was generated and project structer is now shaped like this:

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
├── roots,
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

Without any further steps the project would ended up with URLs like that:

1. /
1. /about
1. /cs
1. /cs/about // this path needs to be translated

### Translating URL paths

Every URL path or even segment of the URL path can be translated or left untranslated (depends on project needs). To translate URL segment we need to add `i18n.js` file into the route directory in our original routes.

> Note that i18n.js, i18n.mjs and i18n.ts files are supported. If `i18n.ts` is used then it is compiled during the runtime by [esbuild](https://esbuild.github.io/).

```bash
├── app               // app folder stays untouched now
├── roots,
│   ├── about
│   │   ├── i18n.js   // i18n.js file is added to the route that URL path needs to be translated
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

> For describing translations in promise-like way see [Ways of translating URL paths](#ways-of-translating-url-paths)

Running `yarn roots` again will update `app` folder routes with translated paths. The project structure now looks like:

```bash
├── app
│   ├── (en)
│   │   ├── about
│   │   │   └── page.js
│   │   └── page.js
│   ├── cs
│   │   ├── o-nas           // translated URL path
│   │   │   └── page.js
│   │   └── page.js
├── roots,
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

Finally our project is server on URLs that are generated during the build time and match perfectly the initial requirements. If you need to change your routes or translation do not forget to run `yarn roots` again.

## 2. Router and Links

Roots comes with a strongly typed Router class for creating links between your pages. Thanks to the generated schema and types you will be notified if the desired page exists or requires additional parameters.

> It is good practice to use Router only on the server side so that the list of all possible routes does not need to be sent to the client.

### GetHref

For creating links you should use the `getHref(name: string, params?: object)` method of the router. The first parameter called `name` is the original route folder name. The second parameter is an object which can define desired `locale` or additional dynamic params. Thanks to next-roots strong types you can import the `RouteName` type which includes all available route name strings.

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

For dynamic routes let's say we have route called `[articleId]`. In case we want to link that page we can utilize the getHref method in following way:

```ts
// for getting '/cs/revista/1'
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

Passing the `locale` parameter is not required. If you do not pass any `locale` param then the current one will be automatically used.

```ts
// on "/cs" page it will creates "/cs/o-nas" href while on "/" (en) it will create "/about" href
router.getHref('/about')
```

This is possible thanks to Router internal static context value of current href. Whenever user visit a page Router will sets the the internal page href and determine the locale from that. If you look at generated page routes you can see that:

```tsx
// in "app/cs/o-nas/page.js
export default function AboutPage(props: any) {
  Router.setPageHref('/cs/about')
  return <AboutPageOrigin {...props} pageHref={Router.getPageHref()} />
}

// in "app/(en)/about/page.js
export default function AboutPage(props: any) {
  Router.setPageHref('/about')
  return <AboutPageOrigin {...props} pageHref={Router.getPageHref()} />
}
```

Even you are allowed to change this static context down in the code by calling `Router.setPageHref` it is not recommended and can break the links.

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

## 3. Ways of translating URL paths

Translation of URL paths is done in `i18n.js` of `i18n.ts` files by placing this file right next to the `page.js` of `page.ts` file and running `yarn roots`. There are two main ways how you can define the i18n file.

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
export async function generateRouteNames() {
  // "getTranslation" is custom async function that loads translated paths from DB
  const { enPath, csPath } = await getTranslations('/about')

  return [
    { locale: 'en', path: enPath },
    { locale: 'cs', path: csPath },
  ]
}
```

You don't need to specify translations for default locale. Routes inherit the path names from origin folders by default. If you specify the translation for default locale then it is used instead of origin folder name.

## 4. Config params

| name                  | type     | default                     | required | description                                                                                                                                       |
| --------------------- | -------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `originDir`           | string   | `./roots`                   | optional | absolute path to the origin un-translated routes                                                                                                  |
| `localizedDir`        | string   | `./app`                     | optional | absolute path to the localized routes. This is where next-roots saves generated routes.                                                           |
| `locales`             | string[] | `[]`                        | required | localization prefixes that will be used in URL                                                                                                    |
| `defaultLocale`       | string   | `''`                        | required | default locale that is specified in `locales`                                                                                                     |
| `prefixDefaultLocale` | boolean  | `true`                      | optional | when default locale = en then TRUE means it will be served from "/en" and FALSE means it will be served without prefix on /                       |
| `packageDir`          | string   | `./node_modules/next-roots` | optional | absolute path to the next-root package itself. Should be changed only when package is stored in different location than project root node_modules |

## 5. FAQ

### Why generated routes are better than recommended `[lang]` approach?

The `[lang]` approach works well until you need to boost your SEO. While content translations work well with the `[lang]` the URL translations become cumbersome. Read more about generated routes in https://dev.to/svobik7/dont-use-dynamic-lang-segment-for-your-i18n-nextjs-routes-1k6j-temp-slug-8759660

### Can I use Router in client?

While it is not recommended it is still possible. In that case the whole schema needs to be send to client as well which increases bundle size. Read more about server components https://beta.nextjs.org/docs/rendering/server-and-client-components
