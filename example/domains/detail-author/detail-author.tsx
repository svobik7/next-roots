import { isAuthor } from 'models'
import dynamic from 'next/dynamic'
import styles from './detail-author.module.css'

const NotFound = dynamic(() => import('domains/not-found'))

type DetailAuthorProps = {
  data: {
    author: unknown
  }
  layout: string
}

export default function DetailAuthor(props: DetailAuthorProps) {
  const {
    data: { author },
    layout = 'none',
  } = props

  // show not found when author neither article exist
  if (!isAuthor(author)) {
    return <NotFound />
  }

  return (
    <div className={styles.root}>
      Detail Author Domain
      <br />
      <br />
      {JSON.stringify({
        author,
      })}
    </div>
  )
}
