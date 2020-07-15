import { createContext, useContext } from 'react'
import { SchemaMeta, SchemaRule } from '../types'

export type RootsContext = {
  currentRule: SchemaRule | undefined
  currentRoot: string
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: SchemaRule[]
  meta: SchemaMeta[]
}

const initialContext: RootsContext = {
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
