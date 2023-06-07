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
  { originPath: '/page.js', localizedPath: '/en/page.js' },
  { originPath: '/page.js', localizedPath: '/(en)/page.js' },
]

const expectedSchema: Array<Route | undefined> = [
  undefined,
  {
    name: '/(auth)/login',
    href: '/en/log-in',
  },
  {
    name: '/@header/login',
    href: '/en/log-in',
  },
  {
    name: '/blog/[authorId]/[articleId]',
    href: '/en/blog/:authorId/:articleId',
  },
  {
    name: '/',
    href: '/en',
  },
  {
    name: '/',
    href: '/',
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
