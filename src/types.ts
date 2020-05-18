export type Rewrite = {
  root: string
  token: string
  params: RewriteParams[]
}

export type RewriteParams = {
  locale: string
  path: string
  suffix?: string
}
