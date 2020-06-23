import { LayoutMain } from 'components/layout'
import AuthLogin from 'domains/auth-login'

export default function AuthLoginRoot() {
  return (
    <LayoutMain>
      <AuthLogin />
    </LayoutMain>
  )
}
