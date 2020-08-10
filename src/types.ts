import { ReactText } from 'react'

export type Config = {
  schemas: BuilderSchema[]
  locales: string[]
  shallowLocales: string[]
  defaultLocale: string
  defaultSuffix: string
  basePath: string
  dirRoots: string
  dirPages: string
  extRoots: string
  staticRoots: string[]
  useTypings: boolean
}

/**
 * BUILDER
 */
export type BuilderSchema = {
  root: string
  rootName?: string
  pages: BuilderSchemaPage[]
  metaData?: BuilderSchemaMeta[]
  params?: Record<string, string>
  isPrototype?: boolean
}

export type BuilderSchemaPage = {
  locale: string
  path: string
  alias: string
  suffix: string
}

export type BuilderSchemaMeta = {
  locale: string
  data?: Record<string, string | number | object>
}

/**
 * SCHEMA
 */
export type Schema = {
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: SchemaRule[]
  meta: SchemaMeta[]
}

export type SchemaRule = {
  key: string
  href: string
  as?: string
}

export type SchemaMeta = {
  key: string
  data: Record<string, string | number | object>
}

/**
 * REWRITE
 */
export type RewriteHrefOptions = {
  __rules: SchemaRule[]
  locale: string
}

export type RewriteAsOptions = RewriteHrefOptions & {
  params?: Record<string, string | string[]>
}

export type RewriteMetaDataOptions = {
  __meta: SchemaMeta[]
  strict?: boolean
}
