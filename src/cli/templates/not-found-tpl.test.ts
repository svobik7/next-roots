import path from 'path'
import type { Config } from '../types'
import { compileFactory } from './not-found-tpl'

const defaultConfig: Config = {
  defaultLocale: 'cs',
  locales: ['cs', 'en'],
  prefixDefaultLocale: true,
  getCacheAbsolutePath: () => '',
  getDistAbsolutePath: () => '',
  getLocalizedAbsolutePath: () => '',
  getOriginAbsolutePath: () => '',
  getOriginContents: () => '',
}

test('should create root not-found', () => {
  const expectedOutput = `
import RootNotFoundOrigin from '../../roots/not-found'

export default function RootNotFound() {
  {/* @ts-ignore */}
  return <RootNotFoundOrigin locale="cs" />
}
`
  const inputRewrite = {
    originPath: '/not-found.js',
    localizedPath: '/cs/not-found.js',
  }

  const inputConfig = {
    ...defaultConfig,
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/app', fileName),
    getOriginAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create nested not-found', () => {
  const expectedOutput = `
import AuthLoginNotFoundOrigin from '../../../../src/roots/(auth)/login/not-found'

export default function AuthLoginNotFound() {
  {/* @ts-ignore */}
  return <AuthLoginNotFoundOrigin locale="cs" />
}
`

  const inputRewrite = {
    originPath: '/(auth)/login/not-found.tsx',
    localizedPath: '/cs/(auth)/prihlaseni/not-found.tsx',
  }

  const inputConfig = {
    ...defaultConfig,
    getLocalizedAbsolutePath: (fileName = '') => path.join('/app', fileName),
    getOriginAbsolutePath: (fileName = '') => path.join('/src/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})
