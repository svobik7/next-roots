import type { Rewrite } from '~/cli/types'

export function isDynamicRewrite(rewrite: Rewrite) {
  return !!rewrite.originPath.match(/\[\w+\]/g)
}

export function isTypedRewrite(rewrite: Rewrite) {
  return !!rewrite.localizedPath.match(/\.tsx?$/g)
}
