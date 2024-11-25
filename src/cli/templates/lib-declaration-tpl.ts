import { pathToRegexp } from 'path-to-regexp'
import type { Route, RouterSchema } from '~/types'
import {
  type CompileParams,
  compileTemplateFactory,
  getPatternsFromNames,
} from './tpl-utils'

export const PATTERNS = getPatternsFromNames(
  'routeLocales',
  'routeNamesStatic',
  'routeNamesDynamic',
  'routeParamsDynamic'
)

export const tpl = `
export type RouteLocale = ${PATTERNS.routeLocales};
export type RouteNameStatic = ${PATTERNS.routeNamesStatic};
export type RouteName = RouteNameStatic;
export type Route = { name: RouteName; href: \`/\${string}\` };

export type RouteParamsStatic<T extends object = object> = T & { locale?: string };

export type RouterSchema = { defaultLocale: string, locales: string[], routes: Record<RouteLocale, Route[]> };

export class Router {
  constructor(schema: RouterSchema)
  
  static getPageHref(): string
  static setPageHref(pageHref: string): void
  
  getHref<T extends RouteNameStatic>(name: T): string
  getHref<T extends RouteNameStatic>(name: T, params: RouteParamsStatic): string

  getLocaleFromHref(href: string): string
  getRouteFromHref(href: string): Route | undefined
}

export const schema: RouterSchema;

export function compileHref(href: string, params: Record<string, string>): string
export function formatHref(href: string, params: Record<string, string>): string

export type PageProps<TParams = void> = TParams extends void
  ? { locale: RouteLocale }
  : { locale: RouteLocale; params: TParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageMetadataProps<TParams = any> = { locale: RouteLocale, getPageHref: () => string, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageViewportProps<TSParams = any> = { locale: RouteLocale, getPageHref: () => string, searchParams: TSParams }
export type GenerateLayoutViewportProps<TSParams = any> = { locale: string, searchParams: TSParams }
/**
 * @deprecated Use GeneratePageStaticParamsProps instead
 */
export type GenerateStaticParamsProps = { pageLocale: string }
export type GeneratePageStaticParamsProps<TParams = any> = { pageLocale: string, params: TParams }
export type GenerateLayoutStaticParamsProps<TParams = any> = { locale: string, params: TParams }
`

export const tplWithDynamicRoutes = `
export type RouteLocale = ${PATTERNS.routeLocales};
export type RouteNameStatic = ${PATTERNS.routeNamesStatic};
export type RouteNameDynamic = ${PATTERNS.routeNamesDynamic};
export type RouteName = RouteNameStatic | RouteNameDynamic;
export type Route = { name: RouteName; href: \`/\${string}\` };

export type RouteParamsStatic<T extends object = object> = T & { locale?: string };
export type RouteParamsDynamic<T extends RouteName> = ${PATTERNS.routeParamsDynamic};

export type RouterSchema = { defaultLocale: string, locales: string[], routes: Record<RouteLocale, Route[]> };

export class Router {
  constructor(schema: RouterSchema)
  
  static getLocale(): RouteLocale
  static setLocale(locale: string): void 
  static getPageHref(): Promise<string>
  static setPageHref(pageHref: string): void
  static setParams(params: Promise<Record<string, string>>): void
  
  getHref<T extends RouteNameDynamic>(name: T, params: RouteParamsDynamic<T>): string
  getHref<T extends RouteNameStatic>(name: T): string
  getHref<T extends RouteNameStatic>(name: T, params: RouteParamsStatic): string

  getLocaleFromHref(href: string): string
  getRouteFromHref(href: string): Route | undefined
}

export const schema: RouterSchema;

export function compileHref(href: string, params: Record<string, string>): string
export function formatHref(href: string, params: Record<string, string>): string

export type PageProps<TParams = void> = TParams extends void
  ? { locale: RouteLocale }
  : { locale: RouteLocale; params: TParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageMetadataProps<TParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageViewportProps<TParams = any, TSParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams, searchParams: TSParams }
export type GenerateLayoutViewportProps<TParams = any, TSParams = any> = { locale: string, params: TParams, searchParams: TSParams }
/**
 * @deprecated Use GeneratePageStaticParamsProps instead
 */
export type GenerateStaticParamsProps = { pageLocale: string }
export type GeneratePageStaticParamsProps<TParams = any> = { pageLocale: string, params: TParams }
export type GenerateLayoutStaticParamsProps<TParams = any> = { locale: string, params: TParams }
`

function not<T>(fn: (input: T) => boolean) {
  return (input: T) => !fn(input)
}

function pipeString(value: string, index: number, array: string[]) {
  let output = `'${value}'`

  if (index < array.length - 1) {
    output += ' | '
  }

  return output
}

function formatPipedStrings(values: string[]) {
  return values.map(pipeString).join('')
}

function getRouteName(route: Route) {
  return route.name
}

function isDynamicOptionalCatchAllRoute(route: Route) {
  return !!route.name.match(/\[\[\.\.\.\w+\]\]/g)
}

function isDynamicCatchAllRoute(route: Route) {
  return (
    !!route.name.match(/\[\.\.\.\w+\]/g) ||
    isDynamicOptionalCatchAllRoute(route)
  )
}

function isDynamicOptionalRoute(route: Route) {
  return !!route.name.match(/\[\[\w+\]\]/g)
}

function isDynamicRoute(route: Route) {
  return (
    !!route.name.match(/\[\w+\]/g) ||
    isDynamicOptionalRoute(route) ||
    isDynamicCatchAllRoute(route) ||
    isDynamicOptionalCatchAllRoute(route)
  )
}

function getDefaultRoutes(schema: RouterSchema) {
  return schema.routes[schema.defaultLocale] || []
}
function getStaticRouteNames(schema: RouterSchema): string[] {
  const defaultRoutes = getDefaultRoutes(schema)
  return defaultRoutes?.filter(not(isDynamicRoute)).map(getRouteName)
}

function getDynamicRouteNames(schema: RouterSchema): string[] {
  const defaultRoutes = getDefaultRoutes(schema)
  return defaultRoutes?.filter(isDynamicRoute).map(getRouteName)
}

function getDynamicRouteParams(schema: RouterSchema) {
  const defaultRoutes = getDefaultRoutes(schema)
  const dynamicRoutes = defaultRoutes?.filter(isDynamicRoute)

  return dynamicRoutes.reduce(
    (acc: string, item: Route, index: number, array: Route[]) => {
      const { keys = [] } = pathToRegexp(item.href)
      const nameSuffix =
        isDynamicOptionalRoute(item) || isDynamicOptionalCatchAllRoute(item)
          ? '?'
          : ''

      const paramType =
        isDynamicCatchAllRoute(item) || isDynamicOptionalCatchAllRoute(item)
          ? 'string[]'
          : 'string'

      acc += `T extends '${item.name}' ? RouteParamsStatic<{${keys.map(
        (p) => `${p.name}${nameSuffix}:${paramType}`
      )}}> : `

      if (index === array.length - 1) {
        acc += 'RouteParamsStatic'
      }

      return acc
    },
    ''
  )
}

function getCompileParams(
  schema: RouterSchema
): CompileParams<typeof PATTERNS> {
  return {
    routeLocales: formatPipedStrings(schema.locales),
    routeNamesDynamic: formatPipedStrings(getDynamicRouteNames(schema)),
    routeNamesStatic: formatPipedStrings(getStaticRouteNames(schema)),
    routeParamsDynamic: getDynamicRouteParams(schema),
  }
}

export function compile(schema: RouterSchema) {
  const params = getCompileParams(schema)

  const compileTemplate = compileTemplateFactory()
  return compileTemplate(
    params.routeNamesDynamic ? tplWithDynamicRoutes : tpl,
    params
  )
}
