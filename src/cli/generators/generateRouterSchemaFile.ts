import type { RouterSchema } from '~/types'
import { writeFile } from '~/utils/fs-utils'
import { compile } from '../templates/lib-router-schema-tpl'
import type { Config } from '../types'

export function generateRouterSchemaFileFactory({
  getCacheAbsolutePath,
}: Config) {
  return (routerSchema: RouterSchema) => {
    const to = getCacheAbsolutePath('schema.js')
    const content = compile(routerSchema)

    writeFile(to, content)
  }
}
