import type { Middleware } from '~/types'
import { writeFile } from '~/utils/fs-utils'
import { compile } from '../templates/lib-middleware-file-tpl'
import type { Config } from '../types'

export function generateMiddlewareFileFactory({
  getLocalizedAbsolutePath,
}: Config) {
  return (middlewares: Middleware[]) => {
    const to = getLocalizedAbsolutePath('_middleware.ts')
    const content = compile(middlewares)

    writeFile(to, content)
  }
}
