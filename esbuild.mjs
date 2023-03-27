import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

build({
  entryPoints: ['./src/cli/cli.ts', './src/index.ts', './src/mock.ts'],
  outdir: './dist',
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
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1))
