import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.FC<IconInterface>
  caption: string
  testID?: string
  isDisabled?: boolean | false
}

export const IconWithCaption = ({ Icon, caption, testID, isDisabled }: IconWithCaptionProps) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.standard,
    color: theme.colors.greyDark,
  }))``

  return (
    <Container>
      <IconContainer>
        <StyledIcon testID={testID} />
      </IconContainer>
      <Spacer.Column numberOfSpaces={1} />
      <Caption testID={`caption-${testID}`} disabled={isDisabled}>
        {caption}
      </Caption>
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })

const IconContainer = styled.View({ padding: getSpacing(1) })

const Caption = styled(Typo.Caption)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
  textAlign: 'center',
}))
