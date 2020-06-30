import { withLayout } from 'components/layout'
import styles from './home.module.css'

function Home() {
  return <div className={styles.root}>HOME Domain</div>
}

export default withLayout(Home)
