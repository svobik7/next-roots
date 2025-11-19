import { AsyncLocalStorage } from 'async_hooks'
import type { RouteParams } from '~/types'
import { compileHref } from './href-utils'

interface RouterContext {
  locale: string
  pageHref: string
  params?: Promise<RouteParams>
}

const asyncLocalStorage = new AsyncLocalStorage<RouterContext>()

export class StaticRouter {
  // Fallback static properties for backward compatibility
  private static LOCALE = ''
  private static PAGE_HREF = '/'
  private static PARAMS: Promise<RouteParams> | undefined

  /**
   * Runs a function with isolated router context
   * @param context - The router context for this execution
   * @param fn - The function to run with the context
   */
  public static runWithContext<T>(context: RouterContext, fn: () => T): T {
    return asyncLocalStorage.run(context, fn)
  }

  /**
   * Gets the current context or undefined if not in a context
   */
  private static getContext(): RouterContext | undefined {
    return asyncLocalStorage.getStore()
  }

  /**
   * Gets relevant page locale
   */
  public static getLocale(): string {
    const context = StaticRouter.getContext()
    return context ? context.locale : StaticRouter.LOCALE
  }

  /**
   * Sets relevant page locale
   * @param locale
   */
  public static setLocale(locale: string): void {
    const context = StaticRouter.getContext()
    if (context) {
      context.locale = locale
    } else {
      StaticRouter.LOCALE = locale
    }
  }

  /**
   * Gets relevant page href
   */
  public static async getPageHref(): Promise<string> {
    const context = StaticRouter.getContext()
    if (context) {
      return context.params
        ? compileHref(context.pageHref, await context.params)
        : context.pageHref
    }
    return StaticRouter.PARAMS
      ? compileHref(StaticRouter.PAGE_HREF, await StaticRouter.PARAMS)
      : StaticRouter.PAGE_HREF
  }

  /**
   * Sets relevant page href
   * @param pageHref
   */
  public static setPageHref(pageHref: string): void {
    const context = StaticRouter.getContext()
    if (context) {
      context.pageHref = pageHref
    } else {
      StaticRouter.PAGE_HREF = pageHref
    }
  }

  /**
   * Sets relevant page params
   * @param params
   */
  public static setParams(params: Promise<RouteParams>): void {
    const context = StaticRouter.getContext()
    if (context) {
      context.params = params
    } else {
      StaticRouter.PARAMS = params
    }
  }
}
