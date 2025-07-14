module.exports = {
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts',
      noCheck: false,
      libraries: {
        importedLibraries: ['happy-dom'],
        allowedTypesLibraries: ['node'],
      },
    },
  ],
  compilationOptions: {
    preferredConfigPath: './tsconfig.build.json',
  },
}
