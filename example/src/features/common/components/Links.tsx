import Link from 'next/link'

type Item = { locale: string; name: string; href: string }

type LinksProps = {
  header: string
  items: Item[]
}

export function Links({ header, items }: LinksProps) {
  return (
    <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {header}
      </h2>

      <ul role="list" className="mt-4 text-indigo-600">
        {items.map((link) => (
          <li key={link.locale} className="flex gap-x-1">
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
