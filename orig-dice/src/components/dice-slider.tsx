import React, { useContext, useEffect } from 'react'

import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'

import useSound from 'use-sound'

import { DiceContext } from './dice-context'

import { round } from 'utils/helper'
import DiceShapeIcon from 'assets/images/DiceShapeIcon'

import diceSelectorSound from 'assets/sounds/selector-move.mp3'
import { DiceRollConditionEnum } from 'utils'

const DiceVariants = {
  visible: {
    scale: [1, 1, 1, 1.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.6],
    opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    transition: { ease: 'easeInOut', duration: 2.8 },
  },
}

interface Props {
  resize: boolean
}

function DiceSlider({ resize }: Props): JSX.Element {
  const {
    numberRolled,
    setrollOverUnder,
    rollOverUnder,
    isRollOverOrUnder,
    gameInProgress,
    setWinChance,
    setCashout,
    autoBetInProgress,
    resetBoard,

    isSound
  } = useContext(DiceContext)

  const [playSelectorSound] = useSound(diceSelectorSound)

  useEffect(() => {
    resetBoard(false)
  }, [])

  const controls = useAnimation()

  useEffect(() => {
    controls.start('visible')
  }, [numberRolled])

  const handlerollOverUnderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (isSound) {
      playSelectorSound()
    }
    const newValue = event.target.value
    if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
      setrollOverUnder(parseFloat(newValue).toFixed(2))
      setWinChance((100 - parseFloat(newValue)).toFixed(2))
      setCashout(round(99 / (100 - parseFloat(newValue)), 4).toString())
    } else {
      setrollOverUnder(round(newValue, 2).toFixed(2))
      setWinChance(parseFloat(newValue).toFixed(2))
      setCashout(round(99 / parseFloat(newValue), 4).toString())
    }
  }

  return (
    <DiceSliderWrapper $resize={resize}>
      <BreakpointsWrapper>
        <BreakPointWrapper style={{ left: '0%' }}>
          <BreakPointValue>
            <span>{0}</span>
          </BreakPointValue>
        </BreakPointWrapper>
        <BreakPointWrapper style={{ left: '25%' }}>
          <BreakPointValue>
            <span>{25}</span>
          </BreakPointValue>
        </BreakPointWrapper>
        <BreakPointWrapper style={{ left: '50%' }}>
          <BreakPointValue>
            <span>{50}</span>
          </BreakPointValue>
        </BreakPointWrapper>
        <BreakPointWrapper style={{ left: '75%' }}>
          <BreakPointValue>
            <span>{75}</span>
          </BreakPointValue>
        </BreakPointWrapper>
        <BreakPointWrapper style={{ left: '100%' }}>
          <BreakPointValue>
            <span>{100}</span>
          </BreakPointValue>
        </BreakPointWrapper>
      </BreakpointsWrapper>
      <SliderContent>
        <DiceShapeWrapper
          style={{ transform: `translate(${numberRolled - 5}%, -50%)` }}
        >
          <DiceWrapper
            animate={controls}
            variants={DiceVariants}
          >
            <DiceShapeIcon
              fill={
                (isRollOverOrUnder === DiceRollConditionEnum.Over &&
                  numberRolled > round(rollOverUnder, 2)) ||
                (isRollOverOrUnder === DiceRollConditionEnum.Under &&
                  numberRolled < round(rollOverUnder, 2))
                  ? '#01d180'
                  : '#ff2c55'
              }
              width="50px"
              height="56px"
              style={{ display: 'block', userSelect: 'none' }}
            />
            <Result>
              <span>{numberRolled}</span>
            </Result>
          </DiceWrapper>
        </DiceShapeWrapper>

        <RangeSliderWrapper>
          <RangeSliderLower
            $changeColor={isRollOverOrUnder === DiceRollConditionEnum.Over}
          />
          <RangeSliderHigher
            $changeColor={isRollOverOrUnder === DiceRollConditionEnum.Under}
            style={{ width: `${rollOverUnder}%` }}
          />
        </RangeSliderWrapper>
        <InputSlider
          disabled={gameInProgress || autoBetInProgress}
          type="range"
          min="2"
          max="98"
          data-testid="dice-slider-input"
          value={rollOverUnder}
          onChange={handlerollOverUnderChange}
        />
      </SliderContent>
    </DiceSliderWrapper>
  )
}

export default DiceSlider

const SliderContent = styled.div`
  position: relative;
  height: 24px;

  & input[type='range']::range-thumb {
    position: relative;
    pointer-events: all;
    width: 40px;
    height: 40px;
    border-radius: 5.6px;
    box-shadow: -6px 0 0 0 rgba(0, 0, 0, 0.16), 6px 0 0 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    background-image: url(${'../../Icons/ThumbArrows.svg'});
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    &:active {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:after {
      position: absolute;
      content: '';
      width: 5px;
      height: 5px;
      background: red;
    }
  }

  & input[type='range']::-ms-thumb {
    position: relative;
    pointer-events: all;
    width: 40px;
    height: 40px;
    border-radius: 5.6px;
    box-shadow: -6px 0 0 0 rgba(0, 0, 0, 0.16), 6px 0 0 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    background-image: url(${'/src/assets/images/gameSection/Dice/ThumbArrows.svg'});
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    &:active {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:after {
      position: absolute;
      content: '';
      width: 5px;
      height: 5px;
      background: red;
    }
  }

  & input[type='range']::-moz-range-thumb {
    position: relative;
    pointer-events: all;
    width: 40px;
    height: 40px;
    border-radius: 5.6px;
    box-shadow: -6px 0 0 0 rgba(0, 0, 0, 0.16), 6px 0 0 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    background-image: url(${'/src/assets/images/gameSection/Dice/ThumbArrows.svg'});
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    &:active {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:after {
      position: absolute;
      content: '';
      width: 5px;
      height: 5px;
      background: red;
    }
  }

  & input[type='range']::-webkit-slider-thumb {
    position: relative;
    pointer-events: all;
    width: 40px;
    height: 40px;
    border-radius: 5.6px;
    box-shadow: -6px 0 0 0 rgba(0, 0, 0, 0.16), 6px 0 0 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    background-image: url(${'/src/assets/images/gameSection/Dice/ThumbArrows.svg'});
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    &:active {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }

    &:disabled {
      cursor: not-allowed;
    }

    -webkit-appearance: none;

    &:after {
      position: absolute;
      content: '';
      width: 5px;
      height: 5px;
      background: red;
    }
  }
`

const DiceShapeWrapper = styled.div`
  position: absolute;
  display: flex;
  bottom: 50%;
  left: 0px;
  right: 0px;
  z-index: 5;
  pointer-events: none;
  will-change: transform;
  transition: transform 400ms ease 0s;
  user-select: none;
`

const DiceWrapper = styled(motion.div)<{
  animation?: boolean
}>`
  position: relative;
  transform-origin: center bottom;
  transition: all 0.3s ease 0s;
`

const Result = styled.span`
  font-family: 'Open Sans',serif;
  font-size: 14px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  position: absolute;
  width: max-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 100ms ease 0s;
`

const RangeSliderWrapper = styled.div`
  pointer-events: none;
  height: 24px;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  border-radius: 100px;
  transition: opacity 300ms ease 0s;
  overflow: hidden;
`

const RangeSliderLower = styled.div<{ $changeColor: boolean }>`
  position: absolute;
  height: 24px;
  width: 100%;
  right: 0px;
  top: 0px;
  background-color: ${(props): string =>
    props.$changeColor ? '#01d180' : '#ff2c55'};
  border-radius: 100px;

  &::after {
    content: '';
    bottom: 0px;
    position: absolute;
    width: 100%;
    height: 12px;
    background-color: #000000;
    opacity: 0.23;
  }
`

const RangeSliderHigher = styled.div<{ $changeColor: boolean }>`
  position: absolute;
  height: 24px;
  top: 0px;
  left: 0px;
  background-color: ${(props): string =>
    props.$changeColor ? '#01d180' : '#ff2c55'};
  border-radius: 100px;

  &::after {
    content: '';
    bottom: 0px;
    position: absolute;
    width: 100%;
    height: 12px;
    background-color: #000000;
    opacity: 0.23;
  }
`

const InputSlider = styled.input`
  -webkit-overflow-scrolling: touch;
  font-size: 14px;
  @media (max-width: 1030px) {
    font-size: 16px;
  }
  -webkit-appearance: none;
  touch-action: manipulation;
  width: 100%;
  position: absolute;
  z-index: 10;
  top: 0px;
  height: 24px;
  outline: none;
  pointer-events: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0);

  &:disabled {
    cursor: not-allowed !important;
  }
`

// Layout styles

const DiceSliderWrapper = styled.div<{ $resize: boolean }>`
  position: relative;
  width: 100%;
  max-width: 633px;
  text-align: left;
  border-radius: 31px;
  padding: 1.5em;
  border: solid 1px #313d6b;
  background-color: #111a41;
  margin: ${(props): string => (props.$resize ? '5em 0px 1em' : '4em 0px')};
`

const BreakpointsWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  left: calc(1.5em + 15px);
  right: calc(1.5em + 15px);
`

const BreakPointWrapper = styled.span`
  position: absolute;
  text-align: center;
  transform: translate(-50%, 0px);
`

const BreakPointValue = styled.span`
  position: absolute;
  display: flex;
  left: 50%;
  bottom: 0px;

  font-family: 'Open Sans',serif;
  font-size: 12px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;

  &::after {
    content: '';
    bottom: 0px;
    position: absolute;
    transform: translate(-50%, 0px);
    width: 0px;
    height: 0px;
    border-color: transparent transparent #111a41;
    border-style: solid;
    border-width: 0px 8px 6px;
  }

  & span {
    width: 4ch;
    left: 50%;
    position: absolute;
    bottom: 100%;
    transform: translate(-45%, -20%);
  }
`
