import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-ts'
import pkg from './package.json'

// external dependencies will not be included in bundle
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'next/link',
  './context',
]

// separated bundles to be generated
const bundles = [
  {
    input: 'src/packages/context.ts',
    output: [{ file: 'dist/context.js', format: 'cjs', exports: 'named' }],
  },
  {
    input: 'src/packages/link.tsx',
    output: [{ file: 'dist/link.js', format: 'cjs', exports: 'named' }],
  },
  {
    input: 'src/packages/meta.ts',
    output: [{ file: 'dist/meta.js', format: 'cjs', exports: 'named' }],
  },
]

export default [
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
