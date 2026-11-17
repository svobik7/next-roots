import type { ReactNode } from 'react'

/**
 * Root layout for the preferred-language redirect.
 * Localized routes keep their own root layouts, so this page needs one too.
 */
export default function PreferredLanguageLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
