import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
        useTsconfigDeclarationDir: true,
      }),
      terser(), // minifies generated bundles
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'next/link',
    ],
  },
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
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
        },
      }),
      terser(), // minifies generated bundles
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
]
