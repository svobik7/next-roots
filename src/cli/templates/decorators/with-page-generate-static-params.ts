import { type CompileFn, type DecoratorParams, getPattern } from '../tpl-utils'

export const PATTERNS = {
  originPath: getPattern('originPath'),
  pageLocale: getPattern('pageLocale'),
}

export const tpl = `
import {generateStaticParams as generateStaticParamsOrigin} from '${PATTERNS.originPath}'

export async function generateStaticParams({ params, ...otherProps }:any) {
  return generateStaticParamsOrigin({ ...otherProps, params, pageLocale: "${PATTERNS.pageLocale}" })
}
`

export function withPageGenerateStaticParams(input: string) {
  return `${input}${tpl}`
}

export function withPageGenerateStaticParamsFactory(
  params: DecoratorParams
): CompileFn {
  if (
    params
      .getOriginContents()
      .match(/export async function generateStaticParams/g)
  ) {
    return withPageGenerateStaticParams
  }

  return (i: string) => i
}
