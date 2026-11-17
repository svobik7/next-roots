import { match } from 'path-to-regexp'
import type { Route, RouteParams, RouterSchema } from '~/types'
import { getLocaleFactory } from '~/utils/locale-utils'
import { sanitizeSchema } from '~/utils/schema-utils'
import { compileHref, formatHref } from './href-utils'
import { StaticRouter } from './static-router'

/**
 * Router class that extends StaticRouter to provide dynamic routing capabilities.
 */
export class Router extends StaticRouter {
  private schema: RouterSchema

  /**
   * Constructor for the Router class
   * @param {RouterSchema} schema - The routing schema
   */

  constructor(schema: RouterSchema) {
    super()
    this.schema = sanitizeSchema(schema)
  }

  /**
   * Creates href by finding route by given name and compiles its href with given params
   * @param {string} name - The name of the route
   * @param {RouteParams} params - Parameters for the route
   * @returns {string} - The compiled href
   */

  public getHref(name: string, params: RouteParams = {}): string {
    const { locale = StaticRouter.getLocale(), ...hrefParams } = params

    Object.keys(hrefParams).forEach((key) => {
      if (hrefParams[key] === '' || hrefParams[key] === null) {
        delete hrefParams[key]
      }
    })

    const route = this.findRouteByLocaleAndName(
      Array.isArray(locale) ? locale.join('_') : locale,
      name
    )
    return formatHref(compileHref(route?.href || '', hrefParams))
  }

  /**
   * Retrieves locale of given href
   * @param {string} href - The href to extract locale from
   * @returns {string} - The extracted locale
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
   * @param {string} href - The href to find route for
   * @returns {Route | undefined} - The found route or undefined
   */

  public getRouteFromHref(href: string): Route | undefined {
    const locale = this.getLocaleFromHref(href)
    return this.findRouteByLocaleAndHref(locale, href)
  }

  /**
   * Gets all routes for a given locale
   * @param {string} locale - The locale for which to get routes
   * @returns {Route[]} - The sorted array of routes
   */

  private getLocalizedRoutes(locale: string) {
    return this.schema.routes[locale] || []
  }

  /**
   * Finds a route for a given locale and route name
   * @param {string} locale - The locale for which to find the route
   * @param {string} name - The name of the route
   * @returns {Route | undefined} - The found route or undefined
   */

  private findRouteByLocaleAndName(locale: string, name: string) {
    return this.getLocalizedRoutes(locale).find(
      (route: Route) => route.name === name
    )
  }

  /**
   * Finds a route for a given locale and href
   * @param {string} locale - The locale for which to find the route
   * @param {string} href - The href of the route
   * @returns {Route | undefined} - The found route or undefined
   */

  private findRouteByLocaleAndHref(locale: string, href: string) {
    return this.getLocalizedRoutes(locale).find((route: Route) => {
      const isMatch = match(route.href, { decode: decodeURIComponent })
      return isMatch(href)
    })
  }
}

// Re-export utility functions for backward compatibility
export { compileHref, formatHref } from './href-utils'
