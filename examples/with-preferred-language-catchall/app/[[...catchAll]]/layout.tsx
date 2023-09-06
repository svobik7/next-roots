import { schema } from 'next-roots'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={schema.defaultLocale}>
      <body>{children}</body>
    </html>
  )
}
