import { useContext } from 'react'
import RootsContext from './context'

type MetaData = string | number | object

function useRootMeta() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    data: (
      query: string = '*',
      key: string = ''
    ): MetaData | Record<string, MetaData> | undefined => {
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
