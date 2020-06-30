import { withLayout } from 'components/layout'
import styles from './account-profile.module.css'

function AccountProfile() {
  return <div className={styles.root}>Account Profile Domain</div>
}

export default withLayout(AccountProfile)
