# next-roots

next-roots is a TypeScript library that generates internationalized (i18n) routes for Next.js applications using the APP directory. It provides an alternative to dynamic `[lang]` segments by pre-generating all localized file-routes.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository
- Install dependencies: `yarn install --frozen-lockfile`
- Build the package: `yarn build` -- takes 12 seconds. NEVER CANCEL. Set timeout to 30+ minutes for safety.
  - Individual commands: `yarn typecheck` (2s), `yarn test` (2s), `yarn lint` (3s)
- Run tests only: `yarn test` -- takes 2 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
- Run test coverage: `yarn test:coverage` -- takes 3 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
- Type checking: `yarn typecheck` -- takes 2 seconds. NEVER CANCEL. Set timeout to 10+ minutes.
- Linting: `yarn lint` -- takes 3 seconds. NEVER CANCEL. Set timeout to 10+ minutes.

### CLI Usage
- Generate routes: `npx next-roots` (requires `roots.config.js` file)
- Watch mode: `npx next-roots -w`
- Custom config: `npx next-roots -c custom.config.js`
- ESM mode: `npx next-roots --esm`

### Working with Examples
- Basic example location: `examples/basic/`
- Install example dependencies: `cd examples/basic && yarn install --frozen-lockfile`
- Generate routes: `cd examples/basic && yarn roots` -- takes <1 second
- Start dev server: `cd examples/basic && yarn dev` -- starts in 1.3 seconds
- Build example: `cd examples/basic && yarn build` -- takes 25 seconds. NEVER CANCEL. Set timeout to 45+ minutes.

## Validation

### Manual Testing Requirements
- ALWAYS test the CLI functionality after making changes to the CLI code:
  - `cd examples/basic && yarn roots` -- should generate 30 localized routes
  - Check that `app/` directory contains `(en)/`, `cs/`, and `es/` folders
- ALWAYS test the development workflow after making changes:
  - Start dev server: `cd examples/basic && yarn dev`
  - Verify server starts at http://localhost:3000 in ~1.3 seconds
  - Test route generation by visiting different locale paths
- ALWAYS run the full test suite: `yarn test:coverage`
  - Expects 96%+ statement coverage, 88%+ branch coverage
  - Should pass all 129 tests across 13 test files
- ALWAYS run linting before committing: `yarn lint`

### Pre-commit Validation
- Always run `yarn build` before committing (includes typecheck, test, lint)
- Verify example applications still work: `cd examples/basic && yarn build`
- Check that no unintended files are included in the build (dist/ should contain built files only)

## Common Tasks

### Codebase Navigation
- Main source code: `src/` directory
  - CLI implementation: `src/cli/`
  - Router implementation: `src/router/`
  - Utilities: `src/utils/`
- Examples: `examples/` directory (basic, basic-esm, with-preferred-language-*)
- Tests: Co-located with source files as `*.test.ts`
- Build output: `dist/` directory
- Configuration files: Root level (package.json, tsconfig.json, eslint.config.mjs, etc.)

### Key Files to Check After Changes
- Always check `src/cli/` after modifying CLI functionality
- Always check `src/router/` after modifying router logic
- Always verify `examples/basic/` still works after any changes
- Always run tests in affected areas using `yarn test:watch` during development

### Build Artifacts
- Main build output: `dist/index.js`, `dist/cli.js`
- Type definitions: `dist/index.d.ts`
- Package exports: `index.js`, `index.d.ts` (root level symlinks)

### Development Workflow
- Use `yarn test:watch` for test-driven development
- Use `cd examples/basic && yarn roots -w` to test CLI changes in watch mode
- Use `cd examples/basic && yarn dev` to test integration with Next.js
- Always verify changes don't break existing functionality

## Repository Structure Summary

```
next-roots/
├── .github/                    # GitHub configuration
├── examples/                   # Example applications
│   ├── basic/                 # Main example with full i18n setup
│   ├── basic-esm/             # ESM module example
│   └── with-preferred-*/      # Language preference examples
├── src/                       # Source code
│   ├── cli/                   # Command-line interface
│   ├── router/                # Router implementation
│   └── utils/                 # Shared utilities
├── dist/                      # Build output (generated)
├── package.json               # Package configuration
├── roots.config.js            # Example configuration
└── README.md                  # Documentation

Key commands in package.json:
- build: Complete build pipeline
- test: Run test suite
- lint: Code linting
- typecheck: TypeScript validation
```

## Timing Expectations

- `yarn install`: 1-2 minutes initially, <10 seconds for updates
- `yarn build`: 12 seconds total (never cancel, wait for completion)
- `yarn test`: 2 seconds (129 tests)
- `yarn lint`: 3 seconds
- Example app build: 25 seconds (never cancel, wait for completion)
- Route generation: <1 second (30 localized routes)
- Dev server startup: 1.3 seconds

## Important Notes

- Package uses Yarn as package manager (yarn.lock present)
- Built with TypeScript, esbuild, and vitest
- Supports Node.js LTS versions
- Example apps use Next.js 15+ with APP directory
- CLI expects `roots.config.js` configuration file
- Generated routes replace `app/` directory contents (backup important files)
- Test coverage maintained at 96%+ statement coverage