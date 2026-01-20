import type { GenerateStaticParamsProps, PageProps } from 'next-roots'
import { notFound, redirect } from 'next/navigation'
import { ArticleDetail } from 'src/features/blog/components/ArticleDetail'
import { getArticleLinkParams } from 'src/features/blog/utils/getArticleLinkParams'
import {
  getAllArticleTranslations,
  getArticleTranslation,
} from 'src/features/blog/utils/getArticleTranslation'
import BackButton from 'src/features/common/components/BackButton'
import { Links } from 'src/features/common/components/Links'
import Modal from 'src/features/common/components/Modal'
import { fetchArticleBySlug, fetchArticles, fetchAuthors } from 'src/server/db'
import { getArticleHref, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type AuthorArticleParams = Promise<{ author: string; article: string }>

export default async function AuthorArticlePage({
  params,
  pageHref,
}: PageProps<AuthorArticleParams>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const article = await fetchArticleBySlug((await params).article)

  if (!article) {
    return notFound()
  }

  const allArticleTranslations = getAllArticleTranslations(article)
  const currentArticleTranslation = getArticleTranslation({
    article,
    locale: pageLocale,
  })

  if (!currentArticleTranslation) {
    return notFound()
  }

  const href = getArticleHref(currentArticleTranslation)

  if (pageHref !== href) {
    return redirect(href)
  }

  const t = await getDictionary(pageLocale)

  return (
    <Modal>
      <ArticleDetail
        article={currentArticleTranslation}
        alternatives={
          <Links
            header={t('common.NotYourLanguage?')}
            items={allArticleTranslations.map(getArticleLinkParams)}
          />
        }
        buttonBack={<BackButton>{t('article.BtnBack')}</BackButton>}
      />
    </Modal>
  )
}

export async function generateStaticParams({
  pageLocale,
}: GenerateStaticParamsProps) {
  const authors = await fetchAuthors()
  const articles = await fetchArticles()

  return articles
    .map(({ slug, authorId }) => ({
      author: authors.find(({ id }) => id === authorId)?.username,
      article: slug.find(({ locale }) => locale === pageLocale)?.value,
    }))
    .filter((props) => props.article && props.author)
}
