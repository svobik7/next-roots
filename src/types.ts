import { ReactText } from 'react'

export type Config = {
  locales: string[]
  defaultLocale: string
  defaultSuffix: string
  dirRoots: string
  dirPages: string
  rewrites: Rewrite[]
  extRoots: string
  staticRoots: string[]
}

/**
 * ---
 * REWRITE
 * ---
 */
export type Rewrite = {
  root: string
  pages: RewritePage[]
  params: Record<string, string>
  metaData?: RewriteMeta['data']
}

export type RewritePage = {
  locale: string
  path: string
  alias: string
  suffix: string
  metaData?: RewriteMeta['data']
}

/**
 * ---
 * REWRITE RULE
 * ---
 */
export type RewriteRule = {
  key: string
  href: string
  as?: string
}

/**
 * ---
 * REWRITE META
 * ---
 */
export type RewriteMeta = {
  key: string
  data: Record<string, ReactText>
}

export type RewriteMetaDataOptions = {
  __meta: RewriteMeta[]
  strict?: boolean
}

/**
 * ---
 * REWRITE LINK
 * ---
 */
export type RewriteLinkOptions = {
  __rules: RewriteRule[]
  locale: string
  strict?: boolean
}
