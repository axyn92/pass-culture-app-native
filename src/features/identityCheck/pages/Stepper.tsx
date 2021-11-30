import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { QuitIdentityCheckModal } from 'features/identityCheck/components/QuitIdentityCheckModal'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckSteps } from 'features/identityCheck/useIdentityCheckSteps'
import { useGetStepState } from 'features/identityCheck/utils/useGetStepState'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { useModal } from 'ui/components/modals/useModal'
import { Background } from 'ui/svg/Background'
import { Spacer, Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const IdentityCheckStepper = () => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const steps = useIdentityCheckSteps()
  const getStepState = useGetStepState()
  const context = useIdentityCheckContext()

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  useEffect(() => {
    if (context.step === null && steps[0])
      context.dispatch({ type: 'SET_STEP', payload: steps[0].name })
  }, [steps.length])

  return (
    <React.Fragment>
      <CenteredContainer>
        <Background />
        <Container>
          <Spacer.TopScreen />
          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          <Title>{t`C’est très rapide !`}</Title>
          <Spacer.Column numberOfSpaces={2} />

          <StyledBody>{t`Voici les 3 étapes que tu vas devoir suivre.`}</StyledBody>
          {theme.isDesktopViewport ? <Spacer.Column numberOfSpaces={2} /> : <Spacer.Flex />}

          {steps.map((step) => (
            <StepButton
              key={step.name}
              step={step}
              state={getStepState(step.name)}
              onPress={() => navigate(step.screens[0])}
            />
          ))}

          {theme.isDesktopViewport ? (
            <Spacer.Column numberOfSpaces={10} />
          ) : (
            <Spacer.Flex flex={2} />
          )}

          <ButtonTertiaryWhite title={t`Abandonner`} onPress={showFullPageModal} />
        </Container>
      </CenteredContainer>
      <QuitIdentityCheckModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="quit-identity-check-stepper"
        // TODO (LucasBeneston) use current state for analytics
        // identityCheckStep={steps[1].name}
      />
    </React.Fragment>
  )
}

const Title = styled(Typo.Title3).attrs({ color: ColorsEnum.WHITE })({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body).attrs({ color: ColorsEnum.WHITE })({
  textAlign: 'center',
})

const CenteredContainer = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  padding: getSpacing(5),
  width: '100%',
  maxWidth: getSpacing(125),
})
