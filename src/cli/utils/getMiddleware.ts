import type { Middleware } from '~/types'
import { getOriginNameFactory } from '../templates/tpl-utils'
import type { Config, Rewrite } from '../types'
import { getRouteHref } from './getRoute'

function getMiddlewareHref(rewrite: Rewrite) {
  const routeHref = getRouteHref(rewrite)
  // remove everything after the last slash
  return routeHref.replace(/\/[^/]+$/, '')
}

function isMiddlewareRewrite({ originPath }: Rewrite): boolean {
  return (
    Boolean(originPath.match(/\/_middleware\.([tj])s?$/)) || originPath === '/'
  )
}

export function isMiddleware(input: unknown): input is Middleware {
  return Boolean(
    input && typeof input === 'object' && 'path' in input && 'href' in input
  )
}

export function getMiddleware(config: Config) {
  const { getRootAliasPath } = config
  return (rewrite: Rewrite): Middleware | undefined => {
    if (isMiddlewareRewrite(rewrite)) {
      const getOriginName = getOriginNameFactory('middleware')
      return {
        href: getMiddlewareHref(rewrite),
        path: getRootAliasPath(rewrite.localizedPath),
        originName: getOriginName(rewrite),
      }
    }

    return undefined
  }
}
