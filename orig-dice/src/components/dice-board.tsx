import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import PastBetButton from './common/paste-pet-button'
import DiceSlider from './dice-slider'

import { DiceContext, Bet } from './dice-context'
import DiceWheel from './dice-wheel'
import { useDimensions } from 'hooks/useDimensions'
import {
  round,
  getCashoutValueFromWinChance,
  getWinChancefromCashout,
  numberOnly
} from 'utils/helper'
import { Tooltip } from './common/tooltip'
import { useTranslation } from 'react-i18next'
import CloserIconX from 'assets/images/CloseIconX'
import RefreshIcon from 'assets/images/RefreshIcon'
import PercentIcon from 'assets/images/PercentIcon'
import DiceWheelIcon from 'assets/images/diceWheelIcon.png'
import DiceIcon from 'assets/images/diceIcon.png'
import { DiceRollConditionEnum } from 'utils'

export enum DiceVariants {
  SLIDER = 'SLIDER',
  WHEEL = 'WHEEL'
}

export enum CalcsOptions {
  CASHOUT = 'CASHOUT',
  ROLLOVER_UNDER = 'ROLLOVER_UNDER',
  WIN_CHANCE = 'WIN_CHANCE'
}

export const MIN_PAYOUT = 1
export const MAX_PAYOUT = 49.5
export const MIN_WIN_CHANCE = 2.0
export const MAX_WIN_CHANCE = 98.0

const mainBoardBreakpoints = {
  first: 780,
  second: 510,
  third: 395
}

function DiceBoard(): JSX.Element {
  const {
    isRollOverOrUnder,
    setIsRollOverOrUnder,
    setrollOverUnder,
    rollOverUnder,
    gameInProgress,
    setWinChance,
    winChance,
    cashout,
    setCashout,
    autoBetInProgress,
    setRotateBoxTo,
    pastBets
  } = useContext(DiceContext)

  const { ref, dimensions } = useDimensions()
  const [resizeSecond, setresizeSecond] = useState<boolean>(false)
  const [diceVariant, setDiceVariant] = useState<DiceVariants>(
    DiceVariants.SLIDER
  )
  const { t } = useTranslation()

  useEffect(() => {
    if (!resizeSecond && dimensions.width <= mainBoardBreakpoints.second) {
      setresizeSecond(true)
    }

    if (resizeSecond && dimensions.width > mainBoardBreakpoints.second) {
      setresizeSecond(false)
    }
  }, [dimensions.width])

  const handleCashoutChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = event.target.value
    if (parseFloat(newValue) >= MIN_PAYOUT) {
      const newWinChance = round(99 / parseFloat(newValue), 4).toString()
      setCashout(newValue)
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder((100 - parseFloat(newWinChance)).toFixed(2))
        setRotateBoxTo((100 - parseFloat(newWinChance)) * 3.6)
        setWinChance(newWinChance)
      } else {
        setrollOverUnder(newWinChance)
        setRotateBoxTo(parseFloat(newValue) * 3.6)
        setWinChance((100 - parseFloat(newWinChance)).toFixed(2))
      }
    } else {
      setCashout(newValue)
    }
  }

  const handleCashoutChangeBlur = (): void => {
    if (cashout === '') {
      setCashout(getCashoutValueFromWinChance(parseFloat(winChance)).toString())
    } else if (parseFloat(cashout) < MIN_PAYOUT) {
      setCashout(MIN_PAYOUT.toString())
      setWinChance(MAX_WIN_CHANCE.toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder(MIN_WIN_CHANCE.toString())
      } else {
        setrollOverUnder((100 - MIN_WIN_CHANCE).toFixed(2))
      }
    } else if (parseFloat(cashout) > MAX_PAYOUT) {
      setCashout(MAX_PAYOUT.toString())
      setWinChance(MIN_WIN_CHANCE.toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder((100 - MIN_WIN_CHANCE).toFixed(2))
      } else {
        setrollOverUnder(MIN_WIN_CHANCE.toString())
      }
    } else {
      setCashout(round(cashout, 4).toString())
    }
  }

  const handleWinChanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = event.target.value

    if (
      parseFloat(newValue) >= MIN_WIN_CHANCE &&
      parseFloat(newValue) <= MAX_WIN_CHANCE
    ) {
      const newCashout = round(99 / parseFloat(newValue), 4).toString()
      setCashout(newCashout)
      setWinChance(parseFloat(newValue).toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder(newValue)
        setrollOverUnder((100 - parseFloat(newValue)).toFixed(2))
        setRotateBoxTo((100 - parseFloat(newValue)) * 3.6)
      } else {
        setrollOverUnder(newValue)
        setRotateBoxTo(parseFloat(newValue) * 3.6)
      }
    } else {
      setWinChance(newValue)
    }
  }

  const handleWinChanceBlur = (): void => {
    if (winChance === '') {
      setWinChance(getWinChancefromCashout(parseFloat(cashout)).toFixed(2))
    } else if (parseFloat(winChance) < MIN_WIN_CHANCE) {
      const newCashout = round(99 / MIN_WIN_CHANCE, 4).toString()
      setCashout(newCashout)
      setWinChance(MIN_WIN_CHANCE.toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder(newCashout)
      } else {
        setrollOverUnder((100 - parseFloat(newCashout)).toFixed(2))
      }

      setCashout(MAX_PAYOUT.toString())
      setWinChance(MIN_WIN_CHANCE.toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder(MAX_WIN_CHANCE.toString())
      } else {
        setrollOverUnder(
          (100 - parseFloat(MAX_WIN_CHANCE.toString())).toFixed(2)
        )
      }
    } else if (parseFloat(winChance) > MAX_WIN_CHANCE) {
      const newCashout = round(99 / MAX_WIN_CHANCE, 4).toString()
      setCashout(newCashout)
      setWinChance(MAX_WIN_CHANCE.toFixed(2))
      if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        setrollOverUnder(newCashout)
      } else {
        setrollOverUnder((100 - parseFloat(newCashout)).toFixed(2))
      }

      setCashout(MIN_PAYOUT.toString())
      setWinChance(MAX_WIN_CHANCE.toString())
      if (isRollOverOrUnder === DiceRollConditionEnum.Over)
        setrollOverUnder(MIN_WIN_CHANCE.toString())
      else
        setrollOverUnder(
          (100 - parseFloat(MIN_WIN_CHANCE.toString())).toFixed(2)
        )
    } else {
      setWinChance(winChance)
    }
  }

  const handleRollOverUnderClick = (): void => {
    if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
      setIsRollOverOrUnder(DiceRollConditionEnum.Under)
    } else {
      setIsRollOverOrUnder(DiceRollConditionEnum.Over)
    }

    setrollOverUnder((100 - round(rollOverUnder, 2)).toFixed(2))
    setRotateBoxTo((100 - parseFloat(rollOverUnder)) * 3.6)
  }

  const handleDiceVariantChange = (): void => {
    if (diceVariant === DiceVariants.SLIDER) {
      setDiceVariant(DiceVariants.WHEEL)
    } else {
      setDiceVariant(DiceVariants.SLIDER)
    }
  }

  return (
    <DiceGameWrapper
      ref={ref}
      $mobile={dimensions.width <= mainBoardBreakpoints.second}
    >
      <ChangeDiceVariantButton
        $mobile={resizeSecond}
        onClick={handleDiceVariantChange}
        disabled={autoBetInProgress}
      >
        {diceVariant === DiceVariants.WHEEL ? (
          <img
            src={DiceIcon}
            alt={'Dice Icon'}
            style={{
              width: resizeSecond ? '16px' : '32px',
              height: resizeSecond ? '16px' : '32px'
            }}
          />
        ) : (
          <img
            src={DiceWheelIcon}
            alt={'Dice Wheel Icon'}
            style={{
              width: resizeSecond ? '16px' : '32px',
              height: resizeSecond ? '16px' : '32px'
            }}
          />
        )}
      </ChangeDiceVariantButton>
      <PastBetsWrapper>
        {pastBets &&
          pastBets
            .slice(0, dimensions.width > 480 ? 5 : 4)
            .map(
              (pastBet: Bet, index) =>
                pastBet.id && (
                  <PastBetButton
                    pastBet={pastBet.numberRolled}
                    win={pastBet.win}
                    index={index}
                    key={index}
                    id={pastBet.id ? pastBet.id : ''}
                  />
                )
            )}
      </PastBetsWrapper>
      <DiceContent>
        {diceVariant === DiceVariants.SLIDER ? (
          <DiceSlider resize={dimensions.width <= mainBoardBreakpoints.first} />
        ) : (
          <DiceWheel parentWidth={dimensions.width} resize={resizeSecond} />
        )}
      </DiceContent>
      <DiceFooter $mobile={dimensions.width <= mainBoardBreakpoints.second}>
        <InputLabel
          style={{ opacity: gameInProgress || autoBetInProgress ? '0.5' : '1' }}
        >
          <Tooltip
            message={
              parseFloat(cashout) > MAX_PAYOUT
                ? `Must be less or equal to ${MAX_PAYOUT}`
                : `Must be greater or equal to ${MIN_PAYOUT}`
            }
            show={
              parseFloat(cashout) > MAX_PAYOUT ||
              parseFloat(cashout) < MIN_PAYOUT ||
              cashout == ''
            }
            position="top"
            translate="translate(-40%, -50%)"
            wrapperStyle={{ width: '100%' }}
            togglerStyle={{ width: '100%' }}
          >
            <InputWrapper>
              <InputContent>
                <GameInput
                  disabled={gameInProgress || autoBetInProgress}
                  type="number"
                  min="1"
                  value={cashout}
                  onChange={handleCashoutChange}
                  onBlur={handleCashoutChangeBlur}
                  onKeyDown={(e: {
                    keyCode: number
                    preventDefault: () => any
                  }) => {
                    numberOnly(e)
                    cashout.length > 8 && e.keyCode !== 8 && e.preventDefault()
                  }}
                />
                <CloserIconX width="10px" height="10px" fill="#7b89c5" />
              </InputContent>
            </InputWrapper>
          </Tooltip>
          <LabelText>
            <span>{t('Payout')}</span>
          </LabelText>
        </InputLabel>
        <InputLabel
          style={{ opacity: gameInProgress || autoBetInProgress ? '0.5' : '1' }}
        >
          <InputWrapper>
            <InputContent>
              <GameInput
                disabled={gameInProgress || autoBetInProgress}
                $isButton
                type="button"
                value={rollOverUnder}
                onClick={handleRollOverUnderClick}
              />
              <RefreshIcon
                width="12px"
                height="12px"
                fill="#7b89c5"
                style={{
                  transform:
                    isRollOverOrUnder === DiceRollConditionEnum.Under
                      ? 'translate(0, -50%) rotate(180deg)'
                      : 'translate(0, -50%) rotate(0)'
                }}
              />
            </InputContent>
          </InputWrapper>
          <LabelText>
            <span>
              {t('ROLL')}{' '}
              {isRollOverOrUnder === DiceRollConditionEnum.Over
                ? `${t('OVER')}`
                : `${t('UNDER')}`}
            </span>
          </LabelText>
        </InputLabel>
        <InputLabel
          style={{ opacity: gameInProgress || autoBetInProgress ? '0.5' : '1' }}
        >
          <Tooltip
            message={
              parseFloat(winChance) > MAX_WIN_CHANCE
                ? `Must be less or equal to ${MAX_WIN_CHANCE}`
                : `Must be greater or equal to ${MIN_WIN_CHANCE}`
            }
            show={
              parseFloat(winChance) > MAX_WIN_CHANCE ||
              parseFloat(winChance) < MIN_WIN_CHANCE ||
              winChance == ''
            }
            position="top"
            translate="translate(-60%, -50%)"
            wrapperStyle={{ width: '100%' }}
            togglerStyle={{ width: '100%' }}
          >
            <InputWrapper>
              <InputContent>
                <GameInput
                  disabled={gameInProgress || autoBetInProgress}
                  type="number"
                  value={winChance}
                  min="2"
                  onChange={handleWinChanceChange}
                  onBlur={handleWinChanceBlur}
                  onKeyDown={(e: {
                    keyCode: number
                    preventDefault: () => any
                  }) => {
                    numberOnly(e)
                    winChance.length > 8 &&
                      e.keyCode !== 8 &&
                      e.preventDefault()
                  }}
                />
                <PercentIcon width="12px" height="12px" fill="#7b89c5" />
              </InputContent>
            </InputWrapper>
          </Tooltip>
          <LabelText>
            <span>{t('Win Chance')}</span>
          </LabelText>
        </InputLabel>
      </DiceFooter>
    </DiceGameWrapper>
  )
}

export default DiceBoard

const DiceGameWrapper = styled.div<{ $mobile: boolean }>`
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
  padding: ${(props): string => (props.$mobile ? '8px' : '25px')};
`
const PastBetsWrapper = styled.div`
  width: 100%;
  position: relative;
  height: 2em;
  display: flex;
  flex-direction: row-reverse;
  overflow: hidden;
  z-index: 9;
`
const DiceContent = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
  width: 100%;
  padding-bottom: 1rem;
  padding-top: 20px;
`
const DiceFooter = styled.div<{ $mobile: boolean }>`
  color: rgb(213, 220, 235);
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: ${(props): string => (props.$mobile ? '20px 0 0' : '1rem')};

  & input[type='button'] {
    cursor: pointer;
    text-align: left;
  }
`
const ChangeDiceVariantButton = styled.button<{ $mobile: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${(props): string => (props.$mobile ? '8px' : '26px')};
  left: ${(props): string => (props.$mobile ? '8px' : '26px')};
  width: ${(props): string => (props.$mobile ? '30px' : '48px')};
  height: ${(props): string => (props.$mobile ? '30px' : '48px')};
  border-radius: 4px;
  border: solid 1px #111a41;
  background-color: #1a2349;
  color: #7b8ac5;
  transition: color 0.2s ease-in;
  z-index: 10;

  &:hover {
    color: #d4dcff;
    transition: color 0.2s ease-in;
  }
`
// Footer inputs
const InputLabel = styled.label`
  display: inline-flex;
  -webkit-box-align: center;
  flex-direction: column-reverse;
  align-items: flex-start;
  touch-action: manipulation;
`
const LabelText = styled.span`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  font-family: 'Open Sans', serif;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.6px;
  color: #e6e7ed;
  margin: 0px 0px 0.25em;
  transition: all 200ms ease-out 0s;
`
const InputWrapper = styled.span`
  width: 100%;
  display: flex;
  flex-shrink: 0;
`
const InputContent = styled.span`
  position: relative;
  -webkit-box-flex: 1;
  flex-grow: 1;
  width: 100%;
  display: flex;

  & svg {
    position: absolute;
    top: 50%;
    transform: translate(0px, -50%);
    pointer-events: none;
    color: rgb(177, 186, 211);
    cursor: text;
    right: 0.75em;
    overflow: hidden;
  }
`
const GameInput = styled.input<{ $isButton?: boolean }>`
  font-family: 'Open Sans', serif;
  font-size: 14px;
  -webkit-overflow-scrolling: touch;
  @media (max-width: 1030px) {
    font-size: 16px;
  }
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #ffffff;
  -webkit-appearance: none;
  width: 100%;
  cursor: text;
  -webkit-appearance: none;
  padding: 8px 12px;
  padding-right: 28px;
  border-radius: 4px;
  border: solid 1px #404c7d;
  background-color: #111a41;
  transition: all 200ms ease-out 0s;
  outline: none;

  &:hover {
    border: solid 1px #4769fc;
    transition: border 200ms ease-out 0;
  }
  &:focus {
    border: ${(props) =>
      props.$isButton ? 'border: solid 1px #404c7d' : 'solid 1px #4769fc'};
    transition: border 200ms ease-out 0;
  }
  &:active {
    border: solid 1px #4769fc;
    transition: border 200ms ease-out 0;
  }

  &:disabled {
    cursor: not-allowed;
  }
`
