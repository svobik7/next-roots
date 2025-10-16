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
import OriginRootPage from '../../roots/page'
import { Router } from 'next-roots'

export default function LocalizedRootPage(props) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs" },
    () => {
      {/* @ts-ignore */}
      return <OriginRootPage {...props} locale={"cs"} />
    }
  )
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
import OriginAuthLoginPage from '../../../../src/roots/(auth)/login/page'
import { Router } from 'next-roots'

export default function LocalizedAuthLoginPage(props:any) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/prihlaseni" },
    () => {
      {/* @ts-ignore */}
      return <OriginAuthLoginPage {...props} locale={"cs"} />
    }
  )
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
import OriginBlogAuthorIdPage from '../../../../../roots/blog/[authorId]/page'
import { Router } from 'next-roots'

export default function LocalizedBlogAuthorIdPage({ params, ...otherProps }) {
  return Router.runWithContext(
    { locale: 'cs', pageHref: '/cs/magazin/:authorId', params },
    () => {
      {/* @ts-ignore */}
      return <OriginBlogAuthorIdPage {...otherProps} params={params} locale={"cs"} />
    }
  )
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
import OriginProductsPage from '../../../../../roots/products/[[...slugs]]/page'
import { Router } from 'next-roots'

export default function LocalizedProductsPage({ params, ...otherProps }) {
  return Router.runWithContext(
    { locale: 'cs', pageHref: '/cs/produkty{/*slugs}', params },
    () => {
      {/* @ts-ignore */}
      return <OriginProductsPage {...otherProps} params={params} locale={"cs"} />
    }
  )
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
import OriginStaticMetaDataPage from '..'
import { Router } from 'next-roots'

export default function LocalizedStaticMetaDataPage(props:any) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/static-meta-data" },
    () => {
      {/* @ts-ignore */}
      return <OriginStaticMetaDataPage {...props} locale={"cs"} />
    }
  )
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

test('should propagate file-level directives from origin to generated page', () => {
  const expectedOutput = `'use cache'
'use client'

import OriginStaticMetaDataPage from '..'
import { Router } from 'next-roots'

export default function LocalizedStaticMetaDataPage(props:any) {
  Router.setLocale("cs")
  Router.setPageHref("/cs/static-meta-data")
  {/* @ts-ignore */}
  return <OriginStaticMetaDataPage {...props} locale={"cs"} />
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
      `'use cache'
'use client'

export const metadata = { title: "Static Title" }`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page for static route but with dynamic metadata function', () => {
  const expectedOutput = `
import OriginStaticRouteWithDynamicMetaDataPage from '..'
import { Router } from 'next-roots'

export default function LocalizedStaticRouteWithDynamicMetaDataPage(props) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/static-route-with-dynamic-meta-data" },
    () => {
      {/* @ts-ignore */}
      return <OriginStaticRouteWithDynamicMetaDataPage {...props} locale={"cs"} />
    }
  )
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

test('should create page for [dynamic] route with generate static params and generateMetadata function', () => {
  const expectedOutput = `
import OriginBlogAuthorIdPage from '../../../../../roots/blog/[authorId]/page'
import { Router } from 'next-roots'

export default function LocalizedBlogAuthorIdPage({ params, ...otherProps }:any) {
  return Router.runWithContext(
    { locale: 'cs', pageHref: '/cs/magazin/:authorId', params },
    () => {
      {/* @ts-ignore */}
      return <OriginBlogAuthorIdPage {...otherProps} params={params} locale={"cs"} />
    }
  )
}

import { compileHref } from 'next-roots'
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

test('should create page with static viewport object', () => {
  const expectedOutput = `
import OriginStaticViewportPage from '..'
import { Router } from 'next-roots'

export default function LocalizedStaticViewportPage(props:any) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/static-viewport" },
    () => {
      {/* @ts-ignore */}
      return <OriginStaticViewportPage {...props} locale={"cs"} />
    }
  )
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
import OriginStaticRouteWithDynamicViewportPage from '..'
import { Router } from 'next-roots'

export default function LocalizedStaticRouteWithDynamicViewportPage(props) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/static-route-with-dynamic-viewport" },
    () => {
      {/* @ts-ignore */}
      return <OriginStaticRouteWithDynamicViewportPage {...props} locale={"cs"} />
    }
  )
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

test('should create page for [dynamic] route with generate static params and generateViewport function', () => {
  const expectedOutput = `
import OriginBlogAuthorIdPage from '../../../../../roots/blog/[authorId]/page'
import { Router } from 'next-roots'

export default function LocalizedBlogAuthorIdPage({ params, ...otherProps }:any) {
  return Router.runWithContext(
    { locale: 'cs', pageHref: '/cs/magazin/:authorId', params },
    () => {
      {/* @ts-ignore */}
      return <OriginBlogAuthorIdPage {...otherProps} params={params} locale={"cs"} />
    }
  )
}

import { compileHref } from 'next-roots'
import {generateViewport as generateViewportOrigin} from '../../../../../roots/blog/[authorId]/page'

export function generateViewport({ params, searchParams, ...otherProps }:any) {
  const getPageHref = async () => compileHref('/cs/magazin/:authorId', await params)
  return generateViewportOrigin({ ...otherProps, params, searchParams, locale: "cs", getPageHref })
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
      `export function generateViewport() {};export async function generateStaticParams() {}`,
  }

  const compile = compileFactory(inputConfig)
  const output = compile(inputRewrite)
  expect(output).toBe(expectedOutput)
})

test('should create page with route segment config', () => {
  const expectedOutput = `
import OriginRouteSegmentConfigPage from '..'
import { Router } from 'next-roots'

export default function LocalizedRouteSegmentConfigPage(props:any) {
  return Router.runWithContext(
    { locale: "cs", pageHref: "/cs/route-segment-config" },
    () => {
      {/* @ts-ignore */}
      return <OriginRouteSegmentConfigPage {...props} locale={"cs"} />
    }
  )
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
