import type { ArticleTranslation } from '~/server/db/types'
import { ArticlesListItem } from './ArticlesListItem'

type ArticlesListProps = {
  articles: ArticleTranslation[]
}

export function ArticlesList({ articles }: ArticlesListProps) {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-4 gap-x-4 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {articles.map((article) => (
        <ArticlesListItem key={article.id} article={article} />
      ))}
    </div>
  )
}
