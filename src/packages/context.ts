import { createContext, useContext } from 'react'
import { Schema, SchemaMeta, SchemaRule } from '../types'

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

export type RootsParsedPathname = {
  locale: string
  root: string
  rule: SchemaRule | undefined
}

function parsePathname(pathname: string, schema: Schema): RootsParsedPathname {
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
export { useRoots, detectRoots, parsePathname }
