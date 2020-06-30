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

  // show not found when article does not exist
  if (!isArticle(article)) {
    return <NotFound />
  }

  // show not found when author neither article exist
  if (!isAuthor(author)) {
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

export default withLayout(DetailArticle)
