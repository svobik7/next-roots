import styles from './auth-signup.module.css'
import { withLayout } from 'components/layout'

function AuthSignup() {
  return <div className={styles.root}>Auth Signup Domain</div>
}

export default withLayout(AuthSignup)
