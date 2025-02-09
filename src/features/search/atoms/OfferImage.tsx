import React from 'react'
import { useMemo } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { mapCategoryToIcon } from 'libs/parsers'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getShadow, getSpacing } from 'ui/theme'

interface Props {
  imageUrl: string | undefined
  categoryId?: CategoryIdEnum | null
}

export const OfferImage: React.FC<Props> = ({ categoryId, imageUrl }) => {
  const source = useMemo(() => ({ uri: imageUrl }), [imageUrl])
  const Icon = mapCategoryToIcon(categoryId || null)

  return (
    <Container>
      {imageUrl ? (
        <FastImage style={imageStyle} source={source} resizeMode={FastImage.resizeMode.cover} />
      ) : (
        <StyledImagePlaceholder Icon={Icon} />
      )}
    </Container>
  )
}

const borderRadius = 4
const width = getSpacing(16)
const height = getSpacing(24) // ratio 2/3

const imageStyle = { borderRadius, height, width }

const StyledImagePlaceholder = styled(ImagePlaceholder).attrs(({ theme }) => ({
  backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
  size: getSpacing(10),
  borderRadius,
}))``

const Container = styled.View(({ theme }) => ({
  width,
  height,
  borderRadius,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1),
    },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.greyDark,
    shadowOpacity: 0.2,
  }),
}))
