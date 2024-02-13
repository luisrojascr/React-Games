import React from 'react'

import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

import DiamondRevealedNobg from 'assets/images/gameSection/Mines/diamond-revealed-nobg.svg'
import DiamondUserRevealedNobg from 'assets/images/gameSection/Mines/diamond-user-revealed-nobg.svg'
import MineRevealedNobg from 'assets/images/gameSection/Mines/mine-revealed-nobg.svg'
import MineUserRevealedNobg from 'assets/images/gameSection/Mines/mine-user-revealed-nobg.svg'

import {
  MineTileProps,
  TileStateEnum,
  MinesStateActionsEnum
} from './mines-types'
import { useMinesStateContext } from './mines-context'

const TileVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    transition: { ease: 'easeOut', duration: 0.2 }
  },

  visibleDiamond: {
    opacity: 1,
    scale: 1,
    transition: { ease: 'easeOut', duration: 0.2 }
  },
  visibleMine: {
    opacity: 1,
    scale: [0.55, 1.6, 1],
    transition: { ease: 'easeOut', duration: 0.4 }
  },

  coverAnimation: {
    scale: [1, 1.2, 1.2, 0.9, 0.8, 0.9, 1],
    transition: { /*  ease: 'easeInOut', */ duration: 0.75 }
  }
}

const generateBackgroundImage = (
  tileState: TileStateEnum,
  isMine?: boolean
): string => {
  if (tileState === TileStateEnum.UserRevealed) {
    if (isMine) {
      return `background-image: url(${MineUserRevealedNobg});`
    }
    return `background-image: url(${DiamondUserRevealedNobg});`
  }
  if (tileState === TileStateEnum.Revealed) {
    if (isMine) {
      return `background-image: url(${MineRevealedNobg});`
    }
    return `background-image: url(${DiamondRevealedNobg});`
  }

  return ''
}

export default function Tile({
  isMine,
  tileState,
  id
}: // onMineClickCallback,
MineTileProps): JSX.Element {
  const controls = useAnimation()
  const { gameInProgress, handleTileClick } = useMinesStateContext()

  const handleTileClickMain = (): void => {
    if (!gameInProgress) return
    if (tileState !== TileStateEnum.Hidden) return
    handleTileClick(id)
  }

  return (
    <TileButton
      $isMine={isMine}
      $tileState={tileState}
      onClick={handleTileClickMain}
      style={{
        border:
          isMine && tileState === TileStateEnum.UserRevealed
            ? 'solid 2px #fe330d'
            : !isMine && tileState === TileStateEnum.UserRevealed
            ? 'solid 2px #00ee67'
            : tileState === TileStateEnum.Revealed
            ? 'solid 1px #47558a'
            : '2px solid transparent'
      }}
    >
      <AnimatePresence>
        {(tileState === TileStateEnum.UserRevealed ||
          tileState === TileStateEnum.Revealed) && (
          <TileContent
            initial="hidden"
            animate={isMine ? 'visibleMine' : 'visibleDiamond'}
            exit="hidden"
            variants={TileVariants}
            imageName={generateBackgroundImage(tileState, isMine)}
          />
        )}
      </AnimatePresence>
      <TileCover animate={controls} variants={TileVariants} state={tileState} />
    </TileButton>
  )
}

const TileButton = styled.button<{
  $tileState: TileStateEnum
  $isMine: boolean | undefined
}>`
  position: relative;
  font-size: 1.5em;
  border-radius: 4px;
  transition-duration: 300ms;
  transition-property: background-color, box-shadow;
  padding: 0;
  margin: 0;

  ${(props): string | false =>
    props.$tileState !== TileStateEnum.Hidden &&
    ' background-color: rgb(17, 26, 65);'}

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  &::active {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 1;
  }
`

/* const TileRevealed = styled.button`
  border: solid 1px rgb(71, 85, 138);
  background-color: rgb(17, 26, 65);
`; */

const TileCover = styled(motion.div)<{ state: TileStateEnum | undefined }>`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  transition-duration: 300ms;
  transition-property: background-color;
  box-shadow: 0 3px 0 0 rgb(17, 26, 65);
  border-radius: 0.3em;
  background-color: rgb(71, 82, 124);

  opacity: ${(props): string =>
    props.state === TileStateEnum.Hidden ? '1' : '0'};

  &:hover {
    background-color: rgb(104, 117, 167);
    transition-duration: 300ms;
    transition-property: background-color, box-shadow;
  }
`

const TileContent = styled(motion.div)<{ imageName: string }>`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;

  ${(props): string => props.imageName}
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: rgb(17, 26, 65)
    /*   & > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    touch-action: manipulation;
  } */
    & svg {
    width: 100%;
    height: 100%;
    transform: translate3d(0px, 0px, 0px);
  }
`

// Content revealed at end or bomb img:
// transform: scale(0.7);
// background-image: url('../../Icons/Games/Mines/mine-user-revealed.svg');
