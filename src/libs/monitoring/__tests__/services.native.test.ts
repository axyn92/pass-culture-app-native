import * as SentryModule from '@sentry/react-native'

import { env } from 'libs/environment'

import { version } from '../../../../package.json'
import { eventMonitoring } from '../services'

describe('eventMonitoring', () => {
  describe('init()', () => {
    it("should call sentry's init() when enabled", () => {
      eventMonitoring.init({ enabled: true })
      expect(SentryModule.init).toBeCalledWith({
        dsn: env.SENTRY_DSN,
        environment: 'development',
        release: version,
        tracesSampleRate: 0.01,
      })
    })

    it("should NOT call sentry's init() when disabled", () => {
      eventMonitoring.init({ enabled: false })
      expect(SentryModule.init).not.toBeCalled()
    })
  })
})
