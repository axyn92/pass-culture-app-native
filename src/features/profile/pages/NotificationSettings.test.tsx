import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import { Platform } from 'react-native'
import * as RNP from 'react-native-permissions'
import { NotificationsResponse, PermissionStatus } from 'react-native-permissions'
import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { IAuthContext, useAuthContext } from 'features/auth/AuthContext'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { NotificationSettings } from './NotificationSettings'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as Record<string, unknown>),
  useRoute: jest.fn().mockImplementation(() => ({
    key: 'ksdqldkmqdmqdq',
  })),
}))

describe('NotificationSettings', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should display the both switches on ios', async () => {
    Platform.OS = 'ios'
    const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
    await waitFor(() => {
      queryByText('Autoriser l’envoi d’e\u2011mails')
      queryByText('Autoriser les notifications marketing')
    })
  })
  it('should only display the email switch on android', async () => {
    Platform.OS = 'android'
    const { queryByText } = await renderNotificationSettings('granted', {} as UserProfileResponse)
    await waitFor(() => {
      queryByText('Autoriser l’envoi d’e\u2011mails')
    })
  })
  describe('Push switch (only iOS)', () => {
    it('should display an enabled switch', async () => {
      Platform.OS = 'ios'
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      const pushSwitch = getByTestId('push-switch-background')
      await waitForExpect(() => expect(pushSwitch.props.active).toBeTruthy())
    })
    it.each<[PermissionStatus, boolean]>([
      ['unavailable', true],
      ['blocked', true],
      ['denied', true],
      ['limited', true],
      ['granted', false],
    ])(
      'should display a disabled switch when permission="%s" and marketingPush="%s"',
      async (permission, marketingPush) => {
        Platform.OS = 'ios'
        const { getByTestId } = await renderNotificationSettings(permission, {
          subscriptions: {
            marketingEmail: false,
            marketingPush,
          },
        } as UserProfileResponse)
        const pushSwitch = getByTestId('push-switch-background')
        await waitForExpect(() => expect(pushSwitch.props.active).toBeFalsy())
      }
    )
  })
  describe('Save button behavior', () => {
    it('should enable the save button when the email switch changed', async () => {
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: true,
          marketingPush: true,
        },
      } as UserProfileResponse)

      await waitFor(() => {
        const toggleButton = getByTestId('email')
        fireEvent.press(toggleButton)
      })

      let saveButton: ReactTestInstance | null = null
      await waitFor(() => {
        saveButton = getByTestId('button-container')
        expect(saveButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })

      saveButton && fireEvent.press(saveButton)

      await waitFor(() => {
        saveButton = getByTestId('button-container')
        expect(saveButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
      })
    })
    it('should enable the save button when the push switch changed', async () => {
      Platform.OS = 'ios'
      mockApiUpdateProfile({
        subscriptions: {
          marketingEmail: false,
          marketingPush: true,
        },
      } as UserProfileResponse)
      const { getByTestId } = await renderNotificationSettings('granted', {
        subscriptions: {
          marketingEmail: false,
          marketingPush: false,
        },
      } as UserProfileResponse)

      await waitFor(() => {
        const toggleButton = getByTestId('push')
        fireEvent.press(toggleButton)
      })

      let saveButton: ReactTestInstance | null = null
      await waitFor(() => {
        saveButton = getByTestId('button-container')
        expect(saveButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY)
      })

      saveButton && fireEvent.press(saveButton)

      await waitFor(() => {
        saveButton = getByTestId('button-container')
        expect(saveButton.props.style.backgroundColor).toEqual(ColorsEnum.PRIMARY_DISABLED)
      })
    })
  })
})

const Stack = createStackNavigator<RootStackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

async function renderNotificationSettings(
  expectedPermission: NotificationsResponse['status'],
  user?: UserProfileResponse
) {
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true } as IAuthContext))

  const checkNotifications = jest.spyOn(RNP, 'checkNotifications')
  checkNotifications.mockResolvedValue({
    status: expectedPermission,
    settings: {},
  })

  mockApiGetMe(user)

  const wrapper = render(
    reactQueryProviderHOC(
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="NotificationSettings">
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  )

  await act(async () => {
    await flushAllPromises()
  })

  return wrapper
}

const mockApiGetMe = (user?: UserProfileResponse) => {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(user))
    })
  )
}

const mockApiUpdateProfile = (user?: UserProfileResponse) => {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/profile', (_req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(user))
    })
  )
}
