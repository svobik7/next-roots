import { createContext } from 'react'
import { RewriteMeta, RewriteRule } from './types'

const initialContext: RewriteContext = {
  currentRule: undefined,
  currentLocale: '',
  defaultLocale: '',
  locales: [],
  rules: [],
  meta: [],
}

export type RewriteContext = {
  currentRule: RewriteRule | undefined
  currentLocale: string
  defaultLocale: string
  locales: string[]
  rules: RewriteRule[]
  meta: RewriteMeta[]
}

const context = createContext(initialContext)
context.displayName = 'RewritesContext'

export default context
