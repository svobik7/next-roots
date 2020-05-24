import {
  Rewrite,
  RewriteTable,
  RewriteTableOptions,
  RewriteTableRule,
} from 'types'
import { createPagePath } from './path-utils'

/**
 * Creates table rule ID
 *
 * Input:
 * - root: account/profile
 * - locale: en
 *
 * Expected output:
 * - en/account/profile
 *
 * @param root
 * @param locale
 */
export function createTableRuleID(root: string, locale: string = '') {
  locale = locale || '*'
  return `${locale}/${root}`
}

/**
 * Creates rewrite table
 *
 * Input:
 * - rewrites: [
 *  {
 *    root: 'profile',
 *    token: 't1',
 *    params: [{locale: 'en', 'path': 'account/profile-:token', suffix: '.htm'}]
 *  }
 * ],
 *
 * Expected output:
 * - [{
 *      ID: 'en/profile'
 *      as: '/en/account/profile-t1.htm'
 *      href: '/en/account/profile-t1.htm'
 * }]
 *
 * @param params
 */
export function rewriteTable(rewrites: Rewrite[]): RewriteTable {
  return rewrites.reduce((acc, curr) => {
    const rules = curr.params.map((p) => ({
      ID: createTableRuleID(curr.root, p.locale),
      href: createPagePath(p, curr.token),
      as: createPagePath(p, curr.token),
    }))

    return [...acc, ...rules]
  }, [] as RewriteTableRule[])

  // return rewrites.map((r) => ({

  //   // ...r,
  //   // params: locales.map((l) => {
  //   //   // find rewrite param based on locale
  //   //   let params = r.params.find((p) => p.locale === l || p.locale === '*')

  //   //   // create no rewrite for current locale when params are undefined
  //   //   if (!params) {
  //   //     params = {}

  //   //     // console.log(
  //   //     //   colors.red('warn'),
  //   //     //   `- rewrite rule for`,
  //   //     //   colors.red(`${l}:${r.root}`),
  //   //     //   'is missing!'
  //   //     // )
  //   //   }

  //   //   return {
  //   //     locale: l,
  //   //     path: params.page || params.path || r.root,
  //   //     suffix: !isNullish(params.suffix) ? params.suffix : defaultSuffix,
  //   //   }
  //   // }),
  // }))
}
