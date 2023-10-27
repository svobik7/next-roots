export class StaticRouter {
  private static PAGE_HREF = '/'

  /**
   * Gets relevant page href
   */
  public static getPageHref(): string {
    return StaticRouter.PAGE_HREF
  }

  /**
   * Sets relevant page href
   * @param pageHref
   */
  public static setPageHref(pageHref: string): void {
    StaticRouter.PAGE_HREF = pageHref
  }
}
