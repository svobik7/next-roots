import { useRoots } from './context'

export type RootMetaHook = {
  data: <T>(query?: string, key?: string) => T | undefined
}

export function useRootMeta(): RootMetaHook {
  // use rewrite context for current locale and rules
  const roots = useRoots()

  return {
    data: <T = unknown>(query = '*', key = '') => {
      const meta =
        key && key !== roots.currentRule?.key
          ? roots.meta.find((m) => m.key === key)
          : roots.currentMeta

      if (query === '*') {
        return meta?.data as T
      }

      return meta?.data[query] as T
    },
  }
}
