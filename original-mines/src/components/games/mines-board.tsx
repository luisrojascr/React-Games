import styled from 'styled-components'

import Tile from './tile'
import { useMinesStateContext } from './mines-context'
import { useDimensions } from 'hooks/useDimensions'
import { decimalDisplayLength } from 'utils/helper'

const mainBoardBreakpoints = {
  first: 780,
  second: 510,
  third: 395
}

export default function MinesBoard(): JSX.Element {
  const { ref, dimensions } = useDimensions()
  const {
    cardStatus,
    totalMultiplier,
    betAmount,
    gameInProgress,
    currentWalletState,
    selectedFiatCurrency
  } = useMinesStateContext()

  return (
    <MinesGameWrapper
      ref={ref}
      $mobile={dimensions.width <= mainBoardBreakpoints.second}
      style={{ width: '100%', maxHeight: '575px' }}
    >
      {!gameInProgress && totalMultiplier > 1 && (
        <MinesResultCardWrapper>
          <div>{totalMultiplier}X</div>
          <div>
            {selectedFiatCurrency}{' '}
            {(parseFloat(betAmount) * totalMultiplier).toFixed(
              decimalDisplayLength(currentWalletState.type)
            )}
          </div>
        </MinesResultCardWrapper>
      )}
      <MinesGrid>
        {cardStatus.map((tile) => {
          return (
            <Tile
              id={tile.id}
              index={tile.index}
              isMine={tile.isMine}
              tileState={tile.state}
              key={tile.id.toString()}
            />
          )
        })}
      </MinesGrid>
    </MinesGameWrapper>
  )
}

const MinesGameWrapper = styled.div<{ $mobile: boolean }>`
  position: relative;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  flex-direction: column;
  -webkit-box-flex: 1;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  /* padding: ${(props): string => (props.$mobile ? '8px' : '25px')}; */
`

const MinesGrid = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  max-width: 560px;
  grid-template-columns: repeat(5, auto);
  gap: 1em;
  padding: 1em;
  font-size: 1em;
`

const MinesResultCardWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 166px;
  min-width: 166px;
  z-index: 10;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & div:first-child {
    border-radius: 4px;
    border: solid 2px #01d180;
    padding: 40px 15px;
    font-family: 'Open Sans', serif;
    font-size: 32px;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 2.67px;
    text-align: center;
    color: #ffffff;

    border-bottom: none;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background-color: #111a41;

    white-space: nowrap;
  }

  & div:last-child {
    border-radius: 4px;
    background-color: #01d180;
    font-family: 'Open Sans', serif;
    font-size: 12px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: 1px;
    text-align: center;
    color: #111a41;

    padding: 10px;

    border-top-left-radius: 0px;
    border-top-right-radius: 0px;

    white-space: nowrap;
  }
`
