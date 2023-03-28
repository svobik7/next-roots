import { createHash } from 'crypto'
import { build } from 'esbuild'
import path from 'path'

export async function compileI18n(fileName: string, buildDir: string) {
  const outputFileName = createHash('md5').update(fileName).digest('hex')

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
