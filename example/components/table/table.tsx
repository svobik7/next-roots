import { createElement, PropsWithChildren, ReactNode } from 'react'
import styles from './table.module.css'

type TableProps = PropsWithChildren<{
  columns: Array<{ key: string; label: string; tag?: string }>
  data: Array<Record<string, ReactNode>>
}>

type TableContentProps = {
  content: ReactNode
  tag?: string
}

function TableContent(props: TableContentProps) {
  const { tag = 'span', content } = props

  return createElement(tag, {}, content)
}

function Table(props: TableProps) {
  const { columns, data: body } = props

  return (
    <table id="meta-data" className={styles.table}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.label}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((d, row) => (
          <tr key={row}>
            {columns.map((c) => (
              <td key={`${row}-${c.label}`}>
                <TableContent tag={c.tag} content={d[c.key]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
