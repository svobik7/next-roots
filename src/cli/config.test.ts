import path from 'path'
import { getConfig } from './config'
import { type CliParams } from './types'

const inputParams: CliParams = {
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  originDir: 'src/__mocks__/roots',
  localizedDir: 'src/__mocks__/app',
  prefixDefaultLocale: true,
  packageDir: '',
}

describe('getConfig', () => {
  test('valid config', () => {
    const config = getConfig(inputParams)

    expect(config.locales).toStrictEqual(['en', 'cs', 'es'])
    expect(config.defaultLocale).toStrictEqual('en')
    expect(config.prefixDefaultLocale).toStrictEqual(true)
    expect(config.afterGenerate).toStrictEqual(undefined)
    expect(config.getOriginAbsolutePath('page.ts')).toStrictEqual(
      path.join('src', '__mocks__', 'roots', 'page.ts')
    )
    expect(config.getLocalizedAbsolutePath('page.ts')).toStrictEqual(
      path.join('src', '__mocks__', 'app', 'page.ts')
    )
    expect(config.getDistAbsolutePath('index.js')).toStrictEqual(
      path.join('dist', 'index.js')
    )
  })
})
