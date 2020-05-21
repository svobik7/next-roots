import { LayoutMain } from 'components/layout'
import AuthSignup from 'domain/auth-signup'

export default function AuthSignupRoot() {
  return (
    <LayoutMain>
      <AuthSignup />
    </LayoutMain>
  )
}
