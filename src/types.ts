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
  params: Record<string, string>
}

export type RewritePage = {
  locale: string
  path: string
  alias?: string
  suffix?: string
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
