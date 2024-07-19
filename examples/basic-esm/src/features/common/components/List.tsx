import type { BookTranslation } from 'src/server/db/types'
import { ListItem, ListItemProps } from './ListItem'

type Item = ListItemProps & { id: string | number }

type ListProps = {
  items: Item[]
}

export function List({ items }: ListProps) {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {items.map((item) => (
        <ListItem key={item.id} {...item} />
      ))}
    </div>
  )
}
