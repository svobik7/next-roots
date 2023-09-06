import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

build({
  entryPoints: [
    path.resolve(__dirname, './../src/cli/cli.ts'),
    path.resolve(__dirname, './../src/index.ts'),
    path.resolve(__dirname, './../src/mock.ts'),
  ],
  outdir: path.resolve(__dirname, './../dist'),
  entryNames: '[name]',
  bundle: true,
  minify: true,
  treeShaking: true,
  platform: 'node',
  format: 'cjs',
  target: 'node14',
  sourcemap: true,
  color: true,
  drop: ['debugger'],
  external: ['esbuild', 'next-roots'],
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1))
