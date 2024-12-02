import type { Rewrite } from '~/cli/types'
import { isTypedRewrite } from '~/utils/rewrite-utils'
import {
  type CompileFn,
  type DecoratorParams,
  getPattern,
  removePropTypes,
} from '../tpl-utils'

export const PATTERNS = {
  originPath: getPattern('originPath'),
  locale: getPattern('locale'),
}

export const tplStatic = `
export { viewport } from '${PATTERNS.originPath}'
`

export const tplDynamic = `
import {generateViewport as generateViewportOrigin} from '${PATTERNS.originPath}'

export function generateViewport({ params, searchParams, ...otherProps }:any) {
  return generateViewportOrigin({ ...otherProps, params, searchParams, locale: "${PATTERNS.locale}" })
}
`

export function withLayoutStaticViewport(input: string) {
  return `${input}${tplStatic}`
}

export function withLayoutDynamicViewportFactory(rewrite: Rewrite) {
  return (input: string) => {
    let output = `${input}${tplDynamic}`

    if (!isTypedRewrite(rewrite)) {
      output = removePropTypes(output)
    }

    return output
  }
}

export function withLayoutViewportDecoratorFactory(
  params: DecoratorParams
): CompileFn {
  if (params.getOriginContents().match(/export function generateViewport/g)) {
    return withLayoutDynamicViewportFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export const viewport/g)) {
    return withLayoutStaticViewport
  }

  return (i: string) => i
}
