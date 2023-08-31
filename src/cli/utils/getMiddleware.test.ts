import path from 'path'
import type { Middleware } from '~/types'
import type { Config, Rewrite } from '../types'
import { getMiddleware, isMiddleware } from './getMiddleware'

const defaultConfig: Config = {
  defaultLocale: 'lt',
  locales: ['lt', 'en'],
  prefixDefaultLocale: true,
  getCacheAbsolutePath: () => '',
  getDistAbsolutePath: () => '',
  getLocalizedAbsolutePath: () => '',
  getOriginAbsolutePath: () => '',
  getOriginContents: () => '',
  getRootAliasPath: () => '',
}

const inputConfig = {
  ...defaultConfig,
  getRootAliasPath: (fileName = '') => path.join('/Root/app', fileName),
}

const inputRewrites: Rewrite[] = [
  {
    originPath: '/(auth)/_middleware.ts',
    localizedPath: '/en/(auth)/_middleware.ts',
  },
  {
    originPath: '/(auth)/login/_middleware.ts',
    localizedPath: '/en/(auth)/log-in/_middleware.ts',
  },
  {
    originPath: '/@header/login/_middleware.tsx',
    localizedPath: '/en/@header/log-in/_middleware.tsx',
  },
  {
    originPath: '/blog/[authorId]/[articleId]/_middleware.ts',
    localizedPath: '/en/blog/[authorId]/[articleId]/_middleware.ts',
  },
  {
    originPath: '/@modal/(.)blog/[authorId]/[articleId]/_middleware.ts',
    localizedPath: '/en/@modal/(.)blog/[authorId]/[articleId]/_middleware.ts',
  },
  {
    originPath: '/feed/@modal/(..)blog/[authorId]/[articleId]/_middleware.ts',
    localizedPath:
      '/en/feed/@modal/(..)blog/[authorId]/[articleId]/_middleware.ts',
  },
  {
    originPath:
      '/feed/friends/@modal/(..)(..)blog/[authorId]/[articleId]/_middleware.ts',
    localizedPath:
      '/en/feed/friends/@modal/(..)(..)blog/[authorId]/[articleId]/_middleware.ts',
  },
  {
    originPath:
      '/feed/friends/@modal/(...)blog/[authorId]/[articleId]/_middleware.ts',
    localizedPath:
      '/en/feed/friends/@modal/(...)blog/[authorId]/[articleId]/_middleware.ts',
  },
]

const expectedSchema: Array<Middleware | undefined> = [
  {
    href: '/en',
    path: '/Root/app/en/(auth)/_middleware.ts',
    originName: 'AuthMiddleware',
  },
  {
    href: '/en/log-in',
    path: '/Root/app/en/(auth)/log-in/_middleware.ts',
    originName: 'AuthLoginMiddleware',
  },
  undefined,
  {
    href: '/en/blog/:authorId/:articleId',
    path: '/Root/app/en/blog/[authorId]/[articleId]/_middleware.ts',
    originName: 'BlogAuthorIdArticleIdMiddleware',
  },
  {
    href: '/en/blog/:authorId/:articleId',
    path: '/Root/app/en/@modal/(.)blog/[authorId]/[articleId]/_middleware.ts',
    originName: 'ModalAuthorIdArticleIdMiddleware',
  },
  {
    href: '/en/blog/:authorId/:articleId',
    path: '/Root/app/en/feed/@modal/(..)blog/[authorId]/[articleId]/_middleware.ts',
    originName: 'FeedModalAuthorIdArticleIdMiddleware',
  },
  {
    href: '/en/blog/:authorId/:articleId',
    path: '/Root/app/en/feed/friends/@modal/(..)(..)blog/[authorId]/[articleId]/_middleware.ts',
    originName: 'FeedFriendsModalAuthorIdArticleIdMiddleware',
  },
  {
    href: '/en/blog/:authorId/:articleId',
    path: '/Root/app/en/feed/friends/@modal/(...)blog/[authorId]/[articleId]/_middleware.ts',
    originName: 'FeedFriendsModalAuthorIdArticleIdMiddleware',
  },
]

test('getMiddleware', () => {
  const routes = inputRewrites.map(getMiddleware(inputConfig))
  expect(routes).toEqual(expectedSchema)
})

describe('isMiddleware', () => {
  const testCases = [
    [{}, false],
    [{ path: '' }, false],
    [{ href: '' }, false],
    [{ path: '', href: '' }, true],
  ] as const

  test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
    expect(isMiddleware(input)).toEqual(expectedResult)
  })
})
