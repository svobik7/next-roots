import { compileHref } from './router'

export class StaticRouter {
  private static LOCALE = ''
  private static PAGE_HREF = '/'
  private static PARAMS: Promise<Record<string, string>> | undefined

  /**
   * Gets relevant page locale
   */
  public static getLocale(): string {
    return StaticRouter.LOCALE
  }

  /**
   * Sets relevant page locale
   * @param locale
   */
  public static setLocale(locale: string): void {
    StaticRouter.LOCALE = locale
  }

  /**
   * Gets relevant page href
   */
  public static async getPageHref(): Promise<string> {
    return StaticRouter.PARAMS
      ? compileHref(StaticRouter.PAGE_HREF, await StaticRouter.PARAMS)
      : StaticRouter.PAGE_HREF
  }

  /**
   * Sets relevant page href
   * @param pageHref
   */
  public static setPageHref(pageHref: string): void {
    StaticRouter.PAGE_HREF = pageHref
  }

  /**
   * Sets relevant page params
   * @param params
   */
  public static setParams(params: Promise<Record<string, string>>): void {
    StaticRouter.PARAMS = params
  }
}
