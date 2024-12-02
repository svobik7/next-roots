import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '~': path.join(process.cwd(), '/src'),
    },
    coverage: {
      provider: 'istanbul',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ['src/**/*.{js,cjs,mjs,ts,tsx,jsx}'],
      exclude: [
        'patches/**',
        'examples/**',
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        '.next-roots',
        'src/__mocks__',
        'src/index.ts',
        'src/mock.ts',
        'src/cli.ts',
        'src/cli/cli.ts',
        'src/cli/errors.ts',
        'src/cli/commands/generate.ts',
        'src/cli/generators/**',
        'src/utils/fs-utils.ts',
      ],
    },
  },
})
