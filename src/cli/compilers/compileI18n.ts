import { createHash } from 'crypto'
import path from 'path'

async function buildFactory() {
  try {
    const { build } = await import('esbuild')
    return build
  } catch {
    throw new Error('ESBuild was not found')
  }
}

export async function compileI18n(fileName: string, buildDir: string) {
  const outputFileName = createHash('md5').update(fileName).digest('hex')

  const build = await buildFactory()

  return build({
    entryPoints: [fileName],
    outdir: `./${buildDir}`,
    entryNames: outputFileName,
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: 'cjs',
    target: 'node14',
    drop: ['debugger'],
    conditions: ['react-server', 'next-roots-mock'],
  }).then(() => path.resolve(`${buildDir}/${outputFileName}.js`))
}
