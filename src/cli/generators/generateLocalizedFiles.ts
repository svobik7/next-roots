import { copyFile, removeDir, writeFile } from '~/utils/fs-utils'
import { isLayout, isNotFound, isPage, isTemplate } from '~/utils/rewrite-utils'
import { compileFactory as compileLayoutFactory } from '../templates/layout-tpl'
import { compileFactory as compileNotFoundFactory } from '../templates/not-found-tpl'
import { compileFactory as compilePageFactory } from '../templates/page-tpl'
import type { Config, Rewrite } from '../types'

function getCompilerFactory(config: Config) {
  return ({ originPath }: Rewrite) => {
    if (isPage(originPath)) {
      return compilePageFactory(config)
    }

    if (isLayout(originPath)) {
      return compileLayoutFactory(config)
    }

    if (isNotFound(originPath)) {
      return compileNotFoundFactory(config)
    }

    return undefined
  }
}

function getShouldSkip(rewrite: Rewrite): boolean {
  const { skip } = rewrite
  if (typeof skip === 'boolean') {
    return skip
  }
  if (isPage(rewrite.originPath) && skip?.page) {
    return true
  }
  if (isLayout(rewrite.originPath) && skip?.layout) {
    return true
  }
  if (isTemplate(rewrite.originPath) && skip?.template) {
    return true
  }
  return false
}

function createLocalizedFileFactory(config: Config) {
  return (rewrite: Rewrite) => {
    const { getOriginAbsolutePath, getLocalizedAbsolutePath } = config

    const { localizedPath, originPath } = rewrite
    const from = getOriginAbsolutePath(originPath)
    const to = getLocalizedAbsolutePath(localizedPath)

    const getCompiler = getCompilerFactory(config)
    const compile = getCompiler(rewrite)
    const shouldSkip = getShouldSkip(rewrite)

    if (shouldSkip) {
      return
    }

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
    const { getLocalizedAbsolutePath } = config

    // delete old files
    const localizedDir = getLocalizedAbsolutePath()
    removeDir(localizedDir)

    // create new files
    const createLocalizedFile = createLocalizedFileFactory(config)
    rewrites.map(createLocalizedFile).filter(Boolean)
  }
}
