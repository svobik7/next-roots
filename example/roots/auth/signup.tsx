import { LayoutMain } from 'components/layout'
import AuthSignup from 'domains/auth-signup'

export default function AuthSignupRoot() {
  return (
    <LayoutMain>
      <AuthSignup />
    </LayoutMain>
  )
}
