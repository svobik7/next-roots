import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-ts'

import pkg from './package.json'
import pkgDist from './package.dist.json'

// external dependencies will not be included in bundle
const external = [
  ...Object.keys(pkgDist.dependencies || {}),
  ...Object.keys(pkgDist.peerDependencies || {}),
  'next/link',
]

// separated bundles to be generated
const bundles = [
  {
    input: 'src/index.ts',
    output: [
      // { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.main, format: 'es' },
    ],
  },
  {
    input: 'src/packages/context.ts',
    output: [
      // { file: 'dist/context.js', format: 'cjs', exports: 'named' },
      { file: 'dist/context.js', format: 'es' },
    ],
  },
  {
    input: 'src/packages/link.tsx',
    output: [
      // { file: 'dist/link.js', format: 'cjs', exports: 'named' },
      { file: 'dist/link.js', format: 'es' },
    ],
  },
  {
    input: 'src/packages/meta.ts',
    output: [
      // { file: 'dist/meta.js', format: 'cjs', exports: 'named' },
      { file: 'dist/meta.js', format: 'es' },
    ],
  },
]

export default [
  {
    input: 'bin/builder.ts',
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
        declaration: false,
      }),
      terser(), // minifies generated bundles
    ],
    external: external,
  },
  ...bundles.map(
    (b) => ({
      input: b.input,
      output: b.output,
      plugins: [
        typescript({
          typescript: require('typescript'),
          tsconfig: (resolvedConfig) => ({
            ...resolvedConfig,
            declaration: true,
          }),
        }),
        terser(), // minifies generated bundles
      ],
      external: external,
    }),
    []
  ),
]
