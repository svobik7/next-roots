# Default prefix with preferred language

> This example is currently locked on v3 but should be the same on v4.

This example demonstrates how to use `next-roots` library with enabled default locale prefix and custom solution to redirect users to their preferred language when accessing url without locale prefix.

# Prerequisites

1. You need to set `prefixDefaultLocale` to `true` in your `roots.config.js` file.
2. You need to set `localizedDir` to `path.resolve(__dirname, 'app/(localized)')` so that all your app routes are generated under (localized) directory.
3. You need to update your `.gitignore` file so that only `app/(localized)` folder is ignored. This is needed because we want to keep our custom `[[...catchAll]]` route in our app directory.

# Results

1. When accessing root url (`/`) your users will be redirected to their preferred browser language (see `app/[[...catchAll]]/page.tsx`).
1. When accessing url without locale prefix (`/some-slug`) your users will be redirected to the localized version of that page according to their preferred browser language (see `app/[[...catchAll]]/page.tsx`).
