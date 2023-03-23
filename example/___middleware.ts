import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { NextRequest, NextResponse } from 'next/server'
import acceptLanguageParser from 'accept-language-parser'

const ROOT_URL = '/'

const COOKIE_LOCALE_NAME = 'NEXT_ROOTS_LOCALE'
const HEADER_LOCALE_NAME = 'NEXT_ROOTS_LOCALE'

const i18n = {
  locales: ['cs', 'en', 'es'],
  defaultLocale: 'en',
}

function resolveLocale(
  requestHeaders: Headers,
  requestCookies: RequestCookies,
  pathname: string
) {
  let locale

  // Prio 1: Use route prefix
  if (pathname) {
    const segments = pathname.split('/')
    if (segments.length > 1) {
      const segment = segments[1]
      if (i18n.locales.includes(segment)) {
        locale = segment
      }
    }
  }

  // Prio 2: Use existing cookie
  if (!locale && requestCookies) {
    if (requestCookies.has(COOKIE_LOCALE_NAME)) {
      locale = requestCookies.get(COOKIE_LOCALE_NAME)?.value
    }
  }

  // Prio 3: Use accept-language header
  if (!locale && requestHeaders) {
    locale =
      acceptLanguageParser.pick(
        i18n.locales,
        requestHeaders.get('accept-language') || i18n.defaultLocale
      ) || i18n.defaultLocale
  }

  // Prio 4: Use default locale
  if (!locale) {
    locale = i18n.defaultLocale
  }

  return locale
}

// TODO: setting headers makes full reload in dev during HMR = e.g. when changing tailwindcss
export function middleware(request: NextRequest) {
  // Ideally we could use the `headers()` and `cookies()` API here
  // as well, but they are currently not available in middleware.
  const locale = resolveLocale(
    request.headers,
    request.cookies,
    request.nextUrl.pathname
  )

  const isRoot = request.nextUrl.pathname === ROOT_URL
  const isChangingLocale =
    request.cookies.get(COOKIE_LOCALE_NAME)?.value !== locale

  let response
  if (isRoot) {
    response = NextResponse.redirect(new URL(ROOT_URL + locale, request.url))
  } else {
    let responseInit

    // Only apply a header if absolutely necessary
    // as this causes full page reloads
    if (isChangingLocale) {
      request.headers.set(HEADER_LOCALE_NAME, locale)

      responseInit = {
        request: {
          headers: request.headers,
        },
      }
    }

    response = NextResponse.next(responseInit)
  }

  if (isChangingLocale) {
    response.cookies.set(COOKIE_LOCALE_NAME, locale)
  }

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
