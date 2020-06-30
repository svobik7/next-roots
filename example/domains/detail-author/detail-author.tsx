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

  // show 404 when author is not found
  if (!isFound(props.data)) {
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

/**
 * Determines if props.data is valid to show or not
 * @param data
 */
function isFound(data: DetailAuthorProps['data']) {
  return isAuthor(data.author)
}

export default withLayout(DetailAuthor, {
  useLayout: (props: DetailAuthorProps, initial: string) =>
    !isFound(props.data) ? 'none' : initial,
})
