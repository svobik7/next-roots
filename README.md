# next-roots

NextRoots is package for generating i18n file-based routes for the new Next.js APP directory. It leverages server-side concept of APP folder. That means router code lives always on the server and should not be populated to the client. Generating i18n routes is alternative to well known (and suggested) option of having one dynamic `[locale]` folder sitting as a root above all other routes. It makes the sites SEO friendly and does not bother client with routing maps and toher additional bundles.

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

The requirement is to have English localization served from `/` and Czech from `/cs/...` (btw NextRoots supports both prefixed and uprefixed default locale). The goal is to have following URLs:

For index page:

1. /
1. /cs

For about page:

1. /about
1. /cs/o-nas

### Installation

1. Add the package to your project dependencies

`yarn add next-roots`

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

> Note that i18n.js, i18n.mjs and i18n.ts files are supported. If i18n.ts is used it is compiled during the runtime by (esbuild)[https://esbuild.github.io/].

```bash
├── app               // app folder stays untouched now
├── roots,
│   ├── about
│   │   ├── i18n.js   // i18n.js file is added to the route which URL path needs to be translated
│   │   └── page.js
│   └── page.js
└── ...
```

That `i18n.js` can be shaped in three differen ways file contents:

```js
module.exports.routeNames = [
  { locale: 'cs', path: 'o-nas' },
  // { locale: 'en', path: 'about' },   // you dont need to specify default translation as long as it match the route folder name
]
```

Running `yarn roots` again will update `app` folder routes. The project structure now looks like:

```bash
├── app
│   ├── (en)
│   │   ├── about
│   │   │   └── page.js
│   │   └── page.js
│   ├── cs
│   │   ├── o-nas    // translated URL path
│   │   │   └── page.js
│   │   └── page.js
├── roots,
│   ├── about
│   │   └── page.js
│   └── page.js
└── ...
```

Finally our project is server on URLs that are generated during the build time and match perfectly the initial requirements:

1. /
2. /about
3. /cs
4. /cs/o-nas

## 2. Router and Links

## 3. Ways of translating URL paths

## 4. Config params

> NOTE: generating the rules structure automatically is in progress. Once in place, you will run something like `yarn roots add es`, and the rules will be enriched with `{ locale: 'es', routePath: '@missingTranslation' }`

Saving that schema and running `yarn roots` will create the whole Spanish file structure so that we end up having the following URLs:

/en/login
/en/signup
/en/account
/en/account/profile
/en/account/profile/edit
/en/blog
/en/blog/[articleId]
/es/accesso
/en/registrarse
/en/cuenta
/en/cuenta/perfil
/en/cuenta/perfil/editar
/en/revista
/en/revista/[articleId]

That was neat! No rewrites and no redirects are needed and your SEO stays healthy.

Wait but what is inside those Spanish pages? Good question. Next-roots expects that you use your app directory only as the routing engine. That means that inside your page.tsx or layout.tsx files you should import the business logic from outside the app folder.

```tsx
// for static routes like app/account/page.tsx
export { AccountPage as default } from 'src/features/account/AccountPage'

// or for dynamic routes like app/blog/[articleId].tsx
import { ArticlePage } from 'src/features/blog/ArticlePage'

export default function Article({ params }) {
  return <ArticlePage id={params.articleId} />
}
```

> Roots expects that the app directory is used only for routing purposes and every business logic is imported from another (src) folder.

Now it is time to run `yarn dev` and test your i18n routes.

## 3. Creating page links using Router

Roots comes with a strongly typed Router class for creating links between your pages. Thanks to the generated schema and types you will be notified if the desired page exists or requires additional parameters.

> It is good practice to use Router only on the server side so that list of all possible routes does not need to be sent to the client.

For creating links you should use the `getHref(name: string, params?: object)` method of the roots router.

```tsx
import { Router, schema } from 'next-roots'
const router = Router(schema)

// for getting '/es/cuenta'
router.getHref('/account', { locale: 'es' })

// for getting '/es/revista/1'
router.getHref('/blog/[articleId]', { locale: 'es', articleId: '1' })

// typescript will yield at you here as /not-existing is not a valid route
router.getHref('/not-existing', { locale: 'es' })

// typescript will yield at you here because of the missing required parameter called articleId
router.getHref('/blog/[articleId]', { locale: 'es' })
```

Wait, what are those "/account" or "/blog/[articleId]" string parameters?

Smart questing. Remember our original site structure? Those strings are called route names and are derived from the original structure of our app without any locale prefixes.

Thanks to next-roots strong types you can import the `RouteName` type which includes all available route name strings.

Aha, got it. But what about those dynamic routes like the one with [articleId]?

The same rule applies for a dynamic route but an additional check of required parameters is done. To be able to create a link for a dynamic route you need to pass all those dynamic parameters (the ones in square brackets).

But hey, do I need to always pass the locale parameter? What if I want to create the link for the current locale?

That would be annoying if we had to pass the locale always, right? Roots router comes with this `setLocale` method by which you can change the current locale.

```tsx
import { Router, schema } from 'next-roots'
const router = Router(schema)
router.setLocale('en')

// now you can get '/en/account' without passing the locale param
router.getHref('/account')

// but still able to get '/es/cuenta' by explicitly passing the locale param
router.getHref('/account', { locale: 'es' })
```

If the `setLocale` method is not called then the default locale is used always. The first locale that occurs in roots Schema is considered the default.

The logic behind detecting the current locale is out of the scope of this library and depends on your needs. The recommended approach can be seen in [Setting Router Locale](#setting-router-locale)

## 4. Setting current locale

As Roots does not offer any ready-to-use logic for detecting current or preferred client locale and passing it down to Router, there is one recommended way how to do that by utilizing next.js middleware and headers.

```tsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // your custom locale handler should come here
  // - like getting stored locale from client cookies
  // - or parsing browser accept-language headers
  // - or redirecting from not localized paths

  // for simplicity we will just get locale from pathname
  const [, locale] = request.nextUrl.pathname.split('/').at(0) || ''

  return NextResponse.next({
    request: {
      ...request,
      headers: new Headers({
        NEXT_ROOTS_LOCALE: locale,
      }),
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

Later in your application, you can pick that locale and Roots router accordingly.

```tsx
// src/router.ts
import { Router, schema } from 'next-roots'
import { headers } from 'next/headers'

const router = new Router(schema)

export function getRouter() {
  const locale = headers().get('NEXT_ROOTS_LOCALE') || router.getLocale()
  router.setLocale(locale)

  return router
}
```

### What is wrong with the [locale] approach?

The `[locale]` approach works well until you need to boost your SEO. While content translations work well with the `[locale]` the URL translations become cumbersome.

Rig§ht, there is this config called rewrites where you can set all possible URL translations and point them to proper destinations.

But that rubs out the benefits of file-based routing because all those rewrites must be checked in runtime before every request so that the proper file route can be targeted.

> This is usually true even for the origin locale which is reachable without any rewrites check.

And also all those rewrite rules can easily become unmanageable as the site grows and another site locale is added.

Another drawback of the `[locale]` approach is that your origin paths (the ones used for naming the actual files) are accessible (without additional redirect rules) on every locale.

> Your account route becomes available on '/en/account' as well as on `/es/account` or `/cs/account` without additional hijacking of next.config.js.

All the above break good SEO. So why don't just utilize the benefits of file-based routing itself and generate all localized routes in advance during build (or in dev) and free up the runtime?
