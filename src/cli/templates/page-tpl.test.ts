import path from 'path'
import type { Config } from '../types'
import { compileFactory } from './page-tpl'

const defaultConfig: Config = {
  defaultLocale: 'cs',
  locales: ['cs'],
  prefixDefaultLocale: true,
  getCacheAbsolutePath: () => '',
  getDistAbsolutePath: () => '',
  getLocalizedAbsolutePath: () => '',
  getOriginAbsolutePath: () => '',
  getOriginContents: () => '',
}

test('should create root page', () => {
  const expectedOutput = `
import RootPageOrigin from '../../roots/page'
import { Router } from 'next-roots'

export default function RootPage(props) {
  Router.setLocale("cs")
  Router.setPageHref("/cs")
  {/* @ts-ignore */}
  return <RootPageOrigin {...props} locale={"cs"} />
}
`
  const inputRewrite = {
    originPath: '/page.js',
    localizedPath: '/cs/page.js',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /AbsolutePathHead/app/cs/page.ts
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/app', fileName),
    // resolves to = /AbsolutePathHead/roots/page.ts
    getOriginAbsolutePath: (fileName = '') =>
      path.join('/AbsolutePathHead/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for (group) route', () => {
  const expectedOutput = `
import AuthLoginPageOrigin from '../../../../src/roots/(auth)/login/page'
import { Router } from 'next-roots'

export default function AuthLoginPage(props:any) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/prihlaseni")
  {/* @ts-ignore */}
  return <AuthLoginPageOrigin {...props} locale={"cs"} />
}
`

  const inputRewrite = {
    originPath: '/(auth)/login/page.tsx',
    localizedPath: '/cs/(auth)/prihlaseni/page.tsx',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /app/cs/(auth)/prihlaseni/page.tsx
    getLocalizedAbsolutePath: (fileName = '') => path.join('/app', fileName),
    // resolves to = /src/roots/(auth)/prihlaseni/page.tsx
    getOriginAbsolutePath: (fileName = '') => path.join('/src/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for [dynamic] route', () => {
  const expectedOutput = `
import BlogAuthorIdPageOrigin from '../../../../../roots/blog/[authorId]/page'
import { Router, compileHref } from 'next-roots'

export default function BlogAuthorIdPage({ params, ...otherProps }) {
  Router.setLocale('cs')
  Router.setPageHref('/cs/magazin/:authorId')
  Router.setParams(params)
  {/* @ts-ignore */}
  return <BlogAuthorIdPageOrigin {...otherProps} params={params} locale={"cs"} />
}
`
  const inputRewrite = {
    originPath: '/blog/[authorId]/page.js',
    localizedPath: '/cs/magazin/[authorId]/page.js',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /src/app/cs/magazin/[authorId]/page.ts
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/src/app', fileName),
    // resolves to = /roots/magazin/[authorId]/page.ts
    getOriginAbsolutePath: (fileName = '') => path.join('/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for [[...optionalCatchAll]] route', () => {
  const expectedOutput = `
import ProductsPageOrigin from '../../../../../roots/products/[[...slugs]]/page'
import { Router, compileHref } from 'next-roots'

export default function ProductsPage({ params, ...otherProps }) {
  Router.setLocale('cs')
  Router.setPageHref('/cs/produkty{/*slugs}')
  Router.setParams(params)
  {/* @ts-ignore */}
  return <ProductsPageOrigin {...otherProps} params={params} locale={"cs"} />
}
`
  const inputRewrite = {
    originPath: '/products/[[...slugs]]/page.js',
    localizedPath: '/cs/produkty/[[...slugs]]/page.js',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /src/app/cs/magazin/[authorId]/page.ts
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/src/app', fileName),
    // resolves to = /roots/magazin/[authorId]/page.ts
    getOriginAbsolutePath: (fileName = '') => path.join('/roots', fileName),
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page with static metadata object', () => {
  const expectedOutput = `
import StaticMetaDataPageOrigin from '..'
import { Router } from 'next-roots'

export default function StaticMetaDataPage(props:any) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/static-meta-data")
  {/* @ts-ignore */}
  return <StaticMetaDataPageOrigin {...props} locale={"cs"} />
}

export { metadata } from '..'
`
  const inputRewrite = {
    originPath: '/static-meta-data/page.ts',
    localizedPath: '/cs/static-meta-data/page.ts',
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

test('should create page for static route but with dynamic metadata function', () => {
  const expectedOutput = `
import StaticRouteWithDynamicMetaDataPageOrigin from '..'
import { Router } from 'next-roots'

export default function StaticRouteWithDynamicMetaDataPage(props) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/static-route-with-dynamic-meta-data")
  {/* @ts-ignore */}
  return <StaticRouteWithDynamicMetaDataPageOrigin {...props} locale={"cs"} />
}

import {generateMetadata as generateMetadataOrigin} from '..'

export async function generateMetadata(props) {
  const getPageHref = () => "/cs/static-route-with-dynamic-meta-data"
  return generateMetadataOrigin({ ...props, locale: "cs", getPageHref })
}
`
  const inputRewrite = {
    originPath: '/static-route-with-dynamic-meta-data/page.js',
    localizedPath: '/cs/static-route-with-dynamic-meta-data/page.js',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export async function generateMetadata() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page with static viewport object', () => {
  const expectedOutput = `
import StaticViewportPageOrigin from '..'
import { Router } from 'next-roots'

export default function StaticViewportPage(props:any) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/static-viewport")
  {/* @ts-ignore */}
  return <StaticViewportPageOrigin {...props} locale={"cs"} />
}

export { viewport } from '..'
`
  const inputRewrite = {
    originPath: '/static-viewport/page.ts',
    localizedPath: '/cs/static-viewport/page.ts',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export const viewport = { themeColor: 'black' }`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for static route but with dynamic viewport function', () => {
  const expectedOutput = `
import StaticRouteWithDynamicViewportPageOrigin from '..'
import { Router } from 'next-roots'

export default function StaticRouteWithDynamicViewportPage(props) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/static-route-with-dynamic-viewport")
  {/* @ts-ignore */}
  return <StaticRouteWithDynamicViewportPageOrigin {...props} locale={"cs"} />
}

import {generateViewport as generateViewportOrigin} from '..'

export function generateViewport({ searchParams, ...otherProps }) {
  const getPageHref = () => "/cs/static-route-with-dynamic-viewport"
  return generateViewportOrigin({ ...otherProps, searchParams, locale: "cs", getPageHref })
}
`
  const inputRewrite = {
    originPath: '/static-route-with-dynamic-viewport/page.js',
    localizedPath: '/cs/static-route-with-dynamic-viewport/page.js',
  }

  const inputConfig: Config = {
    ...defaultConfig,
    getOriginContents: () => `export function generateViewport() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for [dynamic] route with generate static params and generateMetadata functions', () => {
  const expectedOutput = `
import BlogAuthorIdPageOrigin from '../../../../../roots/blog/[authorId]/page'
import { Router, compileHref } from 'next-roots'

export default function BlogAuthorIdPage({ params, ...otherProps }:any) {
  Router.setLocale('cs')
  Router.setPageHref('/cs/magazin/:authorId')
  Router.setParams(params)
  {/* @ts-ignore */}
  return <BlogAuthorIdPageOrigin {...otherProps} params={params} locale={"cs"} />
}

import {generateMetadata as generateMetadataOrigin} from '../../../../../roots/blog/[authorId]/page'

export async function generateMetadata({ params, ...otherProps }:any) {
  const getPageHref = async () => compileHref('/cs/magazin/:authorId', await params)
  return generateMetadataOrigin({ ...otherProps, params, locale: "cs", getPageHref })
}

import {generateStaticParams as generateStaticParamsOrigin} from '../../../../../roots/blog/[authorId]/page'

export async function generateStaticParams({ params, ...otherProps }:any) {
  return generateStaticParamsOrigin({ ...otherProps, params, pageLocale: "cs" })
}
`
  const inputRewrite = {
    originPath: '/blog/[authorId]/page.ts',
    localizedPath: '/cs/magazin/[authorId]/page.ts',
  }

  const inputConfig = {
    ...defaultConfig,
    // resolves to = /src/app/cs/magazin/[authorId]/page.ts
    getLocalizedAbsolutePath: (fileName = '') =>
      path.join('/src/app', fileName),
    // resolves to = /roots/magazin/[authorId]/page.ts
    getOriginAbsolutePath: (fileName = '') => path.join('/roots', fileName),
    getOriginContents: () =>
      `export async function generateMetadata() {};export async function generateStaticParams() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page with route segment config', () => {
  const expectedOutput = `
import RouteSegmentConfigPageOrigin from '..'
import { Router } from 'next-roots'

export default function RouteSegmentConfigPage(props:any) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/route-segment-config")
  {/* @ts-ignore */}
  return <RouteSegmentConfigPageOrigin {...props} locale={"cs"} />
}

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
`
  const inputRewrite = {
    originPath: '/route-segment-config/page.ts',
    localizedPath: '/cs/route-segment-config/page.ts',
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
