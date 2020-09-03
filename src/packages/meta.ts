import { useContext } from 'react'
import RootsContext from './context'

function useRootMeta() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    data: <T = unknown>(
      query: string = '*',
      key: string = ''
    ): T | undefined => {
      const meta =
        key && key !== context.currentRule?.key
          ? context.meta.find((m) => m.key === key)
          : context.currentMeta

      if (query === '*') {
        return meta?.data as T
      }

      return meta?.data[query] as T
    },
  }
}

export { useRootMeta }
