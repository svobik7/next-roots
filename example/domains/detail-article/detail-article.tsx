import { withLayout } from 'components/layout'
import { isArticle, isAuthor } from 'models'
import dynamic from 'next/dynamic'
import styles from './detail-article.module.css'

// dynamic components
const NotFound = dynamic(() => import('domains/not-found'))

/**
 * Domain Props
 */
type DetailArticleProps = {
  data: {
    author: unknown
    article: unknown
  }
}

/**
 * Domain
 * @param props
 */
function DetailArticle(props: DetailArticleProps) {
  const {
    data: { author, article },
  } = props

  // show 404 when article either author is not found
  if (!isFound(props.data)) {
    return <NotFound />
  }

  return (
    <div className={styles.root}>
      Detail Article Domain
      <br />
      <br />
      {JSON.stringify({
        author,
        article,
      })}
    </div>
  )
}

/**
 * Determines if props.data is valid to show or not
 * @param data
 */
function isFound(data: DetailArticleProps['data']) {
  return isAuthor(data.author) && isArticle(data.article)
}

/**
 * Domain withLayout
 */
export default withLayout(DetailArticle, {
  useLayout: (props: DetailArticleProps, initial: string) =>
    !isFound(props.data) ? 'none' : initial,
})
