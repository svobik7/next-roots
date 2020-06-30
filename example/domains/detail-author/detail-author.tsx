import { withLayout } from 'components/layout'
import { isAuthor } from 'models'
import dynamic from 'next/dynamic'
import styles from './detail-author.module.css'

// dynamic component
const NotFound = dynamic(() => import('domains/not-found'))

/**
 * Domain props
 */
type DetailAuthorProps = {
  data: {
    author: unknown
  }
}

/**
 * Domain
 * @param props
 */
function DetailAuthor(props: DetailAuthorProps) {
  const {
    data: { author },
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

export default withLayout(DetailAuthor, { })
