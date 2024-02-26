import { getLocaleFactory } from '~/utils/locale-utils'
import { isDynamicRewrite, isTypedRewrite } from '~/utils/rewrite-utils'
import { CompileError } from '../errors'
import type { Config, Rewrite } from '../types'
import { getRoute } from '../utils/getRoute'
import { withPageGenerateStaticParamsFactory ,type  PATTERNS as GENERATE_STATIC_PARAMS_PATTERS  } from './decorators/with-page-generate-static-params';
import { withPageMetadataDecoratorFactory } from './decorators/with-page-metadata'
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
  'pageHref'
)

export const tplStatic = `
import ${PATTERNS.originName}Origin from '${PATTERNS.originPath}'
import { Router } from 'next-roots'

export default function ${PATTERNS.originName}(props:any) {
  Router.setPageHref("${PATTERNS.pageHref}")
  {/* @ts-ignore */}
  return <${PATTERNS.originName}Origin {...props} pageHref={Router.getPageHref()} />
}
`

export const tplDynamic = `
import ${PATTERNS.originName}Origin from '${PATTERNS.originPath}'
import { Router, compileHref } from 'next-roots'

export default function ${PATTERNS.originName}({ params, ...otherProps }:any) {
  Router.setPageHref(compileHref('${PATTERNS.pageHref}', params))
  {/* @ts-ignore */}
  return <${PATTERNS.originName}Origin {...otherProps} params={params} pageHref={Router.getPageHref()} />
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
      withPageMetadataDecoratorFactory(decoratorParams),
      withPageGenerateStaticParamsFactory(decoratorParams),
      withRouteSegmentConfigFactory(decoratorParams)
    )

    return compileTemplate(pageTpl, params)
  }
}
