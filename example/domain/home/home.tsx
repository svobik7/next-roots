import styles from './home.module.css'
import { useRewrites } from 'next-i18n-rewrites'

export default function Home() {
  const rewrites = useRewrites()
  return (
    <div className={styles.root}>
      HOME Domain
      <hr />
      SIGNUP: {rewrites.as('auth/signup')}
      <hr />
      <pre>{JSON.stringify(rewrites.rules, null, 2)}</pre>
    </div>
  )
}
