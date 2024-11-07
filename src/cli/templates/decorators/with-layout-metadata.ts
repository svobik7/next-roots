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
export { metadata } from '${PATTERNS.originPath}'
`

export const tplDynamic = `
import {generateMetadata as generateMetadataOrigin} from '${PATTERNS.originPath}'

export async function generateMetadata(props:any) {
  return generateMetadataOrigin({ ...props, locale: "${PATTERNS.locale}" })
}
`

export function withLayoutStaticMetaData(input: string) {
  return `${input}${tplStatic}`
}

export function withLayoutDynamicMetaDataFactory(rewrite: Rewrite) {
  return (input: string) => {
    let output = `${input}${tplDynamic}`

    if (!isTypedRewrite(rewrite)) {
      output = removePropTypes(output)
    }

    return output
  }
}

export function withLayoutMetadataDecoratorFactory(
  params: DecoratorParams
): CompileFn {
  if (
    params.getOriginContents().match(/export async function generateMetadata/g)
  ) {
    return withLayoutDynamicMetaDataFactory(params.getRewrite())
  }

  if (params.getOriginContents().match(/export const metadata/g)) {
    return withLayoutStaticMetaData
  }

  return (i: string) => i
}
