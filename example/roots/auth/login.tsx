import { LayoutMain } from 'components/layout'
import AuthLogin from 'domain/auth-login'

export default function AuthLoginRoot() {
  return (
    <LayoutMain>
      <AuthLogin />
    </LayoutMain>
  )
}
