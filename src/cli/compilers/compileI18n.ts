import { createHash } from 'crypto'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'path'

export async function compileI18n(
  fileName: string,
  buildDir: string,
  format: 'cjs' | 'esm' = 'cjs'
) {
  const outputFileName = createHash('md5').update(fileName).digest('hex')

  return build({
    entryPoints: [fileName],
    outdir: `./${buildDir}`,
    entryNames: outputFileName,
    bundle: true,
    minify: true,
    treeShaking: true,
    platform: 'node',
    format: format,
    target: 'node18',
    drop: ['debugger'],
    conditions: ['react-server', 'next-roots-mock'],
    plugins: [nodeExternalsPlugin()],
  }).then(() => path.resolve(`${buildDir}/${outputFileName}.js`))
}
