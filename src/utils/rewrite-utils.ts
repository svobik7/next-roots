import type { Rewrite } from '~/cli/types'

export function isPage(pathName: string) {
  return Boolean(pathName.match(/page\.([tj]sx?)$/))
}

export function isLayout(pathName: string) {
  return Boolean(pathName.match(/layout\.([tj]sx?)$/))
}

export function isTemplate(pathName: string) {
  return Boolean(pathName.match(/template\.([tj]sx?)$/))
}

export function isNotFound(pathName: string) {
  return Boolean(pathName.match(/not-found\.([tj]sx?)$/))
}

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
