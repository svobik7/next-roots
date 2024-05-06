import type { Rewrite } from '~/cli/types'
import { isDynamicRewrite, isTypedRewrite } from '~/utils/rewrite-utils'
import {
  getPattern,
  removePropTypes,
  type DecoratorParams,
  type CompileFn,
} from '../tpl-utils'

export const PATTERNS = {
  originPath: getPattern('originPath'),
  pageHref: getPattern('pageHref'),
}

export const tplStatic = `
export { metadata } from '${PATTERNS.originPath}'
`

export const tplDynamicForStaticRoute = `
import {generateMetadata as generateMetadataOrigin} from '${PATTERNS.originPath}'

export async function generateMetadata(props:any) {
  {/* @ts-ignore */}
  return generateMetadataOrigin({ ...props, pageHref: "${PATTERNS.pageHref}" })
}
`

export const tplDynamicForDynamicRoute = `
import {generateMetadata as generateMetadataOrigin} from '${PATTERNS.originPath}'

export async function generateMetadata({ params, ...otherProps }:any) {
  {/* @ts-ignore */}
  return generateMetadataOrigin({ ...otherProps, params, pageHref: compileHref('${PATTERNS.pageHref}', params) })
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

export function withPageMetadataDecoratorFactory(
  params: DecoratorParams
): CompileFn {
  if (
    params.getOriginContents().match(/export async function generateMetadata/g)
  ) {
    return withPageDynamicMetaDataFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export const metadata/g)) {
    return withPageStaticMetaData
  }

  return (i: string) => i
}
