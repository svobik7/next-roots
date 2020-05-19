function as(rewrites, href: string, as: string) {}
function href(rewrites, href: string) {}

export function useRewrites() {
  return {
    as: (href: string, as: string) => as(rewrites, href, as),
    href: (href: string) => href(rewrites, href),
  }
}
