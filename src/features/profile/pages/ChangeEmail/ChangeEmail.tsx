import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Platform, ScrollView, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { isLongEnough } from 'features/auth/components/PasswordSecurityRules'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ChangeEmailRequest, CHANGE_EMAIL_ERROR_CODE } from 'features/profile/api'
import { AlreadyChangedEmailDisclaimer } from 'features/profile/pages/ChangeEmail/AlreadyChangedEmailDisclaimer'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { useCheckHasCurrentEmailChange } from 'features/profile/pages/ChangeEmail/utils/useCheckHasCurrentEmailChange'
import { useValidateEmail } from 'features/profile/pages/ChangeEmail/utils/useValidateEmail'
import { analytics } from 'libs/analytics'
import { useSafeState } from 'libs/hooks'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { getSpacing, Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export function ChangeEmail() {
  const { isMobileViewport, isTouch } = useTheme()
  const [email, setEmail] = useSafeState('')
  const [password, setPassword] = useSafeState('')
  const emailErrorMessage = useValidateEmail(email)
  const [passwordErrorMessage, setPasswordErrorMessage] = useSafeState<string | null>(null)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const { hasCurrentEmailChange } = useCheckHasCurrentEmailChange()

  const { mutate: changeEmail, isLoading } = useMutation(
    (body: ChangeEmailRequest) => api.postnativev1profileupdateEmail(body),
    {
      onSuccess: () => {
        showSuccessSnackBar({
          message: t`E-mail envoyé\u00a0! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.`,
          timeout: SNACK_BAR_TIME_OUT,
        })
        navigateToProfile()
        analytics.logSaveNewMail()
      },
      onError: (error: ApiError | unknown) => {
        onEmailChangeError((error as ApiError)?.content?.code)
      },
    }
  )

  useEffect(() => {
    removePasswordError()
  }, [password])

  const scrollRef = useRef<ScrollView | null>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { bottom } = useSafeAreaInsets()
  useForHeightKeyboardEvents(setKeyboardHeight)

  const onEmailChangeError = (errorCode?: string) => {
    errorCode && analytics.logErrorSavingNewEmail(errorCode)

    switch (errorCode) {
      case CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD:
        setPasswordErrorMessage(t`Mot de passe incorrect`)
        break
      default:
        showErrorSnackBar({
          message: t`Une erreur s’est produite pendant la modification de ton e-mail.
          Réessaie plus tard.`,
          timeout: SNACK_BAR_TIME_OUT,
        })
    }
  }

  const removePasswordError = () => {
    setPasswordErrorMessage(null)
  }

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const submitEmailChange = () => {
    changeEmail({ email, password })
  }

  const isSubmitButtonDisabled =
    !isLongEnough(password) || !!emailErrorMessage || !!passwordErrorMessage || isLoading

  useEnterKeyAction(!isSubmitButtonDisabled ? submitEmailChange : undefined)

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledScrollView
        ref={scrollRef}
        contentContainerStyle={getScrollViewContentContainerStyle(keyboardHeight)}
        keyboardShouldPersistTaps="handled">
        <Spacer.Column numberOfSpaces={18} />
        {hasCurrentEmailChange ? (
          <React.Fragment>
            <AlreadyChangedEmailDisclaimer />
            <Spacer.Column numberOfSpaces={4} />
          </React.Fragment>
        ) : null}
        <ChangeEmailDisclaimer />
        <Spacer.Column numberOfSpaces={4} />
        <CenteredContainer>
          <Form.MaxWidth>
            <EmailInput
              label={t`Nouvel e-mail`}
              email={email}
              onEmailChange={setEmail}
              disabled={hasCurrentEmailChange}
              isRequiredField
            />
            {!!emailErrorMessage && (
              <InputError visible messageId={emailErrorMessage} numberOfSpacesTop={2} />
            )}
            <Spacer.Column numberOfSpaces={4} />
            <PasswordInput
              label={t`Mot de passe`}
              value={password}
              onChangeText={setPassword}
              placeholder={t`Ton mot de passe`}
              textContentType="password"
              disabled={hasCurrentEmailChange}
              isRequiredField
            />
            {!!passwordErrorMessage && (
              <InputError visible messageId={passwordErrorMessage} numberOfSpacesTop={2} />
            )}

            {isMobileViewport && isTouch ? (
              <Spacer.Flex flex={1} />
            ) : (
              <Spacer.Column numberOfSpaces={10} />
            )}

            {!!keyboardHeight && <Spacer.Column numberOfSpaces={2} />}
            <ButtonContainer paddingBottom={keyboardHeight ? 0 : bottom}>
              <ButtonPrimary
                wording={t`Enregistrer`}
                onPress={submitEmailChange}
                disabled={isSubmitButtonDisabled}
              />
            </ButtonContainer>
          </Form.MaxWidth>
          <Spacer.Column numberOfSpaces={6} />
        </CenteredContainer>
      </StyledScrollView>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}

const StyledScrollView = styled(ScrollView)({
  paddingHorizontal: getSpacing(5),
})

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const getScrollViewContentContainerStyle = (keyboardHeight: number): StyleProp<ViewStyle> => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
  backgroundColor: theme.colors.white,
})

const ButtonContainer = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
  alignItems: 'center',
  width: '100%',
}))
