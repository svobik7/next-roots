import { createContext } from 'react'
import { RewriteTable } from 'types'

const initialContext: RewriteContext = {
  currentLocale: '',
  defaultLocale: '',
  defaultSuffix: '',
  locales: [],
  __table: [],
}

export type RewriteContext = {
  currentLocale: string
  defaultLocale: string
  defaultSuffix: string
  locales: string[]
  __table: RewriteTable
}

export default createContext(initialContext)
