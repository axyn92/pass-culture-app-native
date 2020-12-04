import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { PlacePointer } from 'ui/svg/icons/PlacePointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { OfferIconCaptions } from '../components/OfferIconCaptions'

type Props = StackScreenProps<RootStackParamList, 'Offer'>

export const Offer: FunctionComponent<Props> = ({ route }: Props) => {
  const { id, algoliaHit } = route.params
  const placeName = algoliaHit?.venue.publicName || algoliaHit?.venue.name

  return (
    <Container>
      <Typo.Hero>{_(t`Offer`)}</Typo.Hero>
      <Typo.Caption testID="offerId">{id}</Typo.Caption>
      <MarginContainer>
        <Title testID="offerTitle" numberOfLines={3} adjustsFontSizeToFit>
          {algoliaHit?.offer.name}
        </Title>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={2} />
      <OfferIconCaptions algoliaHit={algoliaHit} />

      {algoliaHit?.offer.isDigital ? (
        <React.Fragment />
      ) : (
        <PlaceContainer>
          <StyledView>
            <PlacePointer size={16} />
            <StyledText numberOfLines={1}>{`${placeName}, `}</StyledText>
          </StyledView>
          <Typo.Caption numberOfLines={1}>{algoliaHit?.venue.city}</Typo.Caption>
        </PlaceContainer>
      )}
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({ alignItems: 'center' })
const Title = styled(Typo.Title3)({ textAlign: 'center' })

const MarginContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const PlaceContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
})

const StyledText = styled(Typo.Caption)({
  flexShrink: 1,
})

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
