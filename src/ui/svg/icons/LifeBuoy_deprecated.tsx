import * as React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { IconInterface } from './types'

export const LifeBuoyDeprecated: React.FunctionComponent<IconInterface> = ({
  size = 32,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" testID={testID}>
    <G fill="none" fillRule="evenodd">
      <G fill={color}>
        <G>
          <Path
            d="M9.054 8.71c3.851-3.67 9.95-3.613 13.732.17 1.045 1.045 1.826 2.287 2.311 3.65.39 1.093.581 2.246.57 3.405-.01.914-.146 1.822-.405 2.698-.462 1.558-1.303 2.981-2.475 4.154-3.84 3.84-10.067 3.84-13.907 0S5.04 12.72 8.88 8.88zm3.97 10.638l-.017.018-3.057 3.057c3.345 2.992 8.42 2.992 11.765 0l-3.073-3.074c-1.639 1.313-3.982 1.312-5.619-.001zM9.242 9.95c-2.991 3.345-2.991 8.42 0 11.765l3.057-3.057.019-.015c-1.314-1.638-1.314-3.98-.002-5.62zm13.181 0l-3.075 3.074c1.312 1.638 1.312 3.98 0 5.617l3.074 3.074c.876-.979 1.512-2.125 1.88-3.367.233-.787.355-1.603.363-2.424.011-1.042-.161-2.078-.51-3.06-.381-1.069-.965-2.055-1.732-2.913zm-4.12 3.404c-1.367-1.364-3.58-1.362-4.945.004.003-.003.001-.002 0 0l-.005.004-.109.115c-1.206 1.323-1.215 3.346-.028 4.68l.142.15c1.366 1.367 3.582 1.367 4.95 0 1.366-1.367 1.366-3.582-.001-4.95.002.003.001.002 0 0zm-8.461-.493c.256.103.38.395.275.65-.515 1.27-.591 2.682-.22 4 .076.265-.079.542-.345.617-.265.075-.542-.08-.617-.346-.432-1.53-.343-3.171.256-4.646.103-.256.395-.38.65-.275zm11.872-3.62c-3.344-2.99-8.42-2.99-11.765.002l3.075 3.073c1.638-1.312 3.98-1.312 5.617 0z"
            transform="translate(-24 -532) translate(24 532)"
          />
        </G>
      </G>
    </G>
  </Svg>
)