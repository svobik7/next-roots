import acceptLanguage from 'accept-language'
import { NextRequest, NextResponse } from 'next/server'
import { Router, schema } from 'next-roots'

export function middleware(request: NextRequest) {
  // Check if this is a new session
  const cookie = request.cookies.get('visitor')

  // If the user has an existing cookie, skip redirect
  if (cookie?.value) {
    return NextResponse.next()
  }

  // Get user language from acceptLanguage
  acceptLanguage.languages(schema.locales)
  const userLanguage = acceptLanguage.get(
    request.headers.get('accept-language')
  )

  const router = new Router(schema)
  const fullPath = request.nextUrl.pathname
  const currentLocale = router.getLocaleFromHref(fullPath)

  // If the user is already on the preferred locale, skip redirect
  if (currentLocale === userLanguage || userLanguage === null) {
    return NextResponse.next()
  }

  // Get the route that the user is trying to access
  const matchedRoute = router.getRouteFromHref(fullPath)
  if (!matchedRoute) {
    return NextResponse.next()
  }

  // Get the route href for the user's language
  const path = removeLocalePrefix(fullPath)
  const dynamicSegments = extractDynamicSegments(path, matchedRoute.name)
  const routeHref = router.getHref(matchedRoute.name as any, {
    locale: userLanguage,
    ...dynamicSegments,
  })

  // Redirect the user to the correct locale
  const response = NextResponse.redirect(
    new URL(routeHref, request.nextUrl.origin)
  )
  response.cookies.set({
    name: 'visitor',
    value: 'true',
    path: '/',
  })

  return response
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

// Utility functions ===================================================
function extractDynamicSegments(url: string, routeName: string) {
  const dynamicSegments: Record<string, string> = {}
  const schemaParts = routeName.split('/')
  const urlParts = url.split('/')
  const dynamicRegex = /^\[\w+\]$/
  for (let i = 0; i < schemaParts.length; i++) {
    if (schemaParts[i].match(dynamicRegex)) {
      const paramName = schemaParts[i].slice(1, -1)
      dynamicSegments[paramName] = urlParts[i]
    }
  }
  return dynamicSegments
}

function removeLocalePrefix(url: string, locales = schema.locales) {
  const urlParts = url.split('/')
  if (locales.includes(urlParts[1])) {
    urlParts.splice(1, 1)
    return urlParts.join('/')
  }
  return url
}
