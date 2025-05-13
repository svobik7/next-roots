import { type CompileFn, type DecoratorParams, getPattern } from '../tpl-utils'

export const PATTERNS = {
  originPath: getPattern('originPath'),
  locale: getPattern('locale'),
}

export const tpl = `
import {generateStaticParams as generateStaticParamsOrigin} from '${PATTERNS.originPath}'

export async function generateStaticParams({ params, ...otherProps }:any) {
  return generateStaticParamsOrigin({ ...otherProps, params, locale: "${PATTERNS.locale}" })
}
`

export function withLayoutGenerateStaticParams(input: string) {
  return `${input}${tpl}`
}

export function withLayoutGenerateStaticParamsFactory(
  params: DecoratorParams
): CompileFn {
  if (
    params
      .getOriginContents()
      .match(/export .+ generateStaticParams/g)
  ) {
    return withLayoutGenerateStaticParams
  }

  return (i: string) => i
}
