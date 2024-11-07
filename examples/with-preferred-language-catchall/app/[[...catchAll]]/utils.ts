import acceptLanguage from 'accept-language'
import { type Route, type Router, type RouterSchema } from 'next-roots'
import { headers } from 'next/headers'
import { pathToRegexp } from 'path-to-regexp'

export function findLocalizedHrefFactory(router: Router, schema: RouterSchema) {
  return (url: string) => {
    const getRouteMatch = getRouteMatchFactory(router, schema)

    const routeMatch = getRouteMatch(url)

    if (!routeMatch) {
      return undefined
    }

    const userLanguage = getUserPreferredLanguage(
      schema.locales,
      schema.defaultLocale
    )

    return router.getHref(routeMatch.route.name as any, {
      locale: userLanguage,
      ...routeMatch.params,
    })
  }
}

type RouteWithParams = { route: Route; params: Record<string, string> }
type RouteMatch = RouteWithParams | undefined

function getRouteMatchFactory(router: Router, schema: RouterSchema) {
  return (url: string): RouteMatch => {
    const pathWithoutLocale = removeLocalePrefix(url, schema.locales)

    const matchedRoute = schema.locales.reduce(
      (match, locale) => {
        if (match) {
          return match
        }

        const localizedPath = `/${locale}/${pathWithoutLocale}`
        const route = router.getRouteFromHref(localizedPath)

        if (!route) {
          return undefined
        }

        return {
          route,
          params: extractNamedParams(route.href, localizedPath),
        }
      },
      undefined as undefined | RouteMatch
    )

    return matchedRoute
  }
}

function extractNamedParams(
  pathPattern: string,
  href: string
): Record<string, string> {
  const { keys = [], regexp } = pathToRegexp(pathPattern)
  const match = regexp.exec(href)

  if (!match) {
    return {}
  }

  const params: Record<string, string> = {}
  keys.forEach((key, index) => {
    params[key.name] = match[index + 1]
  })

  return params
}

function removeLocalePrefix(url: string, locales: string[]) {
  const urlParts = url.split('/')
  if (locales.includes(urlParts[1])) {
    urlParts.splice(1, 1)
    return urlParts.join('/')
  }
  return url
}

function getUserPreferredLanguage(locales: string[], defaultLocale: string) {
  const headersList = headers()
  acceptLanguage.languages(locales)

  return acceptLanguage.get(headersList.get('accept-language')) ?? defaultLocale
}
