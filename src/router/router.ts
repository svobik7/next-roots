import { compile, match } from 'path-to-regexp'
import type { Route, RouterSchema } from '~/types'
import { getLocaleFactory } from '~/utils/locale-utils'
import { StaticRouter } from './static-router' // Importing separate static router

export class Router {
  private schema: RouterSchema

  constructor(schema: RouterSchema) {
    this.schema = schema
  }

  /**
   * Gets relevant page href
   */

  public getHref(name: string, params: Record<string, string> = {}): string {
    const {
      locale = this.getLocaleFromHref(StaticRouter.getPageHref()),
      ...hrefParams
    } = params
    const route = this.findRouteByLocaleAndName(locale, name)
    return formatHref(compileHref(route?.href || '', hrefParams))
  }

  /** */

  public getLocaleFromHref(href: string): string {
    const getLocale = getLocaleFactory({
      locales: this.schema.locales,
      defaultLocale: this.schema.defaultLocale,
    })
    return getLocale(href)
  }

  public getRouteFromHref(href: string): Route | undefined {
    const locale = this.getLocaleFromHref(href)
    return this.findRouteByLocaleAndHref(locale, href)
  }

  private getLocalizedRoutes(locale: string) {
    return (
      this.schema.routes[locale]?.sort((a, b) => {
        const dynamicIndexA = a.name.indexOf('[')
        const dynamicIndexB = b.name.indexOf('[')
        const isDynamicA = dynamicIndexA !== -1
        const isDynamicB = dynamicIndexB !== -1
        if (isDynamicA && isDynamicB) {
          return dynamicIndexB - dynamicIndexA
        }
        return isDynamicA ? 1 : -1
      }) || []
    )
  }

  private findRouteByLocaleAndName(locale: string, name: string) {
    return this.getLocalizedRoutes(locale).find(
      (route: Route) => route.name === name
    )
  }

  private findRouteByLocaleAndHref(locale: string, href: string) {
    return this.getLocalizedRoutes(locale).find((route: Route) => {
      const isMatch = match(route.href, { decode: decodeURIComponent })
      return isMatch(href)
    })
  }
}

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

export function formatHref(...hrefSegments: string[]): string {
  const href = hrefSegments.join('/').replace(/\/\/+/g, '/').replace(/\/$/, '')
  return href.startsWith('/') ? href : `/${href}`
}
