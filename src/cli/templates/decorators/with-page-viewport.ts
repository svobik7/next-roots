import type { Rewrite } from '~/cli/types'
import { isDynamicRewrite, isTypedRewrite } from '~/utils/rewrite-utils'
import {
  type CompileFn,
  type DecoratorParams,
  getPattern,
  removePropTypes,
} from '../tpl-utils'

export const PATTERNS = {
  originPath: getPattern('originPath'),
  pageHref: getPattern('pageHref'),
  pageLocale: getPattern('pageLocale'),
}

export const tplStatic = `
export { viewport } from '${PATTERNS.originPath}'
`

export const tplDynamicForStaticRoute = `
import {generateViewport as generateViewportOrigin} from '${PATTERNS.originPath}'

export function generateViewport({ searchParams, ...otherProps }:any) {
  const getPageHref = () => "${PATTERNS.pageHref}"
  return generateViewportOrigin({ ...otherProps, searchParams, locale: "${PATTERNS.pageLocale}", getPageHref })
}
`

export const tplDynamicForDynamicRoute = `
import { compileHref } from 'next-roots'
import {generateViewport as generateViewportOrigin} from '${PATTERNS.originPath}'

export function generateViewport({ params, searchParams, ...otherProps }:any) {
  const getPageHref = async () => compileHref('${PATTERNS.pageHref}', await params)
  return generateViewportOrigin({ ...otherProps, params, searchParams, locale: "${PATTERNS.pageLocale}", getPageHref })
}
`

export function withPageStaticViewport(input: string) {
  return `${input}${tplStatic}`
}

export function withPageDynamicViewportFactory(rewrite: Rewrite) {
  return (input: string) => {
    let output = `${input}${
      isDynamicRewrite(rewrite)
        ? tplDynamicForDynamicRoute
        : tplDynamicForStaticRoute
    }`

    if (!isTypedRewrite(rewrite)) {
      output = removePropTypes(output)
    }

    return output
  }
}

export function withPageViewportDecoratorFactory(
  params: DecoratorParams
): CompileFn {
  if (params.getOriginContents().match(/export .+ generateViewport/g)) {
    return withPageDynamicViewportFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export .+ viewport/g)) {
    return withPageStaticViewport
  }

  return (i: string) => i
}
