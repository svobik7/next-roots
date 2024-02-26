import type { Rewrite } from '~/cli/types'

export function isDynamicOptionalCatchAllRewrite(rewrite: Rewrite) {
  return !!rewrite.originPath.match(/\[\[\.\.\.\w+\]\]/g)
}

export function isDynamicCatchAllRewrite(rewrite: Rewrite) {
  return !!rewrite.originPath.match(/\[\.\.\.\w+\]/g)
}

export function isDynamicRewrite(rewrite: Rewrite) {
  return (
    !!rewrite.originPath.match(/\[\w+\]/g) ||
    isDynamicCatchAllRewrite(rewrite) ||
    isDynamicOptionalCatchAllRewrite(rewrite)
  )
}

export function isTypedRewrite(rewrite: Rewrite) {
  return !!rewrite.localizedPath.match(/\.tsx?$/g)
}
