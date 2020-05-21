import { LayoutMain } from 'components/layout'
import AccountSettings from 'domain/account-settings'

export default function AccountSettingsRoot() {
  return (
    <LayoutMain>
      <AccountSettings />
    </LayoutMain>
  )
}
