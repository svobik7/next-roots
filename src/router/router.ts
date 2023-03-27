import { compile, match } from 'path-to-regexp'
import type { Route, RouterSchema } from '~/types'
import { getLocaleFactory } from '~/utils/locale-utils'

export class Router {
  private schema: RouterSchema
  private static PAGE_HREF = '/'

  constructor(schema: RouterSchema) {
    this.schema = schema
  }

  /**
   * Gets relevant page href
   */
  public static getPageHref() {
    return Router.PAGE_HREF
  }

  /**
   * Sets relevant page href
   * @param pageHref
   */
  public static setPageHref(pageHref: string) {
    Router.PAGE_HREF = pageHref
  }

  /**
   * Creates href by finding route by given name and compiles its href with given params
   * @param name
   * @param params
   * @returns
   */
  public getHref(name: string, params: Record<string, string> = {}): string {
    const { locale = this.getLocaleFromHref(Router.PAGE_HREF), ...hrefParams } =
      params
    const route = this.findRouteByLocaleAndName(locale, name)

    return formatHref(compileHref(route?.href || '', hrefParams))
  }

  /**
   * Retrieves locale of given href
   * @param href
   * @returns
   */
  public getLocaleFromHref(href: string): string {
    const getLocale = getLocaleFactory({
      locales: this.schema.locales,
      defaultLocale: this.schema.defaultLocale,
    })

    return getLocale(href)
  }

  /**
   * Finds route matching given href
   * @param href
   * @returns
   */
  public getRouteFromHref(href: string): Route | undefined {
    const locale = this.getLocaleFromHref(href)
    return this.findRouteByLocaleAndHref(locale, href)
  }

  /**
   * Gets all routes for given locale
   * @param locale
   * @returns
   */
  private getLocalizedRoutes(locale: string) {
    return this.schema.routes[locale] || []
  }

  /**
   * Finds route for given name and href
   * @param locale
   * @param href
   * @returns
   */
  private findRouteByLocaleAndName(locale: string, name: string) {
    return this.getLocalizedRoutes(locale).find(
      (route: Route) => route.name === name
    )
  }

  /**
   * Finds route for given locale and href
   * @param locale
   * @param href
   * @returns
   */
  private findRouteByLocaleAndHref(locale: string, href: string) {
    return this.getLocalizedRoutes(locale).find((route: Route) => {
      const isMatch = match(route.href, { decode: decodeURIComponent })
      return isMatch(href)
    })
  }
}

/**
 * Puts given params to their appropriate places in given href
 * @param href
 * @param params
 * @returns
 */
export function compileHref(
  href: string,
  params: Record<string, string>
): string {
  let compiledHref = ''
  try {
    const getHref = compile(href, {
      encode: encodeURIComponent,
    })
    compiledHref = getHref(params)
  } catch {
    compiledHref = href
  }

  return compiledHref
}

/**
 * Removes duplicated or trailing slashes from given href and puts the slash at the beginning
 * @param hrefSegments
 * @returns
 */
export function formatHref(...hrefSegments: string[]): string {
  const href = hrefSegments.join('/').replace(/\/\/+/g, '/').replace(/\/$/, '')

  return href.startsWith('/') ? href : `/${href}`
}
