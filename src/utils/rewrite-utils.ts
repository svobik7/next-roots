import type { Rewrite } from '~/cli/types'
import {
  hasCatchAllSegment,
  hasDynamicSegment,
  hasOptionalCatchAllSegment,
} from '~/utils/dynamic-segment'

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
  return hasOptionalCatchAllSegment(rewrite.originPath)
}

export function isDynamicCatchAllRewrite(rewrite: Rewrite) {
  return hasCatchAllSegment(rewrite.originPath)
}

export function isDynamicRewrite(rewrite: Rewrite) {
  return (
    hasDynamicSegment(rewrite.originPath) ||
    isDynamicCatchAllRewrite(rewrite) ||
    isDynamicOptionalCatchAllRewrite(rewrite)
  )
}

export function isTypedRewrite(rewrite: Rewrite) {
  return !!rewrite.localizedPath.match(/\.tsx?$/g)
}
