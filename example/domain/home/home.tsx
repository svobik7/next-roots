import styles from './home.module.css'
import { useRewrites } from 'next-i18n-rewrites'

export default function Home() {
  const rewrites = useRewrites()
  return (
    <div className={styles.root}>
      HOME Domain
      <hr />
      {/* SIGNUP: {rewrites.as('auth/signup', { locale: 'en' })} */}
    </div>
  )
}
