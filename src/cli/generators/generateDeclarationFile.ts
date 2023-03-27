import type { RouterSchema } from '~/types'
import { writeFile } from '~/utils/fs-utils'
import { compile } from '../templates/lib-declaration-tpl'
import type { Config } from '../types'

export function generateDeclarationFileFactory({
  getDistAbsolutePath,
}: Config) {
  return (routerSchema: RouterSchema) => {
    const to = getDistAbsolutePath('index.d.ts')
    const content = compile(routerSchema)

    writeFile(to, content)
  }
}
