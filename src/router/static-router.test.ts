import { StaticRouter } from './static-router'

describe('StaticRouter - Context Isolation', () => {
  test('should isolate context between parallel executions', async () => {
    // Simulate parallel page generation like Next.js build does
    const context1 = { locale: 'en', pageHref: '/en/stuff' }
    const context2 = { locale: 'fr', pageHref: '/fr/truc' }

    const results = await Promise.all([
      // Simulate page 1 generation
      new Promise<{ locale: string; href: string }>((resolve) => {
        StaticRouter.runWithContext(context1, async () => {
          // Simulate some async work (like rendering components)
          await new Promise((r) => setTimeout(r, 10))
          const locale = StaticRouter.getLocale()
          const href = await StaticRouter.getPageHref()
          resolve({ locale, href })
        })
      }),
      // Simulate page 2 generation (starts while page 1 is still rendering)
      new Promise<{ locale: string; href: string }>((resolve) => {
        setTimeout(() => {
          StaticRouter.runWithContext(context2, async () => {
            // Simulate some async work
            await new Promise((r) => setTimeout(r, 10))
            const locale = StaticRouter.getLocale()
            const href = await StaticRouter.getPageHref()
            resolve({ locale, href })
          })
        }, 5)
      }),
    ])

    // Each context should maintain its own values
    expect(results[0]).toEqual({ locale: 'en', href: '/en/stuff' })
    expect(results[1]).toEqual({ locale: 'fr', href: '/fr/truc' })
  })

  test('should handle nested context executions', async () => {
    const outerContext = { locale: 'en', pageHref: '/en/outer' }
    const innerContext = { locale: 'es', pageHref: '/es/inner' }

    const result = StaticRouter.runWithContext(outerContext, () => {
      const outerLocale = StaticRouter.getLocale()

      const innerResult = StaticRouter.runWithContext(innerContext, () => {
        return StaticRouter.getLocale()
      })

      const outerLocaleAfter = StaticRouter.getLocale()

      return {
        outerBefore: outerLocale,
        inner: innerResult,
        outerAfter: outerLocaleAfter,
      }
    })

    expect(result.outerBefore).toBe('en')
    expect(result.inner).toBe('es')
    expect(result.outerAfter).toBe('en')
  })

  test('should compile href with params in context', async () => {
    const params = Promise.resolve({ id: '123', slug: 'test-article' })
    const context = {
      locale: 'en',
      pageHref: '/en/blog/:id/:slug',
      params,
    }

    const href = await StaticRouter.runWithContext(context, () => {
      return StaticRouter.getPageHref()
    })

    expect(href).toBe('/en/blog/123/test-article')
  })

  test('should fall back to static properties when not in context', async () => {
    // Set static properties
    StaticRouter.setLocale('cs')
    StaticRouter.setPageHref('/cs/fallback')

    // Access without context
    const locale = StaticRouter.getLocale()
    const href = await StaticRouter.getPageHref()

    expect(locale).toBe('cs')
    expect(href).toBe('/cs/fallback')
  })

  test('should allow mutation within context', () => {
    const context = { locale: 'en', pageHref: '/en/initial' }

    const result = StaticRouter.runWithContext(context, () => {
      const initialLocale = StaticRouter.getLocale()

      // Mutate context
      StaticRouter.setLocale('fr')
      StaticRouter.setPageHref('/fr/modified')

      const modifiedLocale = StaticRouter.getLocale()

      return {
        initial: initialLocale,
        modified: modifiedLocale,
      }
    })

    expect(result.initial).toBe('en')
    expect(result.modified).toBe('fr')
  })

  test('should handle context with params mutation', async () => {
    const initialParams = Promise.resolve({ id: '1' })
    const context = {
      locale: 'en',
      pageHref: '/en/item/:id',
      params: initialParams,
    }

    const result = await StaticRouter.runWithContext(context, async () => {
      const initialHref = await StaticRouter.getPageHref()

      // Mutate params
      const newParams = Promise.resolve({ id: '2' })
      StaticRouter.setParams(newParams)

      const modifiedHref = await StaticRouter.getPageHref()

      return {
        initial: initialHref,
        modified: modifiedHref,
      }
    })

    expect(result.initial).toBe('/en/item/1')
    expect(result.modified).toBe('/en/item/2')
  })
})
