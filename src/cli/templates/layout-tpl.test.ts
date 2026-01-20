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
import OriginRootLayout from '../../roots/layout'

export default function LocalizedRootLayout(props) {
  {/* @ts-ignore */}
  return <OriginRootLayout {...props} locale="cs" />
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
import OriginAuthLoginLayout from '../../../../src/roots/(auth)/login/layout'

export default function LocalizedAuthLoginLayout(props:any) {
  {/* @ts-ignore */}
  return <OriginAuthLoginLayout {...props} locale="cs" />
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

test('should create layout with route segment config', () => {
  const expectedOutput = `
import OriginRouteSegmentConfigLayout from '..'

export default function LocalizedRouteSegmentConfigLayout(props:any) {
  {/* @ts-ignore */}
  return <OriginRouteSegmentConfigLayout {...props} locale="cs" />
}

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
`
  const inputRewrite = {
    originPath: '/route-segment-config/layout.ts',
    localizedPath: '/cs/route-segment-config/layout.ts',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () =>
      `
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create layout with static metadata object', () => {
  const expectedOutput = `
import OriginStaticMetaDataLayout from '..'

export default function LocalizedStaticMetaDataLayout(props:any) {
  {/* @ts-ignore */}
  return <OriginStaticMetaDataLayout {...props} locale="cs" />
}

export { metadata } from '..'
`
  const inputRewrite = {
    originPath: '/static-meta-data/layout.ts',
    localizedPath: '/cs/static-meta-data/layout.ts',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () =>
      `export const metadata = { title: "Static Title" }`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should propagate file-level directives from origin to generated layout', () => {
  const expectedOutput = `'use cache'
'use client'

import OriginStaticMetaDataLayout from '..'

export default function LocalizedStaticMetaDataLayout(props:any) {
  {/* @ts-ignore */}
  return <OriginStaticMetaDataLayout {...props} locale="cs" />
}

export { metadata } from '..'
`
  const inputRewrite = {
    originPath: '/static-meta-data/layout.ts',
    localizedPath: '/cs/static-meta-data/layout.ts',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () =>
      `'use cache'
'use client'

export const metadata = { title: "Static Title" }`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create layout with dynamic metadata object', () => {
  const expectedOutput = `
import OriginDynamicMetaDataLayout from '..'

export default function LocalizedDynamicMetaDataLayout(props) {
  {/* @ts-ignore */}
  return <OriginDynamicMetaDataLayout {...props} locale="cs" />
}

import {generateMetadata as generateMetadataOrigin} from '..'

export async function generateMetadata(props) {
  return generateMetadataOrigin({ ...props, locale: "cs" })
}
`
  const inputRewrite = {
    originPath: '/dynamic-meta-data/layout.js',
    localizedPath: '/cs/dynamic-meta-data/layout.js',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export async function generateMetadata() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create layout with static viewport object', () => {
  const expectedOutput = `
import OriginStaticViewportLayout from '..'

export default function LocalizedStaticViewportLayout(props:any) {
  {/* @ts-ignore */}
  return <OriginStaticViewportLayout {...props} locale="cs" />
}

export { viewport } from '..'
`
  const inputRewrite = {
    originPath: '/static-viewport/layout.ts',
    localizedPath: '/cs/static-viewport/layout.ts',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export const viewport = { themeColor: 'black' }`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create layout with dynamic viewport object', () => {
  const expectedOutput = `
import OriginDynamicViewportLayout from '..'

export default function LocalizedDynamicViewportLayout(props) {
  {/* @ts-ignore */}
  return <OriginDynamicViewportLayout {...props} locale="cs" />
}

import {generateViewport as generateViewportOrigin} from '..'

export function generateViewport({ params, searchParams, ...otherProps }) {
  return generateViewportOrigin({ ...otherProps, params, searchParams, locale: "cs" })
}
`
  const inputRewrite = {
    originPath: '/dynamic-viewport/layout.js',
    localizedPath: '/cs/dynamic-viewport/layout.js',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export function generateViewport() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create layout with generate static params', () => {
  const expectedOutput = `
import OriginGenerateStaticParamsLayout from '..'

export default function LocalizedGenerateStaticParamsLayout(props) {
  {/* @ts-ignore */}
  return <OriginGenerateStaticParamsLayout {...props} locale="cs" />
}

import {generateStaticParams as generateStaticParamsOrigin} from '..'

export async function generateStaticParams({ params, ...otherProps }:any) {
  return generateStaticParamsOrigin({ ...otherProps, params, locale: "cs" })
}
`
  const inputRewrite = {
    originPath: '/generate-static-params/layout.js',
    localizedPath: '/cs/generate-static-params/layout.js',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export async function generateStaticParams() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})
