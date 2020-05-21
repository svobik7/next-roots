import { Rewrite, LinkRewriteOptions } from './../types'

export function rewriteAs(root: string, options: LinkRewriteOptions) {
  const rewrite = options.rewrites.find((r) => r.root === root)
  console.log(rewrite)
}

export function rewriteHref(root: string, options: LinkRewriteOptions) {}
