import { t } from '@lingui/macro'

import { useUserProfileInfo } from 'features/home/api'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

type LowerCaseEmail = string & { brand: 'LowerCaseEmail' }

export const toLowerCaseEmail = (text: string): LowerCaseEmail => {
  return text.toLowerCase() as LowerCaseEmail
}

const doEmailsEqual = (email1: LowerCaseEmail, email2: LowerCaseEmail) => email1 === email2

export const useIsCurrentUserEmail = (email: LowerCaseEmail): boolean => {
  const { data: user } = useUserProfileInfo()
  if (!user?.email) return false

  const currentEmail = toLowerCaseEmail(user?.email)
  return doEmailsEqual(email, currentEmail)
}

export function useValidateEmail(email: LowerCaseEmail): string | null {
  const isCurrentUserEmail = useIsCurrentUserEmail(email)

  if (email.length === 0) return null
  if (!isEmailValid(email)) return t`Format de l'e-mail incorrect`
  if (isCurrentUserEmail) return t`L'e-mail saisi est identique à votre e-mail actuel`
  return null
}
