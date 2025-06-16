import path from 'path'
import type { Config } from '../types'
import { compileFactory } from './template-tpl'

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

test('should create root template', () => {
  const expectedOutput = `
import OriginRootTemplate from '../../roots/template'

export default function LocalizedRootTemplate(props) {
  {/* @ts-ignore */}
  return <OriginRootTemplate {...props} locale="cs" />
}
`
  const inputRewrite = {
    originPath: '/template.js',
    localizedPath: '/cs/template.js',
  }

  const inputConfig = {
    ...defaultConfig,
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePath/app', fileName),
    getOriginAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePath/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create nested template', () => {
  const expectedOutput = `
import OriginAuthLoginTemplate from '../../../../src/roots/(auth)/login/template'

export default function LocalizedAuthLoginTemplate(props:any) {
  {/* @ts-ignore */}
  return <OriginAuthLoginTemplate {...props} locale="cs" />
}
`

  const inputRewrite = {
    originPath: '/(auth)/login/template.tsx',
    localizedPath: '/cs/(auth)/prihlaseni/template.tsx',
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
