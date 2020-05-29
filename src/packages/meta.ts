import { useContext } from 'react'
import { rewriteMetaData } from '../utils'
import RewritesContext from './context'

function useMetaRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(RewritesContext)

  return {
    data: (query: string = '*', key: string = '') =>
      rewriteMetaData(key || context.currentRule?.key || '*', query, {
        __meta: context.meta,
      }),
  }
}

export { useMetaRewrites }
