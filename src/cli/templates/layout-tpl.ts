import { getLocaleFactory } from '~/utils/locale-utils'
import { isTypedRewrite } from '~/utils/rewrite-utils'
import type { Config, Rewrite } from '../types'
import { withLayoutMetadataDecoratorFactory } from './decorators/with-layout-metadata'
import { withLayoutGenerateStaticParamsFactory } from './decorators/with-layout-generate-static-params'
import { withRouteSegmentConfigFactory } from './decorators/with-route-segment-config'
import {
  type CompileParams,
  DecoratorParams,
  removePropTypes,

  compileTemplateFactory,
  getOriginNameFactory,
  getOriginPathFactory,
  getPatternsFromNames} from './tpl-utils'

export const PATTERNS = getPatternsFromNames(
  'originName',
  'originPath',
  'locale'
)

export const tpl = `
import ${PATTERNS.originName}Origin from '${PATTERNS.originPath}'

export default function ${PATTERNS.originName}(props:any) {
  {/* @ts-ignore */}
  return <${PATTERNS.originName}Origin {...props} locale="${PATTERNS.locale}" />
}
`

function getCompileParams(config: Config) {
  return (rewrite: Rewrite): CompileParams<typeof PATTERNS> => {
    const getOriginPath = getOriginPathFactory(config)
    const getOriginName = getOriginNameFactory('layout')
    const getLocale = getLocaleFactory({
      defaultLocale: config.defaultLocale,
      locales: config.locales,
    })

    return {
      originPath: getOriginPath(rewrite),
      originName: getOriginName(rewrite),
      locale: getLocale(rewrite.localizedPath),
    }
  }
}

export function compileFactory(config: Config) {
  const getParams = getCompileParams(config)
  return (rewrite: Rewrite) => {
    const params = getParams(rewrite)
    const layoutTpl = isTypedRewrite(rewrite) ? tpl : removePropTypes(tpl)

    const originContents = config.getOriginContents(rewrite.originPath)
    const decoratorParams = new DecoratorParams(rewrite, originContents)

    const compileTemplate = compileTemplateFactory(
      withRouteSegmentConfigFactory(decoratorParams),
      withLayoutMetadataDecoratorFactory(decoratorParams),
      withLayoutGenerateStaticParamsFactory(decoratorParams)
    )

    return compileTemplate(layoutTpl, params)
  }
}
