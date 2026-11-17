import { getLocaleFactory } from '~/utils/locale-utils'
import { isDynamicRewrite, isTypedRewrite } from '~/utils/rewrite-utils'
import { CompileError } from '../errors'
import type { Config, Rewrite } from '../types'
import { getRoute } from '../utils/getRoute'
import { withDirectivesDecoratorFactory } from './decorators/with-directives'
import {
  type PATTERNS as GENERATE_STATIC_PARAMS_PATTERS,
  withPageGenerateStaticParamsFactory,
} from './decorators/with-page-generate-static-params'
import { withPageMetadataDecoratorFactory } from './decorators/with-page-metadata'
import { withPageViewportDecoratorFactory } from './decorators/with-page-viewport'
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
  'originPath',
  'originName',
  'pageHref',
  'pageLocale'
)

export const tplStatic = `
import Origin${PATTERNS.originName} from '${PATTERNS.originPath}'
import { Router } from 'next-roots'

export default function Localized${PATTERNS.originName}(props:any) {
  return Router.runWithContext(
    { locale: "${PATTERNS.pageLocale}", pageHref: "${PATTERNS.pageHref}" },
    () => {
      {/* @ts-ignore */}
      return <Origin${PATTERNS.originName} {...props} locale={"${PATTERNS.pageLocale}"} />
    }
  )
}
`

export const tplDynamic = `
import Origin${PATTERNS.originName} from '${PATTERNS.originPath}'
import { Router } from 'next-roots'

export default function Localized${PATTERNS.originName}({ params, ...otherProps }:any) {
  return Router.runWithContext(
    { locale: '${PATTERNS.pageLocale}', pageHref: '${PATTERNS.pageHref}', params },
    () => {
      {/* @ts-ignore */}
      return <Origin${PATTERNS.originName} {...otherProps} params={params} locale={"${PATTERNS.pageLocale}"} />
    }
  )
}
`

function getCompileParamsFactory(config: Config) {
  return (
    rewrite: Rewrite
  ): CompileParams<typeof PATTERNS & typeof GENERATE_STATIC_PARAMS_PATTERS> => {
    const route = getRoute(rewrite)

    if (!route) {
      throw new CompileError('Given rewrite is not a page route rewrite.')
    }

    const getOriginPath = getOriginPathFactory(config)
    const getOriginName = getOriginNameFactory('page')
    const getLocale = getLocaleFactory({
      defaultLocale: config.defaultLocale,
      locales: config.locales,
    })

    return {
      originPath: getOriginPath(rewrite),
      originName: getOriginName(rewrite),
      pageLocale: getLocale(rewrite.localizedPath),
      pageHref: route.href,
    }
  }
}

export function compileFactory(config: Config) {
  const getCompileParams = getCompileParamsFactory(config)

  return (rewrite: Rewrite) => {
    let pageTpl = isDynamicRewrite(rewrite) ? tplDynamic : tplStatic
    pageTpl = isTypedRewrite(rewrite) ? pageTpl : removePropTypes(pageTpl)

    const params = getCompileParams(rewrite)

    const originContents = config.getOriginContents(rewrite.originPath)
    const decoratorParams = new DecoratorParams(rewrite, originContents)

    const compileTemplate = compileTemplateFactory(
      withDirectivesDecoratorFactory(decoratorParams),
      withPageMetadataDecoratorFactory(decoratorParams),
      withPageViewportDecoratorFactory(decoratorParams),
      withPageGenerateStaticParamsFactory(decoratorParams),
      withRouteSegmentConfigFactory(decoratorParams)
    )

    return compileTemplate(pageTpl, params)
  }
}
