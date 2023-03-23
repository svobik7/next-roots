# next-roots

Tiny (just 1.9kb) next.js utility to handle i18n routing in the new app directory.

If you are looking for an i18n routing utility for the old pages directory check [next-roots](https://github.com/svobik7/next-roots) which is built on the same idea as the next-roots.

## 1. About next-roots

Roots routing mechanism depends on files routes generation rather than dynamic `[locale]` parent folder

### What is wrong with the [locale] approach?

The `[locale]` approach works well until you need to boost your SEO. While content translations work well with the `[locale]` in place the URL translations become cumbersome.

Right, there is this config called rewrites where you can set all possible URL translations and point them to proper destinations.

But that rubs out the benefits of file-based routing because all those rewrites must be checked in runtime before every request so that the proper file route can be targeted.

> This is usually true even for the origin locale which is reachable without any rewrites check.

And also all those rewrite rules can easily become unmanageable as the site grows and another site locale is added.

Another drawback of the `[locale]` approach is that your origin paths (the ones used for naming the actual files) are accessible (without additional redirect rules) on every locale.

> Your account route becomes available on '/en/account' as well as on `/es/account` or `/cs/account` without additional hijacking of next.config.js.

All the above break good SEO. So why don't just utilize the benefits of file-based routing itself and generate all localized routes in advance during build (or in dev) and free up the runtime?

## 2. Getting started

A complete example can be seen in the `example` directory.

### Installation

1. Add the package to your project dependencies

`yarn add next-roots`

2. Add generate script to your `package.json`

```json
{
  "scripts": {
    "dev": "yarn roots && next dev",
    "build": "yarn roots && next build"
  }
}
```

### Step-by-step guide

This file `roots.config.js` defines rules based on which the routes will be generated.

Let's take a simple example of existing English only based site structure like this:

```bash
├── app
│ └── (auth)
│   └── login
│   |  └── page.tsx
│   └── signup
│     └── page.tsx
│ └── account
│   └── profile
│     └── page.tsx
│     └── edit
│       └── page.tsx
│   └── page.tsx
│ └── blog
│   └── page.tsx
│   └── [articleId]
│     └── page.tsx

```

In such a structure we work with 7 pages and their URLs. Those URLs will be:

/login
/signup
/account
/account/profile
/account/profile/edit
/blog
/blog/[articleId]

Everything works like a charm while rainbows and unicorns are everywhere. But one day we decide to translate our pages and their URLs into another language let's say Spanish.

What we need to do is wrap our current structure into root locale which is in our case English = en. So we did that and our structure now looks like this:

```bash
├── app
│ └── en
│ 	└── (auth)
│   	└── login
│   	|  └── page.tsx
│   	└── signup
│     	└── page.tsx
│ 	└── account
│   	└── profile
│     	└── page.tsx
│     	└── edit
│      	 └── page.tsx
│   	└── page.tsx
│ 	└── blog
│   	└── page.tsx
│   	└── [articleId]
│     	└── page.tsx
```

No doubt our root URLs become localized immediately

/en/login
/en/signup
/en/account
/en/account/profile
/en/account/profile/edit
/en/blog
/en/blog/[articleId]

Now, this is the time to set some rules and generate a Spanish version of our routes.

Let's dive into roots.config.js and do something like this:

```js
module.exports = {
  rootDir: './app',
  locales: ['en', 'es'],
  routes: [
    {
      rootPath: 'account',
      routes: [{ locale: 'es', routePath: 'cuenta' }],
      children: [
        {
          rootPath: 'profile',
          routes: [
            // child route takes parent routePath as prefix => /es/cuenta/perfil
            { locale: 'es', routePath: 'perfil' },
          ],
          children: [
            {
              rootPath: 'edit',
              routes: [
                // grandchild route take all parents routePath as prefix => /es/cuenta/perfil/editar
                { locale: 'es', routePath: 'editar' },
              ],
            },
          ],
        },
      ],
    },
    {
      rootPath: '(auth)',
      children: [
        {
          rootPath: 'login',
          routes: [{ locale: 'es', routePath: 'acceso' }],
        },
        {
          rootPath: 'signup',
          routes: [{ locale: 'es', routePath: 'registrarse' }],
        },
      ],
    },
    {
      rootPath: 'blog',
      routes: [{ locale: 'es', routePath: 'revista' }],
      children: [
        {
          rootPath: 'articles',
          routes: [{ locale: 'es', routePath: 'articulos' }],
          children: [
            {
              rootPath: '[articleId]',
            },
          ],
        },
        {
          rootPath: 'authors',
          routes: [{ locale: 'es', routePath: 'autores' }],
          children: [
            {
              rootPath: '[authorId]',
            },
          ],
        },
      ],
    },
  ],
}
```

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
