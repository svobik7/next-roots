# next-roots

Next.js utility to generate i18n pages according to custom roots rules.

## ABOUT

This package is highly inspired by [next-translate](https://github.com/vinissimus/next-translate#readme).

It solves some additional features like static routing table, url tokenizing, static & dynamic routing in easy way, page meta, static... and is completely **TypeScript friendly!**

Similar as `next-translate` this package holds all pages implementation in separate directory called `roots`. Next.js `pages` directory is then created during `build` or before `dev` under localized directories.

## GETTING STARTED

Complete example can be seen in `example` directory.

### INSTALLATION

1. Add package to your project dependencies

   `yarn add next-roots`

2. Hook rewrite builder script in your `package.json`

   ```json
   {
     "scripts": {
       "dev": "yarn next-roots && next dev",
       "build": "yarn next-roots && next build"
     }
   }
   ```

3. Define your custom roots (see [Configuration](#configuration))
4. Run `yarn dev`

### BASIC USAGE

Default behavior is to have `roots.config.js` file placed in your project root folder (next to your package.json file).

This file defines rewrite rules for your pages and config params for rewrite builder.

Basic configuration can look like:

```js
module.exports = {
  locales: ['en', 'cs'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  dirRoots: 'roots',
  dirPages: 'pages',
  schemas: [
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
  ],
}
```

Before rewrite job is done _(for configuration like above)_ your project structure needs to be like this:

```bash
.
├── roots
│   ├── index.tsx
│   └── auth
│       └── signup.tsx
```

After rewrite job is done _(for configuration like above)_ your project structure will look like this:

```bash
.
├── roots
│   ├── index.tsx
│   └── auth
│       └── signup.tsx
├── pages
│   └── en
│       └── index.tsx
│       └── auth
│         └── signup-p1.htm.tsx
│   └── cs
│       └── index.tsx
│       └── auth
│         └── registrace-p1.htm.tsx
```

Also rewrite table file `roots.schema.js` will be generated and placed to project root folder. This file contains routing map for each page in your roots configuration.

```js
module.exports = [
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
]
```

> NOTE: If rewrite table rule does not contain `as` param it means that it is same as `href`.
