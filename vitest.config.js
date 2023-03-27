import path from 'path'
import { defineConfig } from 'vitest/config'

const defaultCoverageExclude = [
  'coverage/**',
  'dist/**',
  'packages/*/test{,s}/**',
  '**/*.d.ts',
  '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
  '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
  '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
  '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
]

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '~': path.join(process.cwd(), '/src'),
    },
    coverage: {
      provider: 'istanbul',
      lines: 85,
      functions: 85,
      branches: 85,
      statements: 85,
      exclude: [
        ...defaultCoverageExclude,
        '.next-roots',
        'src/__mocks__',
        'src/cli/errors.ts',
      ],
    },
  },
})
