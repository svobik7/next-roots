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
        {
          name: '/books',
          href: '/books-cs',
        },
        {
          name: '/books/[...slug]',
          href: '/books-cs/*slug',
        },
        {
          name: '/products/[[...slug]]',
          href: '/products-cs{/*slug}',
        },
        {
          name: '/products/[[slug]]',
          href: '/products-cs{/:slug}',
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
        {
          name: '/books',
          href: '/books-es',
        },
        {
          name: '/books/[...slug]',
          href: '/books-es/*slug',
        },
        {
          name: '/products/[[...slug]]',
          href: '/products-es{/*slug}',
        },
        {
          name: '/products/[[slug]]',
          href: '/products-es{/:slug}',
        },
      ],
    },
  }

  const expectedOutput = `
export type RouteLocale = 'cs' | 'es';
export type RouteNameStatic = '/account' | '/(auth)/login' | '/books';
export type RouteNameDynamic = '/blog/articles/[articleId]' | '/blog/authors/[authorId]' | '/books/[...slug]' | '/products/[[...slug]]' | '/products/[[slug]]';

export type RouteName = RouteNameStatic | RouteNameDynamic;
export type Route = { name: RouteName; href: \`/\${string}\` };

export type RouteParamsStatic<T extends object = object> = T & { locale?: string };
export type RouteParamsDynamic<T extends RouteName> = T extends '/blog/articles/[articleId]' ? RouteParamsStatic<{articleId:string}> : T extends '/blog/authors/[authorId]' ? RouteParamsStatic<{authorId:string}> : T extends '/books/[...slug]' ? RouteParamsStatic<{slug:string[]}> : T extends '/products/[[...slug]]' ? RouteParamsStatic<{slug?:string[]}> : T extends '/products/[[slug]]' ? RouteParamsStatic<{slug?:string}> : RouteParamsStatic;

export type RouterSchema = { defaultLocale: string, locales: string[], routes: Record<RouteLocale, Route[]> };
export const schema: RouterSchema;

export class Router {
  constructor(schema: RouterSchema)
  
  static getLocale(): RouteLocale
  static setLocale(locale: string): void
  
  static getPageHref(): Promise<string>
  static setPageHref(pageHref: string): void
  
  static setParams(params: Promise<Record<string, string | string[]>>): void
  
  static runWithContext<T>(context: { locale: string; pageHref: string; params?: Promise<Record<string, string | string[]>> }, fn: () => T): T
  
  getHref<T extends RouteNameStatic>(name: T): string
  getHref<T extends RouteNameStatic>(name: T, params: RouteParamsStatic): string
  getHref<T extends RouteNameDynamic>(name: T, params: RouteParamsDynamic<T>): string

  getLocaleFromHref(href: string): string
  getRouteFromHref(href: string): Route | undefined
}

export function compileHref(href: string, params: Record<string, string>): string
export function formatHref(href: string, params: Record<string, string>): string

export type PageProps<TParams = any, TSearchParams = any> = { locale: RouteLocale; params: TParams, searchParams: TSearchParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }

export type GeneratePageStaticParamsProps<TParams = any, TSearchParams = any> = { pageLocale: string, params: TParams, searchParams: TSearchParams }
export type GeneratePageMetadataProps<TParams = any, TSearchParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams, searchParams: TSearchParams }
export type GeneratePageViewportProps<TParams = any, TSearchParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams, searchParams: TSearchParams }

export type GenerateLayoutStaticParamsProps<TParams = any> = { locale: string, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GenerateLayoutViewportProps<TParams = any> = { locale: string, params: TParams }

/**
 * @deprecated Use GeneratePageStaticParamsProps instead
 */
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
export type RouteNameDynamic = never;

export type RouteName = RouteNameStatic;
export type Route = { name: RouteName; href: \`/\${string}\` };

export type RouteParamsStatic<T extends object = object> = T & { locale?: string };
export type RouteParamsDynamic<T extends RouteName> = RouteParamsStatic;

export type RouterSchema = { defaultLocale: string, locales: string[], routes: Record<RouteLocale, Route[]> };
export const schema: RouterSchema;

export class Router {
  constructor(schema: RouterSchema)
  
  static getLocale(): RouteLocale
  static setLocale(locale: string): void
  
  static getPageHref(): Promise<string>
  static setPageHref(pageHref: string): void
  
  static setParams(params: Promise<Record<string, string | string[]>>): void
  
  static runWithContext<T>(context: { locale: string; pageHref: string; params?: Promise<Record<string, string | string[]>> }, fn: () => T): T
  
  getHref<T extends RouteNameStatic>(name: T): string
  getHref<T extends RouteNameStatic>(name: T, params: RouteParamsStatic): string
  

  getLocaleFromHref(href: string): string
  getRouteFromHref(href: string): Route | undefined
}

export function compileHref(href: string, params: Record<string, string>): string
export function formatHref(href: string, params: Record<string, string>): string

export type PageProps<TParams = any, TSearchParams = any> = { locale: RouteLocale; params: TParams, searchParams: TSearchParams }
export type LayoutProps<TParams = any> = { locale: string, params: TParams }

export type GeneratePageStaticParamsProps<TParams = any, TSearchParams = any> = { pageLocale: string, params: TParams, searchParams: TSearchParams }
export type GeneratePageMetadataProps<TParams = any, TSearchParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams, searchParams: TSearchParams }
export type GeneratePageViewportProps<TParams = any, TSearchParams = any> = { locale: RouteLocale, getPageHref: () => Promise<string>, params: TParams, searchParams: TSearchParams }

export type GenerateLayoutStaticParamsProps<TParams = any> = { locale: string, params: TParams }
export type GenerateLayoutMetadataProps<TParams = any> = { locale: string, params: TParams }
export type GenerateLayoutViewportProps<TParams = any> = { locale: string, params: TParams }

/**
 * @deprecated Use GeneratePageStaticParamsProps instead
 */
export type GenerateStaticParamsProps = { pageLocale: string }
`

  test('should create lib declaration', () => {
    const declaration = compile(inputSchema)
    expect(declaration).toBe(expectedOutput)
  })
})
