# Usign a middleware to redirect new users to their preferred language

> This example is currently locked on v3 but should be the same on v4.

This example demonstrates how to use a middleware and `next-roots` to redirect users arriving on your site to their preferred language when accessing an url form another locale.

This suits better when `prefixDefaultLocale` is set to `false` in `roots.config.js` file. If you rather use prefixed locales for all languages then we recommend you to check this example : [with-preferred-language-catchall](../with-preferred-language-catchall).

# Prerequisites

- You need to add a [middleware file](https://nextjs.org/docs/app/building-your-application/routing/middleware) (`middleware.ts` or `.js`) at the root of your project.

- You can refer to our middleware file [here](./middleware.ts) as a good starting point.

  - In this exemple we use the package [accept-language](https://www.npmjs.com/package/accept-language) to parse the `Accept-Language` header sent by the browser. You can use any other package or write your own parser.

# Results

When a user requests a page on your site, the middleware performs the following actions:

1. It checks if the user already has a session cookie set. If so, the middleware takes no further action.

2. If the user does not have a session cookie set, the middleware parses the `Accept-Language` header sent by the browser to determine the user's preferred language. If the user's preferred language is available on your site, the middleware will attempt to redirect the user to the same page but in their preferred language. Otherwise, it will use default language.

3. Utilizing the `next-roots` router and configuration, the middleware will identify the requested route and generate the correct href for the new language.

4. Upon finding a route match, the middleware redirects the user to the new language version of the page and sets a session cookie to prevent further redirections. This step is crucial in enabling users to explicitly navigate to another language version of the pages without being automatically redirected.

# Example

Let's suppose we have a route configuration like this:

```
/blog/[author]/[article]
```

Now imagine a new English-speaking user navigates to the following url `/cs/blogy/mark-brown/jak-byt-lepsim-clovekem` (Czech version of `/blog/mark-brown/how-to-be-a-better-person`).

Since it's the first time this user arrives on our website for this session, they have no cookie set. The middleware will parse the `Accept-Language` header sent by the browser and find that the user's preferred language is `en`.

Because the user is currently navigating a Czech version of the page, the middleware will redirect the user to the English version of the page.

In this example, our middleware would redirect the user to: `/en/blog/mark-brown/jak-byt-lepsim-clovekem`. As you can see, dynamic parameters are not modified. It is the page itself (`/app/blog/[autor]/[article]/page.tsx`) that handle the redirection to the localized slug (`how-to-be-a-better-person`).

Depending on your implementation it could be possible to redirect the user directly to the localized version of the URL from the middleware, if your data model allows a mapping between slugs in different languages.
