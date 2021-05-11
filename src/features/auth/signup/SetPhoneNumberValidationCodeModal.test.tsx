import React from 'react'
import waitForExpect from 'wait-for-expect'

import { SetPhoneNumberValidationCodeModal } from 'features/auth/signup/SetPhoneNumberValidationCodeModal'
import { contactSupport } from 'features/auth/support.services'
import { fireEvent, render } from 'tests/utils'
import * as ModalModule from 'ui/components/modals/useModal'
import { ColorsEnum } from 'ui/theme'

describe('SetPhoneNumberValidationCodeModal', () => {
  describe('modal header', () => {
    it('should open the quit modal on press right icon', () => {
      const visible = false
      const showModal = jest.fn()
      const uselessFunction = jest.fn()

      const useModalMock = jest.spyOn(ModalModule, 'useModal').mockReturnValue({
        visible,
        showModal,
        hideModal: uselessFunction,
        toggleModal: uselessFunction,
      })

      const { getByTestId } = renderSetPhoneValidationCode()

      const rightIconButton = getByTestId('rightIconButton')

      rightIconButton.props.onClick()
      expect(showModal).toBeCalled()

      useModalMock.mockRestore()
    })

    it('should call onGoBack property on press left arrow', () => {
      const mockOnGoBack = jest.fn()
      const { getByTestId } = renderSetPhoneValidationCode({ onGoBack: mockOnGoBack })

      const leftArrow = getByTestId('leftIconButton')
      fireEvent.press(leftArrow)
      expect(mockOnGoBack).toHaveBeenCalled()
    })
  })

  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      const { findByText } = renderSetPhoneValidationCode()

      const contactSupportButton = await findByText('Contacter le support')
      fireEvent.press(contactSupportButton)

      await waitForExpect(() => {
        expect(contactSupport.forPhoneNumberConfirmation).toHaveBeenCalled()
      })
    })
  })

  describe('Continue button', () => {
    it('should enable continue button if input is valid and complete', async () => {
      const { getByTestId, rerender } = renderSetPhoneValidationCode()

      const continueButton = getByTestId('button-container-continue')
      expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)

      const codeInputContainer = getByTestId('code-input-container')
      for (let i = 0; i < codeInputContainer.props.children.length; i++) {
        fireEvent.changeText(getByTestId(`input-${i}`), '1')
        rerender(
          <SetPhoneNumberValidationCodeModal
            dismissModal={jest.fn()}
            visible={true}
            phoneNumber={'0612345678'}
            onGoBack={jest.fn()}
          />
        )
      }

      await waitForExpect(() => {
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })
    })

    it.each([
      ['empty', ''],
      ['includes string', 's09453'],
      ['is too short', '54'],
    ])('should not enable continue button when "%s"', async (_reason, codeTyped) => {
      const { getByTestId, rerender } = renderSetPhoneValidationCode()

      const continueButton = getByTestId('button-container-continue')

      for (let i = 0; i < codeTyped.length; i++) {
        fireEvent.changeText(getByTestId(`input-${i}`), codeTyped[i])
        rerender(
          <SetPhoneNumberValidationCodeModal
            dismissModal={jest.fn()}
            visible={true}
            phoneNumber={'0612345678'}
            onGoBack={jest.fn()}
          />
        )
      }

      await waitForExpect(() => {
        expect(continueButton.props.style.backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
      })
    })
  })
})

function renderSetPhoneValidationCode(customProps?: any) {
  const props = {
    dismissModal: jest.fn(),
    visible: true,
    phoneNumber: '0612345678',
    onGoBack: jest.fn(),
    ...customProps,
  }
  return render(<SetPhoneNumberValidationCodeModal {...props} />)
}