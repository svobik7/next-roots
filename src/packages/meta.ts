import { ReactText, useContext } from 'react'
import RootsContext from './context'

function useRootMeta() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    data: (
      query: string = '*',
      key: string = ''
    ): ReactText | Record<string, ReactText> | undefined => {
      const meta =
        key && key !== context.currentRule?.key
          ? context.meta.find((m) => m.key === key)
          : context.currentMeta

      if (query === '*') {
        return meta?.data
      }

      return meta?.data[query]
    },
  }
}

export { useRootMeta }
