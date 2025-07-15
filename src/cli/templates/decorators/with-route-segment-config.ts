import {
  type CompileFn,
  type DecoratorParams,
  getPattern,
  getPatternsFromNames,
} from '../tpl-utils'

const PATTERNS = getPatternsFromNames(
  'dynamic',
  'dynamicParams',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
  'experimental_ppr',
  'maxDuration'
)

type ConfigVariable = keyof typeof PATTERNS

const TEMPLATES: Record<ConfigVariable, string> = {
  dynamic: `export const dynamic = ${PATTERNS.dynamic}
`,
  dynamicParams: `export const dynamicParams = ${PATTERNS.dynamicParams}
`,
  revalidate: `export const revalidate = ${PATTERNS.revalidate}
`,
  fetchCache: `export const fetchCache = ${PATTERNS.fetchCache}
`,
  runtime: `export const runtime = ${PATTERNS.runtime}
`,
  preferredRegion: `export const preferredRegion = ${PATTERNS.preferredRegion}
`,
  experimental_ppr: `export const experimental_ppr = ${PATTERNS.experimental_ppr}
`,
  maxDuration: `export const maxDuration = ${PATTERNS.maxDuration}
`,
}

const REG_EXPS: Record<ConfigVariable, RegExp> = {
  dynamic: /export const dynamic = (.*)/,
  dynamicParams: /export const dynamicParams = (.*)/,
  revalidate: /export const revalidate = (.*)/,
  fetchCache: /export const fetchCache = (.*)/,
  runtime: /export const runtime = (.*)/,
  preferredRegion: /export const preferredRegion = (.*)/,
  experimental_ppr: /export const experimental_ppr = (.*)/,
  maxDuration: /export const maxDuration = (.*)/,
}

function getCompileParams(input: string) {
  return Object.entries(REG_EXPS).reduce(
    (params, [variable, regExp]) => {
      params[variable as ConfigVariable] = input.match(regExp)?.[1]
      return params
    },
    {} as Record<ConfigVariable, string | undefined>
  )
}

function compileConfigVariableTemplate(
  variable: ConfigVariable,
  value: string
) {
  return TEMPLATES[variable].replace(getPattern(variable), value)
}

function compileConfigTemplateFactory(
  params: Record<ConfigVariable, string | undefined>
) {
  const config = Object.entries(params).reduce((output, [variable, value]) => {
    if (!value) return output
    return `${output}${compileConfigVariableTemplate(
      variable as ConfigVariable,
      value
    )}`
  }, '')
  return (input: string) =>
    config === ''
      ? input
      : `${input}
${config}`
}

export function withRouteSegmentConfigFactory(
  params: DecoratorParams
): CompileFn {
  const compileParams = getCompileParams(params.getOriginContents())
  return compileConfigTemplateFactory(compileParams)
}
