import type { RouterSchema } from '~/types'
import { Router } from './router'
import { StaticRouter } from './static-router'

const inputSchema: RouterSchema = {
  locales: ['es', 'cs'],
  defaultLocale: 'es',
  routes: {
    es: [
      {
        name: '/(auth)/login',
        href: '/es/acceso',
      },
      {
        name: '/blog/articles/[articleId]',
        href: '/es/blog/articulos/:articleId',
      },
      {
        name: '/[slug]',
        href: '/es/:slug',
      },
      {
        name: '/books',
        href: '/es/libros',
      },
      {
        name: '/books/[...slug]',
        href: '/es/libros/:slug+',
      },
      {
        name: '/products/[[...slug]]',
        href: '/es/productos/:slug*',
      },
    ],
    cs: [
      {
        name: '/(auth)/login',
        href: '/cs/prihlaseni',
      },
      {
        name: '/blog/articles/[articleId]',
        href: '/cs/blog/clanky/:articleId',
      },
      {
        name: '/[slug]',
        href: '/cs/:slug',
      },
      {
        name: '/books',
        href: '/cs/knihy',
      },
      {
        name: '/books/[...slug]',
        href: '/cs/knihy/:slug+',
      },
      {
        name: '/products/[[...slug]]',
        href: '/cs/produkty/:slug*',
      },
    ],
  },
}

describe('getHref', () => {
  const router = new Router(inputSchema)

  const testCases = [
    ['/(auth)/login', { locale: 'cs' }, '', '/cs/prihlaseni'],
    ['/(auth)/login', { locale: 'es' }, '', '/es/acceso'],
    ['/(auth)/login', { locale: 'invalid' }, '', '/'],
    [
      '/blog/articles/[articleId]',
      { locale: 'cs', articleId: '1' },
      '',
      '/cs/blog/clanky/1',
    ],
    [
      '/blog/articles/[articleId]',
      { locale: 'es', articleId: '1' },
      '',
      '/es/blog/articulos/1',
    ],
    ['/(auth)/login', undefined, '', '/es/acceso'],
    ['/(auth)/login', undefined, '/cs', '/cs/prihlaseni'],
    ['/(auth)/login', { locale: 'es' }, '/cs', '/es/acceso'],
    [
      '/blog/articles/[articleId]',
      undefined,
      '',
      '/es/blog/articulos/:articleId',
    ],
    [
      '/blog/articles/[articleId]',
      undefined,
      '',
      '/es/blog/articulos/:articleId',
    ],
    ['/books', undefined, '', '/es/libros'],
    ['/books', { locale: 'cs' }, '', '/cs/knihy'],
    ['/books/[...slug]', { locale: 'cs', slug: '1' }, '', '/cs/knihy/1'],
    ['/[slug]', undefined, '', '/es/:slug'],
    ['/[slug]', { locale: 'cs' }, '', '/cs/:slug'],
    ['/[slug]', { locale: 'cs', slug: '1' }, '', '/cs/1'],
    ['/products/[[...slug]]', { locale: 'cs', slug: '' }, '', '/cs/produkty'],
    ['/products/[[...slug]]', { locale: 'cs' }, '', '/cs/produkty'],
    [
      '/products/[[...slug]]',
      { locale: 'cs', slug: '1' },
      '',
      '/cs/produkty/1',
    ],
    [
      '/products/[[...slug]]',
      { locale: 'cs', slug: '1/2' },
      '',
      '/cs/produkty/1/2',
    ],
  ] as const

  test.each(testCases)(
    'given %s as routeName and %o as params when pageHref is %s, returns %s',
    (routeName, params, pageHref, expectedResult) => {
      StaticRouter.setPageHref(pageHref)
      expect(StaticRouter.getPageHref()).toEqual(pageHref)

      const result = router.getHref(routeName, params)
      expect(result).toEqual(expectedResult)
    }
  )
})

describe('getLocaleFromHref', () => {
  const router = new Router(inputSchema)

  const testCases = [
    ['/cs/login', 'cs'],
    ['/es/login', 'es'],
    ['/login', 'es'],
  ] as const

  test.each(testCases)('given %s and returns %s', (href, expectedResult) => {
    const result = router.getLocaleFromHref(href)
    expect(result).toEqual(expectedResult)
  })
})

describe('getRouteFromHref', () => {
  const router = new Router(inputSchema)

  const testCases = [
    ['/cs/knihy', { name: '/books', href: '/cs/knihy' }],
    ['/es/libros', { name: '/books', href: '/es/libros' }],
    ['/cs/aa-bb-cc', { name: '/[slug]', href: '/cs/:slug' }],
    ['/es/aa-bb-cc', { name: '/[slug]', href: '/es/:slug' }],
    [
      '/cs/knihy/aa-bb-cc',
      { name: '/books/[...slug]', href: '/cs/knihy/:slug+' },
    ],
    [
      '/es/libros/aa-bb-cc',
      { name: '/books/[...slug]', href: '/es/libros/:slug+' },
    ],
    [
      '/cs/produkty',
      { name: '/products/[[...slug]]', href: '/cs/produkty/:slug*' },
    ],
    [
      '/cs/produkty/aa-bb-cc',
      { name: '/products/[[...slug]]', href: '/cs/produkty/:slug*' },
    ],
    [
      '/es/productos',
      { name: '/products/[[...slug]]', href: '/es/productos/:slug*' },
    ],
    [
      '/es/productos/aa-bb-cc',
      { name: '/products/[[...slug]]', href: '/es/productos/:slug*' },
    ],
    ['/cs/prihlaseni', { name: '/(auth)/login', href: '/cs/prihlaseni' }],
    ['/es/acceso', { name: '/(auth)/login', href: '/es/acceso' }],
    [
      '/cs/blog/clanky/1',
      {
        name: '/blog/articles/[articleId]',
        href: '/cs/blog/clanky/:articleId',
      },
    ],
    [
      '/es/blog/articulos/1',
      {
        name: '/blog/articles/[articleId]',
        href: '/es/blog/articulos/:articleId',
      },
    ],
    ['/prihlaseni', undefined],
    ['', undefined],
  ] as const

  test.each(testCases)(
    'given %s as arguments, returns %o',
    (pathName, expectedResult) => {
      const result = router.getRouteFromHref(pathName)
      expect(result).toStrictEqual(expectedResult)
    }
  )
})
