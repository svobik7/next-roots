import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-ts'
// import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

// external dependencies will not be included in bundle
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'next/link',
]

export default [
  {
    input: [
      'src/packages/context.ts',
      'src/packages/link.tsx',
      'src/packages/meta.ts',
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
        // declaration: true,
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
        // declaration: false,
      }),
      terser(), // minifies generated bundles
    ],
    external: external,
  },
]
