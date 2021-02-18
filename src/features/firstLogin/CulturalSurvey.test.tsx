import { act, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { useCurrentRoute } from 'features/navigation/helpers'
import { simulateWebviewMessage, superFlushWithAct } from 'tests/utils'

import { CulturalSurvey } from './CulturalSurvey'

const mockedUseCurrentRoute = useCurrentRoute as jest.MockedFunction<typeof useCurrentRoute>
jest.mock('features/navigation/helpers', () => ({
  useCurrentRoute: jest.fn(),
}))

beforeEach(() => {
  mockedUseCurrentRoute.mockReturnValue({ name: 'CulturalSurvey', key: 'key' })
})

afterEach(jest.clearAllMocks)

describe('<CulturalSurvey />', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not display webview when another screen is displayed', async () => {
    mockedUseCurrentRoute.mockReturnValue({ name: 'Home', key: 'key' })
    const renderAPI = await renderCulturalSurveyWithNavigation()

    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeFalsy()
  })

  it('should NOT close webview when emitted message is not "onClose"', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()

    const webview = renderAPI.getByTestId('cultural-survey-webview')
    simulateWebviewMessage(webview, '{ "message": "Something else" }')
    await superFlushWithAct()

    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
    expect(navigate).not.toBeCalled()
  })

  it('should update user profile with userId and NOT close webview when emitted message is "onSubmit"', async () => {
    const postnativev1meculturalSurveySpy = jest.spyOn(api, 'postnativev1meculturalSurvey')
    const renderAPI = await renderCulturalSurveyWithNavigation()

    const webview = renderAPI.getByTestId('cultural-survey-webview')
    simulateWebviewMessage(webview, '{ "message": "onSubmit", "userId": "fakeUserId" }')
    await superFlushWithAct()

    expect(postnativev1meculturalSurveySpy).toBeCalledWith({
      culturalSurveyId: 'fakeUserId',
      needsToFillCulturalSurvey: false,
    })
    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
    expect(navigate).not.toBeCalled()
  })

  it('should update user profile and close webview when emitted message is "onClose"', async () => {
    const postnativev1meculturalSurveySpy = jest.spyOn(api, 'postnativev1meculturalSurvey')
    const renderAPI = await renderCulturalSurveyWithNavigation()

    const webview = renderAPI.getByTestId('cultural-survey-webview')
    simulateWebviewMessage(webview, '{ "message": "onClose", "userId": "fakeUserId" }')
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Home', { shouldDisplayLoginModal: false })
    })
    expect(postnativev1meculturalSurveySpy).toBeCalledWith({
      culturalSurveyId: null,
      needsToFillCulturalSurvey: false,
    })
  })

  it('should NOT update user profile and only close webview when emitted message is "onClose" preceded by "onSubmit"', async () => {
    const postnativev1meculturalSurveySpy = jest.spyOn(api, 'postnativev1meculturalSurvey')
    const renderAPI = await renderCulturalSurveyWithNavigation()

    const webview = renderAPI.getByTestId('cultural-survey-webview')
    simulateWebviewMessage(webview, '{ "message": "onSubmit", "userId": "fakeUserId" }')
    await superFlushWithAct()

    expect(postnativev1meculturalSurveySpy).toHaveBeenNthCalledWith(1, {
      culturalSurveyId: 'fakeUserId',
      needsToFillCulturalSurvey: false,
    })

    simulateWebviewMessage(webview, '{ "message": "onClose", "userId": "fakeUserId" }')
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Home', { shouldDisplayLoginModal: false })
    })
    expect(postnativev1meculturalSurveySpy).toHaveBeenNthCalledWith(1, {
      culturalSurveyId: 'fakeUserId',
      needsToFillCulturalSurvey: false,
    })
  })

  it('should NOT close webview when navigation state has NOT url containing "app.passculture"', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()

    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onNavigationStateChange({ url: 'app.example' })
    })
    await superFlushWithAct()

    expect(renderAPI.queryByTestId('cultural-survey-webview')).toBeTruthy()
    expect(navigate).not.toBeCalled()
  })

  it('should close webview when navigation state has url containing "app.passculture"', async () => {
    const renderAPI = await renderCulturalSurveyWithNavigation()

    act(() => {
      const webview = renderAPI.getByTestId('cultural-survey-webview')
      webview.props.onNavigationStateChange({ url: 'app.passculture-testing' })
    })
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Home', { shouldDisplayLoginModal: false })
    })
  })
})

async function renderCulturalSurveyWithNavigation() {
  const renderAPI = render(<CulturalSurvey />)
  await superFlushWithAct()
  return renderAPI
}
