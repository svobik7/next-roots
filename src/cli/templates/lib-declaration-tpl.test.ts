import type { RouterSchema } from '~/types'
import { compile } from './lib-declaration-tpl'

describe('with dynamic routes', () => {
  const inputSchema: RouterSchema = {
    defaultLocale: 'cs',
    locales: ['cs', 'es'],
    routes: {
      cs: [
        {
          name: '/account',
          href: '/ucet',
        },
        {
          name: '/(auth)/login',
          href: '/prihlaseni',
        },
        {
          name: '/blog/articles/[articleId]',
          href: '/blog/clanky/:articleId',
        },
        {
          name: '/blog/authors/[authorId]',
          href: '/blog/autori/:authorId',
        },
      ],
      es: [
        {
          name: '/account',
          href: '/cuenta',
        },
        {
          name: '/(auth)/login',
          href: '/acceso',
        },
        {
          name: '/blog/articles/[articleId]',
          href: '/blog/articulos/:articleId',
        },
        {
          name: '/blog/authors/[authorId]',
          href: '/blog/authores/:authorId',
        },
      ],
    },
  }

  const expectedOutput = `
export type RouteLocale = 'cs' | 'es';
export type RouteNameStatic = '/account' | '/(auth)/login';
export type RouteNameDynamic = '/blog/articles/[articleId]' | '/blog/authors/[authorId]';
export type RouteName = RouteNameStatic | RouteNameDynamic;
export type Route = { name: RouteName; href: \`/\${string}\` };

export type RouteParamsStatic<T extends object = object> = T & { locale?: string };
export type RouteParamsDynamic<T extends RouteName> = T extends '/blog/articles/[articleId]' ? RouteParamsStatic<{articleId:string}> : T extends '/blog/authors/[authorId]' ? RouteParamsStatic<{authorId:string}> : RouteParamsStatic;

export type RouterSchema = { defaultLocale: string, locales: string[], routes: Record<RouteLocale, Route[]> };

export class Router {
  constructor(schema: RouterSchema)
  
  static getPageHref(): string
  static setPageHref(pageHref: string): void
  
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
  ? { pageHref: string }
  : { pageHref: string; params: TParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageMetadataProps<TParams = any> = { pageHref: string, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GenerateStaticParamsProps = { pageLocale: string }
`

  test('should create lib declaration', () => {
    const declaration = compile(inputSchema)
    expect(declaration).toBe(expectedOutput)
  })
})

describe('only static routes', () => {
  const inputSchema: RouterSchema = {
    defaultLocale: 'cs',
    locales: ['cs', 'es'],
    routes: {
      cs: [
        {
          name: '/account',
          href: '/ucet',
        },
        {
          name: '/(auth)/login',
          href: '/prihlaseni',
        },
      ],
      es: [
        {
          name: '/account',
          href: '/cuenta',
        },
        {
          name: '/(auth)/login',
          href: '/acceso',
        },
      ],
    },
  }

  const expectedOutput = `
export type RouteLocale = 'cs' | 'es';
export type RouteNameStatic = '/account' | '/(auth)/login';
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
  ? { pageHref: string }
  : { pageHref: string; params: TParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }
export type GeneratePageMetadataProps<TParams = any> = { pageHref: string, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GenerateStaticParamsProps = { pageLocale: string }
`

  test('should create lib declaration', () => {
    const declaration = compile(inputSchema)
    expect(declaration).toBe(expectedOutput)
  })
})
