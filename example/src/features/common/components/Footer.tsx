import Link from 'next/link'
import { getHomeHref } from '~/server/router'

function getLocales() {
  return [
    { name: 'English', href: getHomeHref('en') },
    { name: 'Čeština', href: getHomeHref('cs') },
    { name: 'Español', href: getHomeHref('es') },
  ]
}

export function Footer() {
  const locales = getLocales()

  return (
    <div className="flex justify-center space-x-4">
      {locales.map((l) => (
        <Link
          key={l.name}
          href={l.href}
          className="text-gray-500 px-3 py-2 text-sm font-medium"
        >
          {l.name}
        </Link>
      ))}
    </div>
  )
}
