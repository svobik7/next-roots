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
  let root = ''
  let locale = ''

  // detect current rule from router pathname
  const rule = schema.rules.find(
    (r) => r.as === pathname || r.href === pathname
  )

  // detect current root & locale from found rule
  if (rule) {
    const parsedKey = rule.key.split(':')

    root = parsedKey.length > 1 ? parsedKey[1] : parsedKey[0]
    locale = parsedKey.length > 1 ? parsedKey[0] : ''
  }

  // detect locale from pathname or use default
  if (!locale) {
    const [, pathLocale = ''] = pathname.split('/')

    locale = schema.locales.includes(pathLocale) ? pathLocale : ''
  }

  return {
    locale,
    root,
    rule,
  }
}
export default RootsContext
export { useRoots, parsePathname }
