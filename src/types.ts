import { ReactText } from 'react'

export namespace Roots {
  export type Config = {
    schemas: Builder[]
    locales: string[]
    defaultLocale: string
    defaultSuffix: string
    dirRoots: string
    dirPages: string
    extRoots: string
    staticRoots: string[]
  }

  /**
   * BUILDER
   */
  export type Builder = {
    root: string
    pages: BuilderPage[]
    params: Record<string, string>
    metaData?: SchemaMeta['data']
  }

  export type BuilderPage = {
    locale: string
    path: string
    alias: string
    suffix: string
    metaData?: SchemaMeta['data']
  }

  /**
   * SCHEMA
   */
  export type Schema = {
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
    data: Record<string, ReactText>
  }

  /**
   * REWRITE
   */
  export type RewriteLinkOptions = {
    __rules: SchemaRule[]
    locale: string
    params?: Record<string, string | number>
  }

  export type RewriteMetaDataOptions = {
    __meta: SchemaMeta[]
    strict?: boolean
  }
}
