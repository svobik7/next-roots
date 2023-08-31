import { queue } from '~/utils/queue-utils'
import { generateDeclarationFileFactory } from '../generators/generateDeclarationFile'
import { generateLocalizedFilesFactory } from '../generators/generateLocalizedFiles'
import { generateMiddlewareFileFactory } from '../generators/generateMiddlewareFileFactory'
import { generateRouterSchemaFileFactory } from '../generators/generateRouterSchemaFile'
import type { Config } from '../types'
import { getMiddleware, isMiddleware } from '../utils/getMiddleware'
import { getOrigins } from '../utils/getOrigins'
import { getRewritesFactory } from '../utils/getRewrites'
import { getRoute, isRoute } from '../utils/getRoute'
import { getRouterSchema } from '../utils/getRouterSchema'

export function generateFactory(config: Config) {
  const { defaultLocale, locales, getOriginAbsolutePath } = config

  const generateLocalizedFiles = generateLocalizedFilesFactory(config)
  const generateDeclarationFile = generateDeclarationFileFactory(config)
  const generateRouterFile = generateRouterSchemaFileFactory(config)
  const generateMiddlewareFile = generateMiddlewareFileFactory(config)

  const getRewrites = getRewritesFactory(config)

  return async () => {
    const infoMessage = '\x1b[32mnext-roots\x1b[37m - generation done in'
    // eslint-disable-next-line no-console
    console.time(infoMessage)

    const origins = await getOrigins({
      locales,
      defaultLocale,
      dirName: getOriginAbsolutePath(),
    })

    const rewrites = origins.flatMap(getRewrites)
    const routes = rewrites.flatMap(getRoute).filter(isRoute)
    const middlewares = rewrites
      .flatMap(getMiddleware(config))
      .filter(isMiddleware)

    const routerSchema = getRouterSchema({ routes, defaultLocale, locales })

    const execute = queue<void>(
      () => generateLocalizedFiles(rewrites),
      () => generateDeclarationFile(routerSchema),
      () => generateRouterFile(routerSchema),
      () => generateMiddlewareFile(middlewares),
      // eslint-disable-next-line no-console
      () => console.timeEnd(infoMessage)
    )

    return execute()
  }
}
