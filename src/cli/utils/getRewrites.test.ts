import type { Config, Origin, Rewrite } from '../types'
import { getRewritesFactory } from './getRewrites'

const getRewrites = getRewritesFactory({
  defaultLocale: 'en',
  prefixDefaultLocale: false,
} as Config)

const inputOrigin: Origin = {
  path: '/(auth)/layout.ts',
  localizations: [
    { locale: 'en', path: '/(auth)/layout.ts' },
    { locale: 'cs', path: '/(auth)/layout.ts' },
    { locale: 'es', path: '/(auth)/layout.ts' },
  ],
}

const expectedOutput: Rewrite[] = [
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/(en)/(auth)/layout.ts',
    skip: false,
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/cs/(auth)/layout.ts',
    skip: false,
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/es/(auth)/layout.ts',
    skip: false,
  },
]

test('getRewrites', () => {
  const rewrites = getRewrites(inputOrigin)
  expect(rewrites).toStrictEqual(expectedOutput)
})

const inputOriginWithBooleanSkip: Origin = {
  path: '/(auth)/layout.ts',
  localizations: [
    { locale: 'en', path: '/(auth)/layout.ts' },
    { locale: 'cs', path: '/(auth)/layout.ts', skip: true },
    { locale: 'es', path: '/(auth)/layout.ts', skip: false },
  ],
}

const expectedOutputWithBooleanSkip: Rewrite[] = [
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/(en)/(auth)/layout.ts',
    skip: false,
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/cs/(auth)/layout.ts',
    skip: true,
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/es/(auth)/layout.ts',
    skip: false,
  },
]

test('getRewrites', () => {
  const rewrites = getRewrites(inputOriginWithBooleanSkip)
  expect(rewrites).toStrictEqual(expectedOutputWithBooleanSkip)
})

const inputOriginWithObjectSkip: Origin = {
  path: '/(auth)/layout.ts',
  localizations: [
    { locale: 'en', path: '/(auth)/layout.ts' },
    { locale: 'cs', path: '/(auth)/layout.ts', skip: { layout: true } },
    { locale: 'es', path: '/(auth)/layout.ts', skip: { layout: false } },
  ],
}

const expectedOutputWithObjectSkip: Rewrite[] = [
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/(en)/(auth)/layout.ts',
    skip: false,
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/cs/(auth)/layout.ts',
    skip: { layout: true },
  },
  {
    originPath: '/(auth)/layout.ts',
    localizedPath: '/es/(auth)/layout.ts',
    skip: { layout: false },
  },
]

test('getRewrites', () => {
  const rewrites = getRewrites(inputOriginWithObjectSkip)
  expect(rewrites).toStrictEqual(expectedOutputWithObjectSkip)
})
