import { withLayout } from 'components/layout'
import styles from './auth-login.module.css'

function AuthLogin() {
  return <div className={styles.root}>Auth Login Domain</div>
}

export default withLayout(AuthLogin)
