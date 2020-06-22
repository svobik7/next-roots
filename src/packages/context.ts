import { createContext, useContext } from 'react'
import { Roots } from '../types'

export type RootsContext = {
  currentRule: Roots.SchemaRule | undefined
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: Roots.SchemaRule[]
  meta: Roots.SchemaMeta[]
}

const initialContext = {
  currentRule: undefined,
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
    currentRule: context.currentRule,
  }
}

export default RootsContext
export { useRoots }
