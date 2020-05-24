import { createContext } from 'react'
import { Rewrite } from 'types'

const initialContext: RewriteContext = {
  currentLocale: '',
  defaultLocale: '',
  defaultSuffix: '',
  locales: [],
  rewrites: [],
}

export type RewriteContext = {
  currentLocale: string
  defaultLocale: string
  defaultSuffix: string
  locales: string[]
  rewrites: Rewrite[]
}

export default createContext(initialContext)
