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
export { metadata } from '${PATTERNS.originPath}'
`

export const tplDynamicForStaticRoute = `
import {generateMetadata as generateMetadataOrigin} from '${PATTERNS.originPath}'

export async function generateMetadata(props:any) {
  const getPageHref = () => "${PATTERNS.pageHref}"
  return generateMetadataOrigin({ ...props, locale: "${PATTERNS.pageLocale}", getPageHref })
}
`

export const tplDynamicForDynamicRoute = `
import { compileHref } from 'next-roots'
import {generateMetadata as generateMetadataOrigin} from '${PATTERNS.originPath}'

export async function generateMetadata({ params, ...otherProps }:any) {
  const getPageHref = async () => compileHref('${PATTERNS.pageHref}', await params)
  return generateMetadataOrigin({ ...otherProps, params, locale: "${PATTERNS.pageLocale}", getPageHref })
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
    params.getOriginContents().match(/export .+ generateMetadata/g)
  ) {
    return withPageDynamicMetaDataFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export .+ metadata/g)) {
    return withPageStaticMetaData
  }

  return (i: string) => i
}
