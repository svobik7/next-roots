import type { RouterSchema } from '~/types'
import type { CompileParams } from './tpl-utils'
import { compileTemplateFactory, getPatternsFromNames } from './tpl-utils'

export const PATTERNS = getPatternsFromNames('schema')

export const tpl = `
module.exports = Object.freeze(${PATTERNS.schema});
`

function getCompileParams(
  schema: RouterSchema
): CompileParams<typeof PATTERNS> {
  return {
    schema: JSON.stringify(schema),
  }
}

export function compile(schema: RouterSchema) {
  const params = getCompileParams(schema)

  const compileTemplate = compileTemplateFactory()
  return compileTemplate(tpl, params)
}
