import { useContext } from 'react'
import RewritesContext from './context'
import { rewriteMetaData } from '../utils'

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
