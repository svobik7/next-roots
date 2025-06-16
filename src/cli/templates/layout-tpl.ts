import { getLocaleFactory } from '~/utils/locale-utils'
import { isTypedRewrite } from '~/utils/rewrite-utils'
import type { Config, Rewrite } from '../types'
import { withLayoutGenerateStaticParamsFactory } from './decorators/with-layout-generate-static-params'
import { withLayoutMetadataDecoratorFactory } from './decorators/with-layout-metadata'
import { withLayoutViewportDecoratorFactory } from './decorators/with-layout-viewport'
import { withRouteSegmentConfigFactory } from './decorators/with-route-segment-config'
import {
  type CompileParams,
  compileTemplateFactory,
  DecoratorParams,
  getOriginNameFactory,
  getOriginPathFactory,
  getPatternsFromNames,
  removePropTypes,
} from './tpl-utils'

export const PATTERNS = getPatternsFromNames(
  'originName',
  'originPath',
  'locale'
)

export const tpl = `
import Origin${PATTERNS.originName} from '${PATTERNS.originPath}'

export default function Localized${PATTERNS.originName}(props:any) {
  {/* @ts-ignore */}
  return <Origin${PATTERNS.originName} {...props} locale="${PATTERNS.locale}" />
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
      withLayoutViewportDecoratorFactory(decoratorParams),
      withLayoutGenerateStaticParamsFactory(decoratorParams)
    )

    return compileTemplate(layoutTpl, params)
  }
}
