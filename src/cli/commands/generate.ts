import { queue } from '~/utils/queue-utils'
import { generateDeclarationFileFactory } from '../generators/generateDeclarationFile'
import { generateLocalizedFilesFactory } from '../generators/generateLocalizedFiles'
import { generateRouterSchemaFileFactory } from '../generators/generateRouterSchemaFile'
import type { Config } from '../types'
import { getOrigins } from '../utils/getOrigins'
import { getRewritesFactory } from '../utils/getRewrites'
import { getRoute, isRoute } from '../utils/getRoute'
import { getRouterSchema } from '../utils/getRouterSchema'

export function generateFactory(config: Config) {
  const { defaultLocale, locales, getOriginAbsolutePath } = config

  const generateLocalizedFiles = generateLocalizedFilesFactory(config)
  const generateDeclarationFile = generateDeclarationFileFactory(config)
  const generateRouterFile = generateRouterSchemaFileFactory(config)

  const getRewrites = getRewritesFactory(config)

  return async () => {
    const startTime = process.hrtime()

    const origins = await getOrigins({
      locales,
      defaultLocale,
      dirName: getOriginAbsolutePath(),
    })

    const rewrites = origins.flatMap(getRewrites)
    const routes = rewrites.flatMap(getRoute).filter(isRoute)

    const routerSchema = getRouterSchema({ routes, defaultLocale, locales })

    const execute = queue<void>(
      () => generateLocalizedFiles(rewrites),
      () => generateDeclarationFile(routerSchema),
      () => generateRouterFile(routerSchema),
      // keep this as last to make sure all files are written before calling
      () =>
        config.afterGenerate?.({
          config,
          origins,
          rewrites,
          routes,
          routerSchema,
        }),

      () => {
        const endTime = process.hrtime(startTime)
        const timeDiffInMs = (endTime[0] * 1e9 + endTime[1]) / 1e6 // Convert nanoseconds to milliseconds

        // eslint-disable-next-line no-console
        console.log(
          `\x1b[32mnext-roots\x1b[37m - generated ${routes.length} localized routes in ${timeDiffInMs.toFixed(2)}ms`
        )
      }
    )

    return execute()
  }
}
