import { ReactText, useContext } from 'react'
import { rewriteMetaData } from '../utils'
import RootsContext from './context'

function useRootMeta() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    data: (
      query: string = '*',
      key: string = ''
    ): ReactText | Record<string, ReactText> | undefined =>
      rewriteMetaData(key || context.currentRule?.key || '*', query, {
        __meta: context.meta,
      }),
  }
}

export { useRootMeta }
