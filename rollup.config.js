import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-ts'
import pkg from './package.json'

// external dependencies will not be included in bundle
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'next/link',
  'next/router',
]

export default [
  {
    input: [
      'src/packages/context.ts',
      'src/packages/link.tsx',
      'src/packages/meta.ts',
      'src/packages/router.ts',
      'src/index.ts',
    ],
    output: {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      terser(), // minifies generated bundles
    ],
    external: external,
  },
  {
    input: 'src/bin/builder.ts',
    output: [
      {
        file: 'dist/bin/builder.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node',
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
      terser(), // minifies generated bundles
    ],
    external: external,
  },
]
