import { AppProps } from 'next/app'
import { createContext, useContext } from 'react'
import { SchemaMeta, SchemaRule } from '../types'

type Roots = {
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

const initialContext: Roots = {
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

const RootsContext = createContext<Roots>(initialContext)
RootsContext.displayName = 'RootsContext'

function useRoots(): Roots {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    locales: context.locales,
    rules: context.rules,
    meta: context.meta,
    // - default values
    defaultLocale: context.defaultLocale,
    // - current values
    currentRoot: context.currentRoot,
    currentLocale: context.currentLocale,
    currentRule: context.currentRule,
    currentMeta: context.currentMeta,
  }
}

function detectRoots(
  appProps: AppProps,
  initial: Partial<Roots> = initialContext
): Roots {
  const { router } = appProps

  let context = {
    ...initialContext,
    ...initial,
  }

  // re-type component to suppress TS errors about getRoots method
  const Component = appProps.Component as AppProps['Component'] & {
    getRoots: () => Roots
  }

  if (Component && typeof Component.getRoots === 'function') {
    const ctxComponent = Component.getRoots()

    return {
      ...context,
      ...ctxComponent,
      meta: [...context.meta, ...(ctxComponent.meta || [])],
      rules: [...context.rules, ...(ctxComponent.rules || [])],
    }
  }

  const currentLocale = router.asPath
    .split('/')
    .find((l) => l && context.locales.includes(l))

  // use 404 context when page has not getRoots method defined
  return {
    ...context,
    currentLocale: currentLocale || context.defaultLocale,
  }
}

export { Roots, RootsContext, detectRoots, useRoots }
