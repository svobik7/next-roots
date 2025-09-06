import { type CompileFn, type DecoratorParams, getPattern } from '../tpl-utils'

const CONFIG_VARIABLES = [
  'dynamic',
  'dynamicParams',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
] as const

type ConfigVariable = (typeof CONFIG_VARIABLES)[number]

const REG_EXPS: Record<ConfigVariable, RegExp> = {
  dynamic: /export .+ dynamic/,
  dynamicParams: /export .+ dynamicParams/,
  revalidate: /export .+ revalidate/,
  fetchCache: /export .+ fetchCache/,
  runtime: /export .+ runtime/,
  preferredRegion: /export .+ preferredRegion/,
}

function getExistingConfigVariables(input: string): ConfigVariable[] {
  return CONFIG_VARIABLES.filter((variable) => REG_EXPS[variable].test(input))
}

function createReExportTemplate(
  configVariables: ConfigVariable[],
  originPath: string
) {
  if (configVariables.length === 0) {
    return ''
  }

  const exportList = configVariables.join(', ')
  return `
export { ${exportList} } from '${originPath}'
`
}

export function withRouteSegmentConfigFactory(
  params: DecoratorParams
): CompileFn {
  const originContents = params.getOriginContents()
  const existingConfigVariables = getExistingConfigVariables(originContents)
  const originPath = getPattern('originPath')
  const reExportTemplate = createReExportTemplate(
    existingConfigVariables,
    originPath
  )

  return (input: string) =>
    reExportTemplate === '' ? input : `${input}${reExportTemplate}`
}
