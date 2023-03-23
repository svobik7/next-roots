import { copyFile, removeDir, writeFile } from '~/utils/fs-utils'
import { compileFactory as compileLayoutFactory } from '../templates/layout-tpl'
import { compileFactory as compilePageFactory } from '../templates/page-tpl'
import type { Config, Rewrite } from '../types'

function isPage(pathName: string) {
  return pathName.match(/page\.([tj]sx)?$/)
}

function isLayout(pathName: string) {
  return pathName.match(/layout\.([tj]sx)?$/)
}

function getCompilerFactory(config: Config) {
  return ({ originPath }: Rewrite) => {
    if (isPage(originPath)) {
      return compilePageFactory(config)
    }

    if (isLayout(originPath)) {
      return compileLayoutFactory(config)
    }

    return undefined
  }
}

function createLocalizedFileFactory(config: Config) {
  return (rewrite: Rewrite) => {
    const { getOriginAbsolutePath, getLocalizedAbsolutePath } = config

    const { localizedPath, originPath } = rewrite
    const from = getOriginAbsolutePath(originPath)
    const to = getLocalizedAbsolutePath(localizedPath)

    const getCompiler = getCompilerFactory(config)
    const compile = getCompiler(rewrite)

    if (compile) {
      const content = compile(rewrite)
      writeFile(to, content)
    } else {
      copyFile(from, to)
    }
  }
}

export function generateLocalizedFilesFactory(config: Config) {
  return (rewrites: Rewrite[]) => {
    const { locales, getLocalizedAbsolutePath } = config

    // delete old files
    const localizedDir = getLocalizedAbsolutePath()
    removeDir(localizedDir)

    // create new files
    const createLocalizedFile = createLocalizedFileFactory(config)
    rewrites.map(createLocalizedFile)
  }
}
