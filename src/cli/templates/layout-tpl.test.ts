import path from 'path'
import type { Config } from '../types'
import { compileFactory } from './layout-tpl'

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

test('should create root layout', () => {
  const expectedOutput = `
import RootLayoutOrigin from '../../roots/layout'

export default function RootLayout(props) {
  {/* @ts-ignore */}
  return <RootLayoutOrigin {...props} locale="cs" />
}
`
  const inputRewrite = {
    originPath: '/layout.js',
    localizedPath: '/cs/layout.js',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /:head/app/cs/page.ts
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/app', fileName),
    // resolves to = /:head/roots/page.ts
    getOriginAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create nested layout', () => {
  const expectedOutput = `
import AuthLoginLayoutOrigin from '../../../../src/roots/(auth)/login/layout'

export default function AuthLoginLayout(props:any) {
  {/* @ts-ignore */}
  return <AuthLoginLayoutOrigin {...props} locale="cs" />
}
`

  const inputRewrite = {
    originPath: '/(auth)/login/layout.tsx',
    localizedPath: '/cs/(auth)/prihlaseni/layout.tsx',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /:head/app/cs/(auth)/prihlaseni/page.tsx
    getLocalizedAbsolutePath: (fileName = '') => path.join('/app', fileName),
    // resolves to = /:head/src/roots/(auth)/prihlaseni/page.tsx
    getOriginAbsolutePath: (fileName = '') => path.join('/src/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})
