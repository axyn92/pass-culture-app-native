import { t } from '@lingui/macro'
import React, { ComponentProps, ComponentType, useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SeeMore } from 'features/home/atoms'
import { Cover } from 'features/home/atoms/Cover'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Playlist, RenderFooterItem, RenderHeaderItem } from 'ui/components/Playlist'
import { EyeSophisticated } from 'ui/svg/icons/EyeSophisticated'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
type Props = Pick<
  ComponentProps<typeof Playlist>,
  'data' | 'itemWidth' | 'itemHeight' | 'testID' | 'keyExtractor' | 'renderItem' | 'onEndReached'
> & {
  title: string
  TitleComponent?: ComponentType<ComponentProps<typeof Typo.Title3>>
  onPressSeeMore?: () => void
  coverUrl?: string | null
  onDarkBackground?: boolean
}

export const PassPlaylist = (props: Props) => {
  const TitleComponent = props.TitleComponent || Typo.Title3

  const { isTouch, colors } = useTheme()

  const showHeader = !!props.coverUrl
  const showTitleSeeMore = !!props.onPressSeeMore && !isTouch
  const showFooterSeeMore = !!props.onPressSeeMore && isTouch

  const titleSeparatorColor = props.onDarkBackground ? colors.white : colors.greyMedium
  const seeMoreColor = props.onDarkBackground ? colors.white : colors.primary

  const StyledTitleComponent = styled(TitleComponent).attrs({
    numberOfLines: 2,
  })<{ onDarkBackground?: boolean }>(({ onDarkBackground, theme }) => ({
    color: onDarkBackground ? theme.colors.white : theme.colors.black,
  }))

  const renderHeader: RenderHeaderItem = useCallback(
    ({ width, height }) => <Cover width={width} height={height} uri={props.coverUrl as string} />,
    [props.coverUrl]
  )
  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }) => (
      <SeeMore width={width} height={height} onPress={props.onPressSeeMore as () => void} />
    ),
    [props.onPressSeeMore]
  )

  return (
    <Container>
      <Row>
        <StyledTitleComponent testID="playlistTitle" onDarkBackground={props.onDarkBackground}>
          {props.title}
        </StyledTitleComponent>
        {!!showTitleSeeMore && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={4} />
            <TitleSeparator color={titleSeparatorColor} />
            <Spacer.Row numberOfSpaces={3} />
            <StyledTouchableOpacity
              onPress={props.onPressSeeMore}
              {...accessibilityAndTestId(
                t`Voir plus d’offres de la sélection` + ' ' + props.title
              )}>
              <EyeSophisticated color={seeMoreColor} size={getSpacing(4)} />
              <Spacer.Row numberOfSpaces={2} />
              <ButtonText onDarkBackground={props.onDarkBackground}>{t`En voir plus`}</ButtonText>
            </StyledTouchableOpacity>
          </React.Fragment>
        )}
      </Row>
      <Spacer.Column numberOfSpaces={4} />
      <Playlist
        testID="offersModuleList"
        data={props.data}
        itemHeight={props.itemHeight}
        itemWidth={props.itemWidth}
        scrollButtonOffsetY={props.itemHeight / 2}
        renderItem={props.renderItem}
        renderHeader={showHeader ? renderHeader : undefined}
        renderFooter={showFooterSeeMore ? renderFooter : undefined}
        keyExtractor={props.keyExtractor}
        onEndReached={props.onEndReached}
      />
    </Container>
  )
}

const Container = styled.View({
  paddingBottom: getSpacing(6),
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})

const TitleSeparator = styled.View<{ color?: ColorsEnum }>((props) => ({
  width: 1,
  height: getSpacing(5),
  backgroundColor: props.color,
}))

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
})

const ButtonText = styled(Typo.ButtonText)<{ onDarkBackground?: boolean }>(
  ({ onDarkBackground, theme }) => ({
    color: onDarkBackground ? theme.colors.white : theme.colors.primary,
  })
)
