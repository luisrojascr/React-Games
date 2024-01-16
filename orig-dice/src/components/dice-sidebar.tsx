import Big from 'big.js'
import fromExponential from 'from-exponential'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import BetButton from './common/custom-button'
import { Tooltip } from './common/tooltip'
import LabelInput from './common/label-input'
import { Bet, DiceContext } from './dice-context'

import { getCoinIcon } from 'components/common/crypto-icon-getter'
import { getFiatCoinIcon } from 'components/common/icon-getter'
import { useTranslation } from 'react-i18next'
import {
  decimalCryptoDisplay,
  decimalDisplayLength,
  getNextDecimal,
} from 'utils/helper'
import InifinityIcon from 'assets/images/InfinityIcon'
import PercentIcon from 'assets/images/PercentIcon'
import { useWindowDimensions } from 'contexts/window-dimensions-provider'
import { roundOff, roundOff2 } from 'utils/helper'
import { MIN_WIN_CHANCE } from './dice-board'
import { DiceRollConditionEnum, LanguageEnum } from 'utils'

export enum BettingVariants {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO'
}

export enum OnWin {
  AUTO = 'AUTO',
  INCREASE = 'INCREASE'
}

export enum OnLoss {
  AUTO = 'AUTO',
  INCREASE = 'INCREASE'
}

interface Props {
  changeLayout: boolean
}

function DiceSidebar({ changeLayout }: Props): JSX.Element {
  const [maxBet, setMaxBet] = useState<any>(0)
  const [bettingVariant, setBettingVariant] = useState<BettingVariants>(
    BettingVariants.MANUAL
  )

  const { isMobile } = useWindowDimensions()
  const { t } = useTranslation()

  const {
    minBet,
    maxBet1,
    betAmount,
    isRollOverOrUnder,
    rollOverUnder,
    gameInProgress,
    cashout,
    autoBetInProgress,
    selectedFiatCurrency,
    lang,
    maxPayoutData,
    currentWalletState,
    coinPriceData,
    loading,
    curBalance,
    selectedOnLoss,
    betsFinished,
    selectedOnWin,
    numOfBets,
    stopOnLoss,
    stopOnProfit,
    profitOnWin,
    onLoss,
    onWin,
    setBetAmount,
    setOnWin,
    setOnLoss,
    setProfitOnWin,
    setStopOnProfit,
    setStopOnLoss,
    setNumOfBets,
    setSelectedOnLoss,
    setSelectedOnWin,
    setInitialBetAmount,
    setNeedToStopNextTime,
    handleAutoBet,
    handleManualBet,
  } = useContext(DiceContext)

  // #region set profit on win for bet amount change
  useEffect(() => {
    const getProfitOnWin = (): number =>
      parseFloat(betAmount) * parseFloat(cashout) - parseFloat(betAmount)

    if (Number(betAmount) === 0) {
      if (selectedFiatCurrency && coinPriceData) {
        setProfitOnWin('0.00')
      } else {
        setProfitOnWin(decimalCryptoDisplay(0, currentWalletState.type))
      }
    } else {
      if (selectedFiatCurrency && coinPriceData) {
        setProfitOnWin(
          isNaN(getProfitOnWin()) ? '' : getProfitOnWin().toFixed(2)
        )
      } else {
        setProfitOnWin(
          isNaN(getProfitOnWin())
            ? ''
            : getProfitOnWin().toFixed(
                decimalDisplayLength(currentWalletState.type)
              )
        )
      }
    }
  }, [betAmount, cashout])
  // #endregion

  const handleBetClick = (): void => {
    handleManualBet()
  }
  // #region Auto Bet
  const handleAutoBetClick = (): void => {
    if (!autoBetInProgress) {
      handleAutoBet()
    }

    if (autoBetInProgress) {
      setNeedToStopNextTime(true)
    }
  }

  // #region Handle Change
  const handleBetAmountBlur = (): void => {

    const checkcurrentWalletState = (numberToCheckVs?: number): boolean => {
      if (numberToCheckVs) {
        return numberToCheckVs > currentWalletState.available
      }
      return currentWalletState.available > 0
    }

    if (
      betAmount === '' ||
      parseFloat(betAmount) <= 0 ||
      !checkcurrentWalletState()
    ) {
      if (selectedFiatCurrency && coinPriceData) {
        setBetAmount('0.00')
        setInitialBetAmount('0.00')
      } else {
        setBetAmount(decimalCryptoDisplay(0, currentWalletState.type))
        setInitialBetAmount(decimalCryptoDisplay(0, currentWalletState.type))
      }
    } else {
      if (selectedFiatCurrency && coinPriceData) {
        setBetAmount(parseFloat(betAmount).toFixed(2))
        setInitialBetAmount(parseFloat(betAmount).toFixed(2))
      } else {
        setBetAmount(
          parseFloat(betAmount).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )
        )
        setInitialBetAmount(
          parseFloat(betAmount).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )
        )
      }
    }
  }
  const handleBetAmountChange = (mode: string): void => {
    if (mode === 'half') {
      const newAmount =
        selectedFiatCurrency && coinPriceData
          ? (parseFloat(betAmount) / 2).toFixed(2)
          : (parseFloat(betAmount) / 2).toFixed(
              decimalDisplayLength(currentWalletState.type)
            )

      setBetAmount(newAmount)
      setInitialBetAmount(newAmount)
    } else if (
      mode === 'double' &&
      parseFloat(betAmount) * 2 <=
        Math.min(
          parseFloat(currentWalletState.available.toString()),
          parseFloat(maxBet as string)
        )
    ) {
      if (betAmount === '0.00000000') {
        setBetAmount('0.00000001')
        setInitialBetAmount('0.00000001')
      } else if (betAmount === '0.00') {
        setBetAmount('0.01')
        setInitialBetAmount('0.01')
      } else {
        const newAmount =
          selectedFiatCurrency && coinPriceData
            ? (parseFloat(betAmount) * 2).toFixed(2)
            : (parseFloat(betAmount) * 2).toFixed(
                decimalDisplayLength(currentWalletState.type)
              )

        setBetAmount(newAmount)
        setInitialBetAmount(newAmount)
      }
    } else if (
      mode === 'double' &&
      selectedFiatCurrency &&
      coinPriceData &&
      parseFloat(betAmount) * 2 <=
        Math.min(
          //@ts-ignore
          (
            Number(currentWalletState.available) *
            Number(coinPriceData[currentWalletState.type])
          ).toFixed(2),
          Number(maxBet) * Number(coinPriceData[currentWalletState.type] || '0')
        )
    ) {
      if (betAmount === '0.00000000') {
        setBetAmount('0.00000001')
        setInitialBetAmount('0.00000001')
      } else if (betAmount === '0.00') {
        setBetAmount('0.01')
        setInitialBetAmount('0.01')
      } else {
        const newAmount =
          selectedFiatCurrency && coinPriceData
            ? (parseFloat(betAmount) * 2).toFixed(2)
            : (parseFloat(betAmount) * 2).toFixed(
                decimalDisplayLength(currentWalletState.type)
              )

        setBetAmount(newAmount)
        setInitialBetAmount(newAmount)
      }
    } else if (
      mode === 'maxBet' ||
      (selectedFiatCurrency && coinPriceData
        ? !(
            parseFloat(betAmount) * 2 <=
            Math.min(
              //@ts-ignore
              (
                Number(currentWalletState.available) *
                Number(coinPriceData[currentWalletState.type])
              ).toFixed(2),
              Number(maxBet) *
                Number(coinPriceData[currentWalletState.type] || '0')
            )
          )
        : !(
            parseFloat(betAmount) * 2 <=
            Math.min(
              parseFloat(currentWalletState.available.toString()),
              parseFloat(maxBet as string)
            )
          ))
    ) {
      const newAmount =
        selectedFiatCurrency && coinPriceData
          ? roundOff2(
              Number(maxBet) *
                Number(coinPriceData[currentWalletState.type] || '0')
            )
          : maxBet

      setBetAmount(newAmount as string)
      setInitialBetAmount(newAmount as string)
    }
  }
  const handleBetAmountChangeMain = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = fromExponential(event.target.value)

    setBetAmount(newValue)
  }
  const handleStopOnProfitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // const newValue = event.target.value;
    const newValue = fromExponential(event.target.value)

    setStopOnProfit(newValue)
  }
  const handleStopOnLossChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // const newValue = event.target.value;
    const newValue = fromExponential(event.target.value)

    setStopOnLoss(newValue)
  }
  const handleNumberOfBetsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = event.target.value
    if (parseInt(newValue) > 0) {
      setNumOfBets(newValue)
    } else {
      setNumOfBets('0')
    }
  }
  const handleOnWinChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = event.target.value
    setOnWin(newValue)
  }
  const handleOnWinBlur = (): void => {
    if (/* parseFloat(onWin) < 0 || */ onWin === '') {
      setOnWin('0.00')
    }
  }
  const handleOnLossChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = event.target.value
    setOnLoss(newValue)
  }
  const handleOnLossBlur = (): void => {
    if (/* parseFloat(onLoss) < 0 || */ onLoss === '') {
      setOnLoss('0.00')
    }
  }
  const handleStopOnProfitBlur = (): void => {
    if (
      parseFloat(stopOnProfit) <= 0 ||
      stopOnProfit === '' ||
      Number.isNaN(Number(stopOnLoss))
    ) {
      if (selectedFiatCurrency) {
        setStopOnProfit('0.00')
      } else {
        setStopOnProfit(decimalCryptoDisplay(0, currentWalletState.type))
      }
    } else {
      if (selectedFiatCurrency) {
        setStopOnProfit(parseFloat(stopOnProfit).toFixed(2))
      } else {
        setStopOnProfit(
          parseFloat(stopOnProfit).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )
        )
      }
    }
  }
  const handleStopOnLossBlur = (): void => {
    if (
      parseFloat(stopOnLoss) <= 0 ||
      stopOnLoss === '' ||
      Number.isNaN(Number(stopOnLoss))
    ) {
      if (selectedFiatCurrency) {
        setStopOnLoss('0.00')
      } else {
        setStopOnLoss(decimalCryptoDisplay(0, currentWalletState.type))
      }
    } else {
      if (selectedFiatCurrency) {
        setStopOnLoss(parseFloat(stopOnLoss).toFixed(2))
      } else {
        setStopOnLoss(
          parseFloat(stopOnLoss).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )
        )
      }
    }
  }
  // #endregion

  // #region set max bet
  useEffect(() => {
    if (
      parseFloat(cashout) <= 0 ||
      cashout === '' ||
      Number.isNaN(Number(cashout))
    )
      return

    if (maxPayoutData) {
      let payoutMultiplier
      let winChance
      if (isRollOverOrUnder === DiceRollConditionEnum.Under) {
        winChance = parseFloat(
          Big(parseFloat(rollOverUnder) / 100)
            .mul(100)
            .toString()
        )
        payoutMultiplier = Big(99).div(winChance || MIN_WIN_CHANCE)
      } else if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
        winChance = parseFloat(Big(100).minus(rollOverUnder).toString())
        payoutMultiplier = Big(99).div(winChance || MIN_WIN_CHANCE)
      }
      setMaxBet(
        Number(maxBet1) >=
          Number(
            fromExponential(
              roundOff(
                parseFloat(
                  Big(maxPayoutData)
                    .div(parseFloat(payoutMultiplier!.toString()))
                    .toString()
                )
              )
            )
          )
          ? fromExponential(
              roundOff(
                parseFloat(
                  Big(maxPayoutData)
                    .div(parseFloat(payoutMultiplier!.toString()))
                    .toString()
                )
              )
            )
          : Number(maxBet1)
      )
    }
  }, [maxPayoutData, cashout, isRollOverOrUnder])
  // #endregion

  // #region check bet amount is valid or not
  const [validBetAmount, setValidBetAmount] = useState(false)

  useEffect(() => {
  }, [
    betAmount,
    selectedFiatCurrency,
    coinPriceData,
    currentWalletState?.available
  ])
  useEffect(() => {
    if (Number(profitOnWin) > Number(maxPayoutData)) {
      setValidBetAmount(false)
    } else {
      if (
        Number(betAmount) < Number(minBet) ||
        Number(betAmount) > Number(maxBet) ||
        Number(betAmount) === 0
      ) {
        setValidBetAmount(false)
      } else if (selectedFiatCurrency && coinPriceData) {
        const fiatBetAmount =
          currentWalletState.available * coinPriceData[currentWalletState.type]
        if (
          Number(roundOff2(Number(betAmount))) <= Number(roundOff2(fiatBetAmount))
        ) {
          setValidBetAmount(true)
        } else {
          setValidBetAmount(false)
        }
      } else if (
        Number(roundOff(parseFloat(betAmount))) <=
        Number(roundOff(parseFloat(currentWalletState.available.toString())))
      ) {
        setValidBetAmount(true)
      } else {
        setValidBetAmount(false)
      }
    }
  }, [profitOnWin, betAmount, 
    betAmount,
    selectedFiatCurrency,
    coinPriceData,
    currentWalletState?.available])
  // #endregion

  return (
    <GameSidebarWrapper /* change={changeLayout} */ change={isMobile!}>
      {changeLayout ? (
        <SidebarMain>
          {bettingVariant === BettingVariants.MANUAL && (
            <>
              <FirstLineBet>
                <Tooltip
                  message={
                    Number(betAmount) < Number(minBet) ||
                    Number(betAmount) > Number(maxBet) ||
                    Number(betAmount) === 0
                      ? t('Please set a valid bet amount')
                      : t("You can't bet more than your balance")
                  }
                  show={!validBetAmount}
                  position="bottom"
                >
                  <LabelInput
                    min={0}
                    step={
                      selectedFiatCurrency && coinPriceData
                        ? '0.01'
                        : getNextDecimal(
                            decimalCryptoDisplay(0, currentWalletState.type)
                          )
                    }
                    type="number"
                    value={betAmount}
                    disabled={gameInProgress || loading || autoBetInProgress}
                    integerOnly={true}
                    dataTestId="bet-amount"
                    labelChildren={
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'start'
                        }}
                      >
                        <span>{t('Bet Amount')}</span>
                        {maxPayoutData && (
                          <span
                            onClick={(): void =>
                              handleBetAmountChange('maxBet')
                            }
                            style={{
                              // marginLeft: '3px',
                              pointerEvents:
                                gameInProgress || autoBetInProgress
                                  ? 'none'
                                  : 'unset'
                            }}
                          >
                            {`(${t('Min')} ${minBet} to`}{' '}
                            {selectedFiatCurrency && coinPriceData
                              ? roundOff2(
                                  Number(maxBet) *
                                    Number(
                                      coinPriceData[currentWalletState.type] ||
                                        '0'
                                    )
                                )
                              : Number(maxBet).toFixed(
                                  decimalDisplayLength(currentWalletState.type)
                                )}{' '}
                            {`${t('Max')})`}
                          </span>
                        )}{' '}
                        <span>{`(${t('Balance')} - ${curBalance.toFixed(
                          2
                        )})`}</span>
                      </div>
                    }
                    onBlur={handleBetAmountBlur}
                    onChange={handleBetAmountChangeMain}
                    inputIcon={
                      selectedFiatCurrency
                        ? getFiatCoinIcon(coinPriceData.Fiat, true)
                        : getCoinIcon(currentWalletState.type)
                    }
                    inputButtons={[
                      <InputButtonV1
                        disabled={
                          gameInProgress || loading || autoBetInProgress
                        }
                        key="inp1"
                        onClick={(): void => handleBetAmountChange('half')}
                      >
                        <span>½</span>
                      </InputButtonV1>,
                      <InputButtonV1
                        disabled={
                          gameInProgress || loading || autoBetInProgress
                        }
                        key="inp2"
                        onClick={(): void => handleBetAmountChange('double')}
                      >
                        <span>2×</span>
                      </InputButtonV1>
                    ]}
                  />
                </Tooltip>
                <BetButton
                  onClick={handleBetClick}
                  type="button"
                  width="30%"
                  padding="16px"
                  loading={loading}
                  disabled={!validBetAmount}
                  dataTestId='bet-button'
                  spinerHide
                >
                  <ButtonText>{t('Bet')}</ButtonText>
                </BetButton>
              </FirstLineBet>
              <LabelInput
                readOnly
                value={profitOnWin}
                dataTestId='profit-on-win'
                labelChildren={<span>{t('Profit On Win')}</span>}
                inputIcon={
                  coinPriceData ? (
                    coinPriceData.Fiat === 'USD' ? (
                      autoBetInProgress ? (
                        <img src={'/assets/images/fiatSection/usd.svg'} />
                      ) : (
                        <img src={'/assets/images/fiatSection/usd.svg'} />
                      )
                    ) : coinPriceData.Fiat === 'EUR' ? (
                      autoBetInProgress ? (
                        <img src={'/assets/images/fiatSection/eur.svg'} />
                      ) : (
                        <img src={'/assets/images/fiatSection/eur.svg'} />
                      )
                    ) : coinPriceData.Fiat === 'JPY' ? (
                      autoBetInProgress ? (
                        <img src={'/assets/images/fiatSection/jpy.svg'} />
                      ) : (
                        <img src={'/assets/images/fiatSection/jpy.svg'} />
                      )
                    ) : (
                      getCoinIcon(currentWalletState.type)
                    )
                  ) : (
                    getCoinIcon(currentWalletState.type)
                  )
                }
                disabled={gameInProgress || loading || autoBetInProgress}
              />
            </>
          )}
          {bettingVariant === BettingVariants.AUTO && (
            <>
              <BetButton
                onClick={handleAutoBetClick}
                $isInRedState={autoBetInProgress}
                type="button"
                width="100%"
                padding="16px"
                $bgColor={autoBetInProgress ? '#ff2c55' : undefined}
                dataTestId='bet-button'
                disabled={!validBetAmount}
              >
                <ButtonText>
                  {autoBetInProgress
                    ? `${t('Stop Autobet')}`
                    : `${t('Start Autobet')}`}
                </ButtonText>
              </BetButton>
              <Tooltip
                message={
                  Number(betAmount) < Number(minBet) ||
                  Number(betAmount) > Number(maxBet) ||
                  Number(betAmount) === 0
                    ? t('Please set a valid bet amount')
                    : t("You can't bet more than your balance")
                }
                show={!validBetAmount}
              >
                <LabelInput
                  min={0}
                  step={
                    selectedFiatCurrency && coinPriceData
                      ? '0.01'
                      : getNextDecimal(
                          decimalCryptoDisplay(0, currentWalletState.type)
                        )
                  }
                  type="number"
                  value={betAmount}
                  dataTestId="bet-amount"
                  integerOnly={true}
                  disabled={gameInProgress || loading || autoBetInProgress}
                  labelChildren={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'start'
                      }}
                    >
                      <span>{t('Bet Amount')}</span>
                      {maxPayoutData && (
                        <span
                          onClick={(): void => handleBetAmountChange('maxBet')}
                          style={{
                            // marginLeft: '3px',
                            pointerEvents:
                              gameInProgress || autoBetInProgress
                                ? 'none'
                                : 'unset'
                          }}
                        >
                          {`(${t('Min')} ${minBet} to`}{' '}
                          {selectedFiatCurrency && coinPriceData
                            ? roundOff2(
                                Number(maxBet) *
                                  Number(
                                    coinPriceData[currentWalletState.type] ||
                                      '0'
                                  )
                              )
                            : Number(maxBet).toFixed(decimalDisplayLength(currentWalletState.type))}{' '}
                          {`${t('Max')})`}
                        </span>
                      )}
                      <span>{`(${t('Balance')} - ${curBalance.toFixed(
                        2
                      )})`}</span>
                    </div>
                  }
                  onBlur={handleBetAmountBlur}
                  onChange={handleBetAmountChangeMain}
                  inputIcon={
                    selectedFiatCurrency
                      ? getFiatCoinIcon(coinPriceData.Fiat, true)
                      : getCoinIcon(currentWalletState.type)
                  }
                  inputButtons={[
                    <InputButtonV1
                      disabled={loading || gameInProgress || autoBetInProgress}
                      key="inp1"
                      onClick={(): void => handleBetAmountChange('half')}
                    >
                      <span>½</span>
                    </InputButtonV1>,
                    <InputButtonV1
                      disabled={loading || gameInProgress || autoBetInProgress}
                      key="inp2"
                      onClick={(): void => handleBetAmountChange('double')}
                    >
                      <span>2×</span>
                    </InputButtonV1>
                  ]}
                />
              </Tooltip>
              <LabelInput
                type="number"
                step="1"
                integerOnly
                onChange={handleNumberOfBetsChange}
                dataTestId="number-of-bets"
                value={numOfBets}
                labelChildren={<span>{t('Number Of Bets')}</span>}
                paddingRight="56px"
                inputIcon={
                  numOfBets === '0' ? (
                    <InifinityIcon
                      style={{ height: '18px', fill: 'currentColor' }}
                    />
                  ) : (
                    autoBetInProgress && (
                      <BetCountDown
                        $isgreaterthanthree={
                          (parseFloat(numOfBets) - betsFinished).toString()
                            .length > 3
                        }
                      >
                        {(parseFloat(numOfBets) - betsFinished).toString()
                          .length > 3
                          ? `${numOfBets.substring(0, 3)}...`
                          : parseFloat(numOfBets) - betsFinished}
                      </BetCountDown>
                    )
                  )
                }
                disabled={gameInProgress || loading || autoBetInProgress}
              />
              <LabelInput
                disabled={
                  selectedOnWin === OnWin.AUTO ||
                  gameInProgress ||
                  loading ||
                  autoBetInProgress
                }
                type="number"
                buttonsPosition="start"
                onChange={handleOnWinChange}
                value={onWin}
                labelChildren={<span>{t('On Win')}</span>}
                onBlur={handleOnWinBlur}
                min="0"
                inputButtons={[
                  <InputButtonV2
                    disabled={gameInProgress || loading || autoBetInProgress}
                    selected={selectedOnWin === OnWin.AUTO}
                    key="inp1"
                    onClick={(): void => {
                      setSelectedOnWin(OnWin.AUTO)
                      setOnWin('0.00')
                    }}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Reset')}</span>
                  </InputButtonV2>,
                  <InputButtonV2
                    disabled={gameInProgress || loading || autoBetInProgress}
                    selected={selectedOnWin === OnWin.INCREASE}
                    key="inp2"
                    onClick={(): void => setSelectedOnWin(OnWin.INCREASE)}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Increase By')}</span>
                  </InputButtonV2>
                ]}
                inputIcon={
                  <PercentIcon width="11px" height="13px" fill="#848aa0" />
                }
              />
              <LabelInput
                disabled={
                  selectedOnLoss === OnLoss.AUTO ||
                  gameInProgress ||
                  loading ||
                  autoBetInProgress
                }
                type="number"
                buttonsPosition="start"
                onChange={handleOnLossChange}
                onBlur={handleOnLossBlur}
                value={onLoss}
                min="0"
                labelChildren={<span>{t('On Loss')}</span>}
                inputButtons={[
                  <InputButtonV2
                    disabled={loading || gameInProgress || autoBetInProgress}
                    selected={selectedOnLoss === OnLoss.AUTO}
                    key="inp1"
                    onClick={(): void => {
                      setSelectedOnLoss(OnLoss.AUTO)
                      setOnLoss('0.00')
                    }}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Reset')}</span>
                  </InputButtonV2>,
                  <InputButtonV2
                    disabled={loading || gameInProgress || autoBetInProgress}
                    selected={selectedOnLoss === OnLoss.INCREASE}
                    key="inp2"
                    onClick={(): void => setSelectedOnLoss(OnLoss.INCREASE)}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Increase By')}</span>
                  </InputButtonV2>
                ]}
                inputIcon={
                  <PercentIcon width="11px" height="13px" fill="#848aa0" />
                }
              />
              <LabelInput
                step={
                  selectedFiatCurrency && coinPriceData
                    ? '0.01'
                    : getNextDecimal(
                        decimalCryptoDisplay(0, currentWalletState.type)
                      )
                }
                min="0"
                onBlur={handleStopOnProfitBlur}
                disabled={loading || gameInProgress || autoBetInProgress}
                type="number"
                onChange={handleStopOnProfitChange}
                value={stopOnProfit}
                dataTestId="stop-on-profit"
                labelChildren={<span>{t('Stop On Profit')}</span>}
                inputIcon={
                  selectedFiatCurrency
                    ? getFiatCoinIcon(coinPriceData.Fiat)
                    : getCoinIcon(currentWalletState.type)
                }
              />
              <LabelInput
                step={
                  selectedFiatCurrency && coinPriceData
                    ? '0.01'
                    : getNextDecimal(
                        decimalCryptoDisplay(0, currentWalletState.type)
                      )
                }
                min="0"
                onBlur={handleStopOnLossBlur}
                disabled={loading || gameInProgress || autoBetInProgress}
                type="number"
                onChange={handleStopOnLossChange}
                value={stopOnLoss}
                labelChildren={<span>STOP {t('On Loss')}</span>}
                inputIcon={
                  selectedFiatCurrency
                    ? getFiatCoinIcon(coinPriceData.Fiat)
                    : getCoinIcon(currentWalletState.type)
                }
              />
            </>
          )}
          <BettingVariantLine>
            <BettingVariantButton
              type="button"
              onClick={(): void => setBettingVariant(BettingVariants.MANUAL)}
              $active={bettingVariant === BettingVariants.MANUAL}
              disabled={gameInProgress || loading || autoBetInProgress}
            >
              <span>{t('Manual')}</span>
            </BettingVariantButton>
            <BettingVariantButton
              type="button"
              onClick={(): void => setBettingVariant(BettingVariants.AUTO)}
              $active={bettingVariant === BettingVariants.AUTO}
              disabled={gameInProgress || loading || autoBetInProgress}
            >
              <span>{t('Auto')}</span>
            </BettingVariantButton>
          </BettingVariantLine>
        </SidebarMain>
      ) : (
        <SidebarMain>
          <BettingVariantLine>
            <BettingVariantButton
              type="button"
              onClick={(): void => setBettingVariant(BettingVariants.MANUAL)}
              $active={bettingVariant === BettingVariants.MANUAL}
              disabled={gameInProgress || loading || autoBetInProgress}
              data-testid='manual-bet'
              >
              <span>{t('Manual')}</span>
            </BettingVariantButton>
            <BettingVariantButton
              type="button"
              onClick={(): void => setBettingVariant(BettingVariants.AUTO)}
              $active={bettingVariant === BettingVariants.AUTO}
              disabled={gameInProgress || loading || autoBetInProgress}
              data-testid='auto-bet'
            >
              <span>{t('Auto')}</span>
            </BettingVariantButton>
          </BettingVariantLine>
          {bettingVariant === BettingVariants.MANUAL && (
            <>
              <Tooltip
                message={
                  Number(betAmount) < Number(minBet) ||
                  Number(betAmount) > Number(maxBet) ||
                  Number(betAmount) === 0
                    ? t('Please set a valid bet amount')
                    : t("You can't bet more than your balance")
                }
                show={!validBetAmount}
                position="bottom"
                togglerStyle={{ width: '100%' }}
                wrapperStyle={{ width: '100%' }}
              >
                <LabelInput
                  min={0}
                  step={
                    selectedFiatCurrency && coinPriceData
                      ? '0.01'
                      : getNextDecimal(
                          decimalCryptoDisplay(0, currentWalletState.type)
                        )
                  }
                  type="number"
                  value={betAmount}
                  dataTestId="bet-amount"
                  integerOnly={true}
                  disabled={gameInProgress || loading || autoBetInProgress}
                  labelChildren={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'start'
                      }}
                    >
                      <span>{t('Bet Amount')}</span>
                      {maxPayoutData && (
                        <span
                          onClick={(): void => handleBetAmountChange('maxBet')}
                          style={{
                            // marginLeft: '3px',
                            pointerEvents:
                              gameInProgress || autoBetInProgress
                                ? 'none'
                                : 'unset'
                          }}
                        >
                          {`(${t('Min')} ${minBet} to`}{' '}
                          {selectedFiatCurrency && coinPriceData
                            ? roundOff2(
                                Number(maxBet) *
                                  Number(
                                    coinPriceData[currentWalletState.type] ||
                                      '0'
                                  )
                              )
                            : Number(maxBet).toFixed(
                                decimalDisplayLength(currentWalletState.type)
                              )}{' '}
                          {`${t('Max')})`}
                        </span>
                      )}{' '}
                      <span>{`(${t('Balance')} - ${curBalance.toFixed(
                        2
                      )})`}</span>
                    </div>
                  }
                  onBlur={handleBetAmountBlur}
                  onChange={handleBetAmountChangeMain}
                  inputIcon={
                    selectedFiatCurrency
                      ? getFiatCoinIcon(coinPriceData.Fiat, true)
                      : getCoinIcon(currentWalletState?.type)
                  }
                  inputButtons={[
                    <InputButtonV1
                      disabled={gameInProgress || loading || autoBetInProgress}
                      key="inp1"
                      onClick={(): void => handleBetAmountChange('half')}
                    >
                      <span>½</span>
                    </InputButtonV1>,
                    <InputButtonV1
                      disabled={gameInProgress || loading || autoBetInProgress}
                      key="inp2"
                      onClick={(): void => handleBetAmountChange('double')}
                    >
                      <span>2×</span>
                    </InputButtonV1>
                  ]}
                />
              </Tooltip>
              <LabelInput
                readOnly
                value={profitOnWin}
                dataTestId='profit-on-win'
                labelChildren={<span>{t('Profit On Win')}</span>}
                inputIcon={
                  selectedFiatCurrency
                    ? getFiatCoinIcon(coinPriceData.Fiat)
                    : getCoinIcon(currentWalletState?.type)
                }
                disabled={gameInProgress || loading || autoBetInProgress}
              />
              <BetButton
                onClick={handleBetClick}
                type="button"
                width="100%"
                padding="16px"
                loading={loading}
                disabled={!validBetAmount}
                dataTestId='bet-button'
              >
                <ButtonText>{t('Bet')}</ButtonText>
              </BetButton>
            </>
          )}
          {bettingVariant === BettingVariants.AUTO && (
            <>
              <Tooltip
                message={
                  Number(betAmount) < Number(minBet) ||
                  Number(betAmount) > Number(maxBet) ||
                  Number(betAmount) === 0
                    ? t('Please set the a bet amount')
                    : t("You can't bet more than your balance")
                }
                show={!validBetAmount}
                position="bottom"
                togglerStyle={{ width: '100%' }}
                wrapperStyle={{ width: '100%' }}
              >
                <LabelInput
                  min={0}
                  step={
                    selectedFiatCurrency
                      ? '0.01'
                      : getNextDecimal(
                          decimalCryptoDisplay(0, currentWalletState.type)
                        )
                  }
                  type="number"
                  value={betAmount}
                  dataTestId="bet-amount"
                  integerOnly={true}
                  disabled={gameInProgress || loading || autoBetInProgress}
                  labelChildren={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'start'
                      }}
                    >
                      <span>{t('Bet Amount')}</span>
                      {maxPayoutData && (
                        <span
                          onClick={(): void => handleBetAmountChange('maxBet')}
                          style={{
                            // marginLeft: '3px',
                            pointerEvents:
                              gameInProgress || autoBetInProgress
                                ? 'none'
                                : 'unset'
                          }}
                        >
                          {`(${t('Min')} ${minBet} to`}{' '}
                          {selectedFiatCurrency && coinPriceData
                            ? roundOff2(
                                Number(maxBet) *
                                  Number(
                                    coinPriceData[currentWalletState.type] ||
                                      '0'
                                  )
                              )
                            : Number(maxBet).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )}{' '}
                          {`${t('Max')})`}
                        </span>
                      )}{' '}
                      <span>{`(${t('Balance')} - ${curBalance.toFixed(
                        2
                      )})`}</span>
                    </div>
                  }
                  onBlur={handleBetAmountBlur}
                  onChange={handleBetAmountChangeMain}
                  inputIcon={
                    selectedFiatCurrency
                      ? getFiatCoinIcon(coinPriceData.Fiat, true)
                      : getCoinIcon(currentWalletState.type)
                  }
                  inputButtons={[
                    <InputButtonV1
                      disabled={loading || gameInProgress || autoBetInProgress}
                      key="inp1"
                      onClick={(): void => handleBetAmountChange('half')}
                    >
                      <span>½</span>
                    </InputButtonV1>,
                    <InputButtonV1
                      disabled={loading || gameInProgress || autoBetInProgress}
                      key="inp2"
                      onClick={(): void => handleBetAmountChange('double')}
                    >
                      <span>2×</span>
                    </InputButtonV1>
                  ]}
                />
              </Tooltip>
              <LabelInput
                type="number"
                integerOnly
                onChange={handleNumberOfBetsChange}
                dataTestId="number-of-bets"
                value={numOfBets}
                labelChildren={<span>{t('Number Of Bets')}</span>}
                paddingRight="56px"
                inputIcon={
                  numOfBets === '0' ? (
                    <InifinityIcon
                      style={{ height: '18px', fill: 'currentColor' }}
                    />
                  ) : (
                    autoBetInProgress && (
                      <BetCountDown
                        $isgreaterthanthree={
                          (parseFloat(numOfBets) - betsFinished).toString()
                            .length > 3
                        }
                      >
                        {(parseFloat(numOfBets) - betsFinished).toString()
                          .length > 3
                          ? `${numOfBets.substring(0, 3)}...`
                          : parseFloat(numOfBets) - betsFinished}
                      </BetCountDown>
                    )
                  )
                }
                disabled={gameInProgress || loading || autoBetInProgress}
              />
              <LabelInput
                disabled={
                  selectedOnWin === OnWin.AUTO ||
                  gameInProgress ||
                  loading ||
                  autoBetInProgress
                }
                type="number"
                buttonsPosition="start"
                onChange={handleOnWinChange}
                value={onWin}
                labelChildren={<span>{t('On Win')}</span>}
                onBlur={handleOnWinBlur}
                min="0"
                inputButtons={[
                  <InputButtonV2
                    disabled={gameInProgress || loading || autoBetInProgress}
                    selected={selectedOnWin === OnWin.AUTO}
                    key="inp1"
                    onClick={(): void => {
                      setSelectedOnWin(OnWin.AUTO)
                      setOnWin('0.00')
                    }}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Reset')}</span>
                  </InputButtonV2>,
                  <InputButtonV2
                    disabled={gameInProgress || loading || autoBetInProgress}
                    selected={selectedOnWin === OnWin.INCREASE}
                    key="inp2"
                    onClick={(): void => setSelectedOnWin(OnWin.INCREASE)}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span
                      style={{
                        maxWidth:
                          lang ===
                          LanguageEnum.Fr
                            ? '58px'
                            : ''
                      }}
                    >
                      {t('Increase By')}
                    </span>
                  </InputButtonV2>
                ]}
                inputIcon={
                  <PercentIcon width="11px" height="13px" fill="#848aa0" />
                }
              />
              <LabelInput
                disabled={
                  selectedOnLoss === OnLoss.AUTO ||
                  gameInProgress ||
                  loading ||
                  autoBetInProgress
                }
                type="number"
                buttonsPosition="start"
                onChange={handleOnLossChange}
                onBlur={handleOnLossBlur}
                value={onLoss}
                min="0"
                labelChildren={<span>{t('On Loss')}</span>}
                inputButtons={[
                  <InputButtonV2
                    disabled={loading || gameInProgress || autoBetInProgress}
                    selected={selectedOnLoss === OnLoss.AUTO}
                    key="inp1"
                    onClick={(): void => {
                      setSelectedOnLoss(OnLoss.AUTO)
                      setOnLoss('0.00')
                    }}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span>{t('Reset')}</span>
                  </InputButtonV2>,
                  <InputButtonV2
                    disabled={loading || gameInProgress || autoBetInProgress}
                    selected={selectedOnLoss === OnLoss.INCREASE}
                    key="inp2"
                    onClick={(): void => setSelectedOnLoss(OnLoss.INCREASE)}
                    $language={
                      lang === 'de'
                        ? true
                        : false
                    }
                  >
                    <span
                      style={{
                        maxWidth:
                          lang ===
                          LanguageEnum.Fr
                            ? '58px'
                            : ''
                      }}
                    >
                      {t('Increase By')}
                    </span>
                  </InputButtonV2>
                ]}
                inputIcon={
                  <PercentIcon width="11px" height="13px" fill="#848aa0" />
                }
              />
              <LabelInput
                step={
                  selectedFiatCurrency && coinPriceData
                    ? '0.01'
                    : getNextDecimal(
                        decimalCryptoDisplay(0, currentWalletState.type)
                      )
                }
                min="0"
                onBlur={handleStopOnProfitBlur}
                disabled={loading || gameInProgress || autoBetInProgress}
                type="number"
                onChange={handleStopOnProfitChange}
                value={stopOnProfit}
                dataTestId="stop-on-profit"
                labelChildren={<span>{t('Stop On Profit')}</span>}
                inputIcon={
                  selectedFiatCurrency
                    ? getFiatCoinIcon(coinPriceData.Fiat)
                    : getCoinIcon(currentWalletState.type)
                }
              />
              <LabelInput
                step={
                  selectedFiatCurrency && coinPriceData
                    ? '0.01'
                    : getNextDecimal(
                        decimalCryptoDisplay(0, currentWalletState.type)
                      )
                }
                min="0"
                onBlur={handleStopOnLossBlur}
                disabled={loading || gameInProgress || autoBetInProgress}
                type="number"
                onChange={handleStopOnLossChange}
                value={stopOnLoss}
                dataTestId='stop-on-loss'
                labelChildren={<span>{t('Stop On Loss')}</span>}
                inputIcon={
                  selectedFiatCurrency
                    ? getFiatCoinIcon(coinPriceData.Fiat)
                    : getCoinIcon(currentWalletState.type)
                }
              />
              <BetButton
                $isInRedState={autoBetInProgress}
                onClick={handleAutoBetClick}
                type="button"
                width="100%"
                padding="16px"
                $bgColor={autoBetInProgress ? '#ff2c55' : undefined}
                disabled={!validBetAmount}
                dataTestId='bet-button'
              >
                <ButtonText>
                  {autoBetInProgress
                    ? `${t('Stop Autobet')}`
                    : `${t('Start Autobet')}`}
                </ButtonText>
              </BetButton>
            </>
          )}
        </SidebarMain>
      )}
      {/* <SidebarFooterCommands isMobile={isMobile} /> */}
    </GameSidebarWrapper>
  )
}

export default DiceSidebar

const FirstLineBet = styled.div`
  display: flex;
  /* border: 1px solid red; */
  justify-content: center;
  align-items: center;

  & div:first-child {
    /* width: 100%; */
    margin-right: 15px;
  }
`
const GameSidebarWrapper = styled.div<{ change: boolean }>`
  display: flex;
  flex-direction: column;
  -webkit-box-align: stretch;
  align-items: stretch;
  width: 100%;
  min-width: 275px;
  max-width: ${(props): string => (props.change ? '500px' : '285px')};
`
const SidebarMain = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 4px;
  background-color: #222c55;

  & > * + * {
    margin-top: 1rem;
  }
`
const BettingVariantLine = styled.div`
  display: inline-flex;
  width: 100%;

  & button:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  & button:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`
const BettingVariantButton = styled.button<{ $active: boolean }>`
  flex: 0 0 50%;
  touch-action: manipulation;
  position: relative;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;
  background-color: ${(props): string =>
    props.$active ? '#4769FC' : '#3F4B79'};
  /* border: ${(props): string =>
    props.$active ? 'none' : 'solid 1px #d6d7df'}; */
  padding: 9px 1em;
  border-radius: 4px;
  font-family: 'Open Sans', serif;
  font-size: 10px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.91px;
  text-align: center;
  /* color: ${(props): string => (props.$active ? '#ffffff' : '#848aa0')}; */
  color: #ffffff;
  opacity: ${(props): number => (props.$active ? 1 : 0.7)};

  & span {
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }

  &:active span {
    transform: scale(0.95);
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }
`
const ButtonText = styled.span`
  font-family: 'Open Sans', serif;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: center;
  color: #ffffff;
`
const InputButtonV1 = styled.button`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  /* background-color: #848aa01f; */
  background-color: #3f4b79;
  padding: 2px 9px;
  font-family: 'Open Sans', serif;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: center;
  color: #848aa0;
  transition: background-color 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;

  margin-top: 4px;
  margin-bottom: 4px;

  &:hover {
    background-color: #848aa05c;
    transition: background-color 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }

  & span {
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
    color: #fff;
  }

  &:active span {
    transform: scale(0.95);
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }
`
const InputButtonV2 = styled.button<{ selected: boolean; $language?: boolean }>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  background-color: ${(props) => (props.selected ? '#4769FC' : '#3F4B79')};
  padding: 2px 8px;
  font-family: 'Open Sans', serif;
  font-size: ${(props): string => (props.$language ? '7px' : '9px')};
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.91px;
  text-align: center;
  color: ${(props) => (props.selected ? '#ffffff' : '#848aa0')};
  transition: background 300ms ease 0s, opacity 300ms ease 0s,
    transform 100ms ease 0s;

  margin-top: 4px;
  margin-bottom: 4px;

  & span {
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }

  &:active span {
    transform: scale(0.95);
    transition: background 300ms ease 0s, opacity 300ms ease 0s,
      transform 100ms ease 0s;
  }
`
const BetCountDown = styled.span<{ $isgreaterthanthree: any }>`
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans', serif;
  font-weight: bold;
  color: #4769fc;
  width: 18px;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0px, -50%);
  -ms-transform: translate(0px, -50%);
  transform: translate(0px, -50%);
  pointer-events: none;
  cursor: text;
  right: ${(props) => (props.$isgreaterthanthree ? '1em' : '0.75em')};
`
