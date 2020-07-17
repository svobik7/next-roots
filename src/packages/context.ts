import { createContext, useContext } from 'react'
import { SchemaMeta, SchemaRule } from '../types'

export type RootsContext = {
  locales: string[]
  rules: SchemaRule[]
  meta: SchemaMeta[]
  // default values
  defaultLocale: string
  // current values
  currentRoot: string
  currentLocale: string
  currentRule: SchemaRule | undefined
  currentMeta: SchemaMeta | undefined
}

const initialContext: RootsContext = {
  locales: [],
  rules: [],
  meta: [],
  // default values
  defaultLocale: '',
  // current values
  currentRoot: '',
  currentRule: undefined,
  currentLocale: '',
  currentMeta: undefined,
}

const RootsContext = createContext<RootsContext>(initialContext)
RootsContext.displayName = 'RootsContext'

function useRoots() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    locales: context.locales,
    // default values
    defaultLocale: context.defaultLocale,
    // current values
    currentRoot: context.currentRoot,
    currentLocale: context.currentLocale,
    currentRule: context.currentRule,
    currentMeta: context.currentMeta,
  }
}

function detectRoots(
  Component: any,
  initial: Partial<RootsContext> = initialContext
): RootsContext {
  let context = {
    ...initialContext,
    ...initial,
  }

  if (typeof Component.getRootsContext === 'function') {
    const ctxComponent = Component.getRootsContext()

    context = {
      ...context,
      ...ctxComponent,
      meta: [...context.meta, ...(ctxComponent.meta || [])],
      rules: [...context.rules, ...(ctxComponent.rules || [])],
    }
  }

  return context
}

export default RootsContext
export { useRoots, detectRoots }
