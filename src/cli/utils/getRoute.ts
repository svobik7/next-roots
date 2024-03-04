import type { Route } from '~/types'
import { asRootPath } from '~/utils/path-utils'
import { pipe } from '~/utils/pipe-utils'
import type { Rewrite } from '../types'

function extractLocaleSegment(input: string) {
  const localeSegment = input.match(/\/[(\w-)]+/)?.[0]
  return localeSegment?.replace(/\/\([\w-]+\)/, '') || ''
}

function removeLocaleSegment(input: string) {
  return input.replace(/\/[(\w-)]+/, '')
}

function removePageSegment(input: string) {
  return input.replace(/\/page\.([tj])sx?$/, '')
}

function removeGroupSegments(input: string) {
  return input.replace(/\/\([\w-]+\)/g, '')
}

function removeParallelSegments(input: string) {
  return input.replace(/\/@\w+/g, '')
}

function removeInterceptedSegments(input: string) {
  let result = input.replace(/\(\.\)/g, '')
  const twoDotsRegExp = /[[\w-\]]+\/\(\.{2}\)/g
  while (twoDotsRegExp.test(result)) {
    result = result.replace(twoDotsRegExp, '')
  }
  return result.replace(/.*\(\.{3}\)/g, '/')
}

function formatDynamicSegments(input: string) {
  return input
    .replace(/\/\[\[\.\.\.(\w+)\]\]/g, '/:$1*') // [[...slug]] -> :slug*
    .replace(/\/\[\[(\w+)\]\]/g, '/:$1*') // [[slug]] -> :slug*
    .replace(/\/\[\.\.\.(\w+)\]/g, '/:$1+') // [...slug] -> :slug+
    .replace(/\/\[(\w+)\]/g, '/:$1') // [slug] -> :slug
}

function getRouteName({ originPath }: Rewrite) {
  const formatRouteName = pipe(
    removePageSegment,
    removeGroupSegments,
    removeParallelSegments,
    removeInterceptedSegments
  )
  return asRootPath(formatRouteName(originPath))
}

function getRouteHref({ localizedPath }: Rewrite) {
  const localeSegment = extractLocaleSegment(localizedPath)
  const formatRouteHref = pipe(
    removeLocaleSegment,
    removePageSegment,
    removeGroupSegments,
    removeParallelSegments,
    removeInterceptedSegments,
    formatDynamicSegments
  )
  return asRootPath(localeSegment, formatRouteHref(localizedPath))
}

function isRouteRewrite({ originPath }: Rewrite): boolean {
  return Boolean(originPath.match(/\/page\.([tj])sx?$/)) || originPath === '/'
}

export function isRoute(input: unknown): input is Route {
  return Boolean(
    input && typeof input === 'object' && 'name' in input && 'href' in input
  )
}

export function getRoute(rewrite: Rewrite): Route | undefined {
  if (isRouteRewrite(rewrite)) {
    return {
      name: getRouteName(rewrite),
      href: getRouteHref(rewrite),
    }
  }

  return undefined
}
