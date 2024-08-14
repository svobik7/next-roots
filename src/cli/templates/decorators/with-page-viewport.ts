import type { Rewrite } from '~/cli/types'
import { isDynamicRewrite, isTypedRewrite } from '~/utils/rewrite-utils'
import { getPattern, removePropTypes ,type  DecoratorParams,type  CompileFn  } from '../tpl-utils';

export const PATTERNS = {
  originPath: getPattern('originPath'),
  pageHref: getPattern('pageHref'),
}

export const tplStatic = `
export { viewport } from '${PATTERNS.originPath}'
`

export const tplDynamicForStaticRoute = `
import {generateViewport as generateViewportOrigin} from '${PATTERNS.originPath}'

export function generateViewport({ searchParams, ...otherProps }:any) {
  return generateViewportOrigin({ ...otherProps, searchParams, pageHref: "${PATTERNS.pageHref}" })
}
`

export const tplDynamicForDynamicRoute = `
import {generateViewport as generateViewportOrigin} from '${PATTERNS.originPath}'

export function generateViewport({ params, searchParams, ...otherProps }:any) {
  return generateViewportOrigin({ ...otherProps, params, searchParams, pageHref: compileHref('${PATTERNS.pageHref}') })
}
`

export function withPageStaticMetaData(input: string) {
  return `${input}${tplStatic}`
}

export function withPageDynamicMetaDataFactory(rewrite: Rewrite) {
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
  if (params.getOriginContents().match(/export function generateViewport/g)) {
    return withPageDynamicMetaDataFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export const viewport/g)) {
    return withPageStaticMetaData
  }

  return (i: string) => i
}
