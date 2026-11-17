import type { Route } from '~/types'
import type { Rewrite } from '../types'
import { getRoute, isRoute } from './getRoute'

const inputRewrites: Rewrite[] = [
  { originPath: '/(auth)/layout.ts', localizedPath: '/en/(auth)/layout.ts' },
  {
    originPath: '/(auth)/login/page.tsx',
    localizedPath: '/en/(auth)/log-in/page.tsx',
  },
  {
    originPath: '/@header/login/page.tsx',
    localizedPath: '/en/@header/log-in/page.tsx',
  },
  {
    originPath: '/blog/[authorId]/[articleId]/page.ts',
    localizedPath: '/en/blog/[authorId]/[articleId]/page.ts',
  },
  {
    originPath: '/@modal/(.)blog/[authorId]/[articleId]/page.ts',
    localizedPath: '/en/@modal/(.)blog/[authorId]/[articleId]/page.ts',
  },
  {
    originPath: '/feed/@modal/(..)blog/[authorId]/[articleId]/page.ts',
    localizedPath: '/en/feed/@modal/(..)blog/[authorId]/[articleId]/page.ts',
  },
  {
    originPath:
      '/feed/friends/@modal/(..)(..)blog/[authorId]/[articleId]/page.ts',
    localizedPath:
      '/en/feed/friends/@modal/(..)(..)blog/[authorId]/[articleId]/page.ts',
  },
  {
    originPath: '/feed/friends/@modal/(...)blog/[authorId]/[articleId]/page.ts',
    localizedPath:
      '/en/feed/friends/@modal/(...)blog/[authorId]/[articleId]/page.ts',
  },
  {
    originPath: '/products/[[...slugs]]/page.ts',
    localizedPath: '/en/products/[[...slugs]]/page.ts',
  },
  {
    originPath: '/books/[...slugs]/page.ts',
    localizedPath: '/en/books/[...slugs]/page.ts',
  },
  {
    originPath: '/books/[[slug]]/page.ts',
    localizedPath: '/en/books/[[slug]]/page.ts',
  },
  {
    originPath: '/products/[product-id]/page.ts',
    localizedPath: '/cs/produkty/[product-id]/page.ts',
  },
  {
    originPath: '/shop/[category-id]/[product-id]/page.ts',
    localizedPath: '/en/shop/[category-id]/[product-id]/page.ts',
  },
  {
    originPath: '/catalog/[...product-id]/page.ts',
    localizedPath: '/en/catalog/[...product-id]/page.ts',
  },
  {
    originPath: '/filters/[[...filter-id]]/page.ts',
    localizedPath: '/en/filters/[[...filter-id]]/page.ts',
  },
  {
    originPath: '/items/[[item-id]]/page.ts',
    localizedPath: '/en/items/[[item-id]]/page.ts',
  },
  { originPath: '/page.js', localizedPath: '/en/page.js' },
  { originPath: '/page.js', localizedPath: '/(en)/page.js' },
  {
    originPath: '/skip/page.js',
    localizedPath: '/en/skip/page.js',
    skip: true,
  },
  {
    originPath: '/skip/page/page.js',
    localizedPath: '/en/skip/page/page.js',
    skip: { page: true },
  },
  {
    originPath: '/dontskip/layout/page.js',
    localizedPath: '/en/dontskip/layout/page.js',
    skip: { layout: true },
  },
]

const expectedSchema: Array<Route | undefined> = [
  undefined,
  {
    name: '/login',
    href: '/en/log-in',
  },
  {
    name: '/login',
    href: '/en/log-in',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/products/[[...slugs]]',
    href: '/en/products{/*slugs}',
  },
  {
    name: '/books/[...slugs]',
    href: '/en/books/*slugs',
  },
  {
    name: '/books/[[slug]]',
    href: '/en/books{/:slug}',
  },
  {
    name: '/products/[product-id]',
    href: '/cs/produkty/:"product-id"',
  },
  {
    name: '/shop/[category-id]/[product-id]',
    href: '/en/shop/:"category-id"/:"product-id"',
  },
  {
    name: '/catalog/[...product-id]',
    href: '/en/catalog/*"product-id"',
  },
  {
    name: '/filters/[[...filter-id]]',
    href: '/en/filters{/*"filter-id"}',
  },
  {
    name: '/items/[[item-id]]',
    href: '/en/items{/:"item-id"}',
  },
  {
    name: '/',
    href: '/en',
  },
  {
    name: '/',
    href: '/',
  },
  undefined,
  undefined,
  {
    name: '/dontskip/layout',
    href: '/en/dontskip/layout',
  },
]

test('getRoute', () => {
  const routes = inputRewrites.map(getRoute)
  expect(routes).toEqual(expectedSchema)
})

describe('isRoute', () => {
  const testCases = [
    [{}, false],
    [{ name: '' }, false],
    [{ href: '' }, false],
    [{ name: '', href: '' }, true],
  ] as const

  test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
    expect(isRoute(input)).toEqual(expectedResult)
  })
})
