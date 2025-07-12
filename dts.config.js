module.exports = {
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts',
      noCheck: false,
    },
  ],
  compilationOptions: {
    preferredConfigPath: './tsconfig.dts.json',
  },
}
