import { createContext, useContext } from 'react'
import { Roots } from '../types'

export type RootsContext = {
  currentRule: Roots.SchemaRule | undefined
  currentRoot: string
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: Roots.SchemaRule[]
  meta: Roots.SchemaMeta[]
}

const initialContext = {
  currentRule: undefined,
  currentRoot: '',
  currentLocale: '',
  defaultLocale: '',
  locales: [],
  rules: [],
  meta: [],
}

const RootsContext = createContext<RootsContext>(initialContext)
RootsContext.displayName = 'RootsContext'

function useRoots() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    locales: context.locales,
    defaultLocale: context.defaultLocale,
    currentLocale: context.currentLocale,
    currentRoot: context.currentRoot,
    currentRule: context.currentRule,
  }
}

function parsePathname(pathname: string, schema: Roots.Schema) {
  // detect current locale from router pathname
  const [, pathLocale] = pathname.split('/')

  // detect current rule from router pathname
  const schemaRule = schema.rules.find(
    (r) => r.as === pathname || r.href === pathname
  )

  // NOTE:
  // can I use this instead of condition below?
  // const [pathRoot] = decodeSchemaRuleKey(schemaRule?.key || '')
  // !! consider package size !!

  let pathRoot = ''

  if (schemaRule) {
    // detect current root from router pathname
    const parsedKey = schemaRule.key.split(':')
    pathRoot = parsedKey.length > 1 ? parsedKey[1] : parsedKey[0]
  }

  return {
    currentLocale: pathLocale,
    currentRoot: pathRoot,
    currentRule: schemaRule,
  }
}
export default RootsContext
export { useRoots, parsePathname }
