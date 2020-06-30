import { withLayout } from 'components/layout'
import styles from './account-settings.module.css'

function AccountSettings() {
  return <div className={styles.root}>Account Settings Domain</div>
}

export default withLayout(AccountSettings)
