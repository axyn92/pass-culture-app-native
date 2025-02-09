import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
interface Props {
  visible: boolean
  testIdSuffix?: string
}

export const AppFullPageModal: FunctionComponent<Props> = ({ visible, children, testIdSuffix }) => {
  const { height: windowHeight } = useWindowDimensions()
  const maxHeight = windowHeight - theme.navTopHeight

  return visible ? (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent={true}
      visible={visible}
      testID={`modal-${testIdSuffix}`}>
      <Container activeOpacity={1} maxHeight={maxHeight}>
        {children}
      </Container>
    </Modal>
  ) : null
}
const Container = styled(TouchableOpacity)<{ maxHeight: number }>(({ maxHeight, theme }) => ({
  flex: 1,
  position: 'absolute',
  bottom: 0,
  alignItems: 'center',
  alignSelf: 'center',
  width: '100%',
  height: '100%',
  maxWidth: theme.appContentWidth,
  maxHeight: !theme.isMobileViewport ? maxHeight : '100%',
}))
