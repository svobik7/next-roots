export type Config = {
  locales: string[]
  defaultLocale: string
  defaultSuffix: string
  dirRoots: string
  dirPages: string
  rewrites: Rewrite[]
}

/**
 * ---
 * REWRITE
 * ---
 */
export type Rewrite = {
  root: string
  pages: RewritePage[]
  params: RewriteParam[]
}

export type RewritePage = {
  locale: string
  path: string
  suffix?: string
}

export type RewriteParam = {
  name: string
  value: string
}

/**
 * ---
 * REWRITE TABLE
 * ---
 */
export type RewriteTableOptions = { defaultSuffix?: string }

export type RewriteTable = RewriteTableRule[]

export type RewriteTableRule = {
  ID: string
  href: string
  as: string
}

/**
 * ---
 * REWRITE LINK
 * ---
 */
export type RewriteLinkOptions = {
  __rewriteTable: RewriteTable
  locale: string
}
