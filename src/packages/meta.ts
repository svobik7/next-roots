import { useContext } from 'react'
import { SchemaMetaData } from '../types'
import RootsContext from './context'

function useRootMeta() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    data: (
      query: string = '*',
      key: string = ''
    ): SchemaMetaData | Record<string, SchemaMetaData> | undefined => {
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
