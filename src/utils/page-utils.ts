import { Config } from 'types'

/**
 * Parses configuration rewrites & ensure all required params are set
 * @param object cfg
 */
export function parseRewrites(cfg: Config, debug: boolean = false) {
  const { locales, rewrites, defaultSuffix } = cfg

  return rewrites.map((r) => ({
    ...r,
    pages: locales.map((l) => {
      // find rewrite param based on locale
      let page = r.pages.find((p) => p.locale === l || p.locale === '*')

      // create no rewrite for current locale when page is undefined
      if (!page && debug) {
        // import('colors').then((colors) => {
        //   console.log(
        //     colors.red('warn'),
        //     `- rewrite rule for`,
        //     colors.red(`${l}:${r.root}`),
        //     'is missing!'
        //   )
        // })
      }

      const suffix = page && page.suffix

      return {
        locale: l,
        path: page ? page.path : r.root,
        suffix: suffix ?? defaultSuffix,
      }
    }),
  }))
}
