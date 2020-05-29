import { createContext, useContext } from 'react'
import { RewriteMeta, RewriteRule } from '../types'

export type RewriteContext = {
  currentRule: RewriteRule | undefined
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: RewriteRule[]
  meta: RewriteMeta[]
}

const initialContext = {
  currentRule: undefined,
  currentLocale: '',
  defaultLocale: '',
  locales: [],
  rules: [],
  meta: [],
}

const RewritesContext = createContext<RewriteContext>(initialContext)
RewritesContext.displayName = 'RewritesContext'

function useRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(RewritesContext)

  return {
    locales: context.locales,
    defaultLocale: context.defaultLocale,
    currentLocale: context.currentLocale,
    currentRule: context.currentRule,
  }
}

export default RewritesContext
export { useRewrites }
