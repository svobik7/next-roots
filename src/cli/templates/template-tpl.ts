import { getLocaleFactory } from '~/utils/locale-utils'
import { isTypedRewrite } from '~/utils/rewrite-utils'
import type { Config, Rewrite } from '../types'
import {
  type CompileParams,
  compileTemplateFactory,
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
    const getOriginName = getOriginNameFactory('template')
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
    const templateTpl = isTypedRewrite(rewrite) ? tpl : removePropTypes(tpl)

    const compileTemplate = compileTemplateFactory()
    return compileTemplate(templateTpl, params)
  }
}
