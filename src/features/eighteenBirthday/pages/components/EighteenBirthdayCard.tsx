import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useDepositAmount, useGetIdCheckToken } from 'features/auth/api'
import { useNavigateToIdCheck } from 'features/auth/signup/idCheck/useNavigateToIdCheck'
import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { MonitoringError } from 'libs/errorMonitoring'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { AchievementCardKeyProps, GenericAchievementCard } from 'ui/components/achievements'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function EighteenBirthdayCard(props: AchievementCardKeyProps) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: idCheckTokenResponse } = useGetIdCheckToken(true)
  const { data: profile } = useUserProfileInfo()
  const { showInfoSnackBar } = useSnackBarContext()
  const depositAmount = useDepositAmount()
  const deposit = depositAmount.replace(' ', '')

  function navigateToIdCheckUnavailable() {
    navigate('IdCheckUnavailable')
  }

  const navigateToIdCheck = useNavigateToIdCheck({
    onIdCheckNavigationBlocked: navigateToIdCheckUnavailable,
  })

  function onButtonPress() {
    if (profile && idCheckTokenResponse?.token) {
      navigateToIdCheck(profile.email, idCheckTokenResponse.token)
    } else if (profile && !idCheckTokenResponse?.token) {
      // TODO: when backend treat non eligible as an error instead of null, change this error handling
      throw new MonitoringError(
        t`Nous ne pouvons pas vérifier ton identité pour le moment, reviens plus tard !`,
        'NotEligibleIdCheckError'
      )
    } else {
      // TODO: remove after POs validation this will happen only when POs access this page without auth
      navigate('Login')
      showInfoSnackBar({
        message: t`Tu n'es pas connecté !`,
      })
    }
  }

  return (
    <React.Fragment>
      <GenericAchievementCard
        animation={TutorialPassLogo}
        buttonCallback={onButtonPress}
        buttonText={t`Vérifier mon identité`}
        pauseAnimationOnRenderAtFrame={62}
        subTitle={t`Tu as 18 ans...`}
        text={t({
          id: 'id check explanation',
          values: { deposit },
          message:
            'Tu pourras bénéficier des {deposit} offerts par le Ministère de la Culture dès que tu auras vérifié ton identité',
        })}
        title={t`Bonne nouvelle !`}
        swiperRef={props.swiperRef}
        name={props.name}
        index={props.index}
        activeIndex={props.activeIndex}
        lastIndex={props.lastIndex}
        skip={props.skip}
      />
    </React.Fragment>
  )
}
