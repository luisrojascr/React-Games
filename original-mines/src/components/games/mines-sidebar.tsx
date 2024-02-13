import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getCoinIcon } from 'components/common/crypto-icon-getter'
import { getFiatCoinIcon } from 'components/common/icon-getter'
import LabelInput from '../common/LabelInput'

import fromExponential from 'from-exponential'
import { useMinesStateContext } from './mines-context'
import {
  MinesStateActionsEnum,
  TileState,
  TileStateEnum
} from './mines-types'

import Big from 'big.js'
import { useWindowDimensions } from 'contexts/window-dimensions-provider'
import {
  Tooltip,
  Button as BetButton,
  Button as PickRandomTileButton,
  CustomDropdown,
  Option
} from 'components/common'
import { generateNextTileProfit } from './generateProfitMultiplier'
import {
  decimalCryptoDisplay,
  decimalDisplayLength,
  getNextDecimal,
  roundOff,
  roundOff2,
  randomIntFromInterval
} from 'utils'
import {
  CasinoGameMineState,
} from 'utils/cc'

interface SidebarMinesProps {
  changeLayout: boolean
}

let nums = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24
]

export default function SidebarMines({
  changeLayout
}: SidebarMinesProps): JSX.Element {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const minBet = searchParams.get('minBet') || '0'
  const maxBet1 = searchParams.get('maxBet') || '100'
  const sessionId = searchParams.get('sessionId') || '1001'
  const [maxBet, setMaxBet] = useState<any>(0)

  const {
    curBalance,
    currentWalletState,
    coinPriceData,
    checkGameState,
    setCheckGameState,
    gameInProgress,
    setGameInProgress,
    numOfMines,
    setNumOfMines,
    selectedFiatCurrency,
    maxPayoutData,
    betAmount,
    setbetAmount,
    leftGems,
    nextMultiplier: nextPayoutMultiplier,
    totalMultiplier: totalPayoutMultiplier,
    handleBet,
    handleCashout,
    handleRandomClick,
  } = useMinesStateContext()
  const { isMobile } = useWindowDimensions()

  useEffect(() => {
    setbetAmount(decimalCryptoDisplay(0, currentWalletState.type))
  }, [])

  // #region UI change
  const currencyIcon = selectedFiatCurrency
    ? getFiatCoinIcon(coinPriceData?.Fiat, true)
    : getCoinIcon(currentWalletState.type)

  const handleNumOfMinesChange = (option: Option) => {
    setNumOfMines(option.value as number)
  }

  const checkCurrentWallet = (numberToCheckVs?: number): boolean => {
    if (numberToCheckVs) {
      return numberToCheckVs > currentWalletState.available
    }
    return currentWalletState.available > 0
  }

  const handleBetAmountBlur = (): void => {
    if (
      betAmount === '' ||
      parseFloat(betAmount) <= 0 ||
      !checkCurrentWallet()
    ) {
      if (selectedFiatCurrency && coinPriceData) {
        setbetAmount('0.00')
      } else {
        setbetAmount('0.00000000')
      }
    } else {
      if (selectedFiatCurrency) {
        setbetAmount(parseFloat(betAmount).toFixed(2))
      } else {
        setbetAmount(
          parseFloat(betAmount).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )
        )
      }
    }
  }

  const handleBetAmountChange = (mode: string): void => {
    if (mode === 'half') {
      const newAmount = selectedFiatCurrency
        ? (parseFloat(betAmount) / 2).toFixed(2)
        : (parseFloat(betAmount) / 2).toFixed(
            decimalDisplayLength(currentWalletState.type)
          )

      setbetAmount(newAmount)
    } else if (
      mode === 'double' &&
      // !selectedFiatCurrency &&
      // !coinPriceData &&
      parseFloat(betAmount) * 2 <=
        Math.min(
          parseFloat(currentWalletState.available.toString()),
          parseFloat(maxBet as string)
        )
    ) {
      if (betAmount === '0.00000000') {
        setbetAmount(
          getNextDecimal(decimalCryptoDisplay(0, currentWalletState.type))
        )
      } else if (betAmount === '0.00') {
        setbetAmount('0.01')
      } else {
        const newAmount =
          selectedFiatCurrency && coinPriceData
            ? (parseFloat(betAmount) * 2).toFixed(2)
            : (parseFloat(betAmount) * 2).toFixed(
                decimalDisplayLength(currentWalletState.type)
              )
        setbetAmount(newAmount)
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
        setbetAmount(
          getNextDecimal(decimalCryptoDisplay(0, currentWalletState.type))
        )
      } else if (betAmount === '0.00') {
        setbetAmount('0.01')
      } else {
        const newAmount =
          selectedFiatCurrency && coinPriceData
            ? (parseFloat(betAmount) * 2).toFixed(2)
            : (parseFloat(betAmount) * 2).toFixed(
                decimalDisplayLength(currentWalletState.type)
              )
        setbetAmount(newAmount)
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
      setbetAmount(newAmount as string)
    }
  }

  const handleBetAmountChangeMain = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = fromExponential(event.target.value)
    setbetAmount(newValue)
  }

  const [validBetAmount, setValidBetAmount] = useState(false)

  useEffect(() => {
    if (gameInProgress) return
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
  }, [
    betAmount,
    selectedFiatCurrency,
    coinPriceData,
    currentWalletState.available
  ])
  // #endregion

  const profitOnNextTile = gameInProgress
    ? (nextPayoutMultiplier * parseFloat(betAmount)).toFixed(
        decimalDisplayLength(currentWalletState.type)
      )
    : '0.0'

  const totalProfit =
    totalPayoutMultiplier == 1
      ? '0.0'
      : (parseFloat(betAmount) * totalPayoutMultiplier).toFixed(
          decimalDisplayLength(currentWalletState.type)
        )

  useEffect(() => {
    // Calling before setting gameinprogress
    if (gameInProgress) {
      setCheckGameState({
        checkGameState: {
          minesCount: 3,
          rounds: [],
          nextProfit: {
            totalProfit: 1.12,
            nextProfit: 1.16
          },
          betDetails: {
            amount: 0,
            currency: 'ltc'
          }
        }
      })
    }
  }, [])

  // #region maxbet
  useEffect(() => {
    const lob = async () => {
      if (maxPayoutData) {
        const payoutMultiplier1 = await generateNextTileProfit(
          numOfMines,
          24 - numOfMines
        )
        if (payoutMultiplier1) {
          setMaxBet(
            Number(maxBet1) >=
              Number(
                fromExponential(
                  roundOff(
                    parseFloat(
                      Big(maxPayoutData)
                        .div(payoutMultiplier1.totalProfit)
                        .toString()
                    )
                  )
                )
              )
              ? roundOff(
                  parseFloat(
                    Big(maxPayoutData)
                      .div(payoutMultiplier1.totalProfit)
                      .toString()
                  )
                )
              : Number(maxBet1)
          )
        }
      }
    }
    lob()
  }, [numOfMines, maxPayoutData])
  //#endregion

  const { t: translate } = useTranslation()

  return (
    <GameSidebarWrapper /* change={changeLayout} */ change={isMobile}>
      {changeLayout ? (
        <SidebarMain>
          <>
            <FirstLine>
              {gameInProgress && (
                <PickRandomTileButton
                  onClick={handleRandomClick}
                  type="button"
                  width="100%"
                  padding="16px"
                  margin="0px 4px 0px 0px"
                >
                  <ButtonText>PICK RANDOM TILE</ButtonText>
                </PickRandomTileButton>
              )}

              <BetButton
                onClick={gameInProgress ? handleCashout : handleBet}
                type="button"
                width="100%"
                padding="16px"
                disabled={
                  (gameInProgress && (25 - numOfMines == leftGems)) ||
                  (!gameInProgress && !validBetAmount)
                }
              >
                <ButtonText>
                  {gameInProgress
                    ? `${translate('Cashout')}`
                    : `${translate('Bet')}`}
                </ButtonText>
              </BetButton>
            </FirstLine>

            <Tooltip
              togglerStyle={{ width: '100%' }}
              wrapperStyle={{ width: '100%' }}
              message={
                Number(betAmount) < Number(minBet) ||
                Number(betAmount) > Number(maxBet)
                  ? translate('Please set a valid bet amount')
                  : translate("You can't bet more than your balance")
              }
              show={!gameInProgress && !validBetAmount}
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
                disabled={gameInProgress}
                integerOnly={true}
                labelChildren={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'start'
                    }}
                  >
                    <span>{translate('Bet Amount')}</span>
                    {maxPayoutData && (
                      <span
                        onClick={(): void => handleBetAmountChange('maxBet')}
                        style={{
                          // marginLeft: '3px',
                          pointerEvents: gameInProgress ? 'none' : 'unset'
                        }}
                      >
                        {`(${translate('Min')} ${Number(minBet).toFixed(
                          decimalDisplayLength(currentWalletState.type)
                        )} to`}{' '}
                        {selectedFiatCurrency && coinPriceData
                          ? Number(
                              roundOff2(
                                Number(maxBet) *
                                  Number(
                                    coinPriceData[currentWalletState.type] ||
                                      '0'
                                  )
                              )
                            ).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )
                          : Number(maxBet).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )}{' '}
                        {`${translate('Max')})`}
                      </span>
                    )}
                    <span>{`(${translate('Balance')} - ${curBalance.toFixed(
                      decimalDisplayLength(currentWalletState.type)
                    )})`}</span>
                  </div>
                }
                onBlur={handleBetAmountBlur}
                onChange={handleBetAmountChangeMain}
                inputIcon={currencyIcon}
                inputButtons={[
                  <InputButtonV1
                    disabled={gameInProgress}
                    key="inp1"
                    onClick={(): void => handleBetAmountChange('half')}
                  >
                    <span>½</span>
                  </InputButtonV1>,
                  <InputButtonV1
                    disabled={gameInProgress}
                    key="inp2"
                    onClick={(): void => handleBetAmountChange('double')}
                  >
                    <span>2×</span>
                  </InputButtonV1>
                ]}
              />
            </Tooltip>

            {!gameInProgress && (
              <CustomDropdown
                v3
                labelV2
                wrapperStyle={{ backgroundColor: '#222c56' }}
                buttonStyle={{ backgroundColor: '#222c56', color: '#fff' }}
                $bgBlue
                label={translate('Mines')}
                isMobile={isMobile}
                options={
                  Array(24)
                    .fill(0)
                    .map((_, i) => ({
                      value: i + 1,
                      label: (i + 1).toString()
                    })) || []
                }
                currentOption={{
                  value: numOfMines,
                  label: numOfMines.toString()
                }}
                handleOptionClick={handleNumOfMinesChange}
              />
            )}

            {gameInProgress && (
              <>
                <FirstLine>
                  <LabelInput
                    readOnly
                    type="number"
                    value={numOfMines}
                    labelChildren={translate('Mines')}
                    disabled={false}
                  />
                  <LabelInput
                    readOnly
                    type="number"
                    value={leftGems}
                    labelChildren={translate('GEMS') || 'GEMS'}
                    disabled={false}
                  />
                </FirstLine>

                <LabelInput
                  readOnly
                  type="number"
                  value={
                    parseFloat(totalProfit)
                      ? selectedFiatCurrency && coinPriceData
                        ? (
                            parseFloat(totalProfit) - parseFloat(betAmount)
                          ).toFixed(2)
                        : (
                            parseFloat(totalProfit) - parseFloat(betAmount)
                          ).toFixed(
                            decimalDisplayLength(currentWalletState.type)
                          )
                      : selectedFiatCurrency && coinPriceData
                      ? Number(totalProfit).toFixed(2)
                      : Number(totalProfit).toFixed(
                          decimalDisplayLength(currentWalletState.type)
                        )
                  }
                  labelChildren={
                    <span>
                      {translate('TOTAL PROFIT') || 'TOTAL PROFIT'} (
                      {totalPayoutMultiplier}
                      X)
                    </span>
                  }
                  inputIcon={
                    selectedFiatCurrency
                      ? getFiatCoinIcon(coinPriceData?.Fiat, true)
                      : getCoinIcon(currentWalletState.type)
                  }
                  disabled={false}
                />
              </>
            )}
          </>
        </SidebarMain>
      ) : (
        <SidebarMain>
          <>
            <Tooltip
              message={
                Number(betAmount) < Number(minBet) ||
                Number(betAmount) > Number(maxBet)
                  ? translate('Please set a valid bet amount')
                  : translate("You can't bet more than your balance")
              }
              show={!gameInProgress && !validBetAmount}
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
                disabled={gameInProgress}
                integerOnly={true}
                labelChildren={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'start'
                    }}
                  >
                    <span>{translate('Bet Amount')}</span>
                    {maxPayoutData && (
                      <span
                        onClick={(): void => handleBetAmountChange('maxBet')}
                        style={{
                          // marginLeft: '3px',
                          pointerEvents: gameInProgress ? 'none' : 'unset'
                        }}
                      >
                        {`(${translate('Min')} ${Number(minBet).toFixed(
                          decimalDisplayLength(currentWalletState.type)
                        )} to`}{' '}
                        {selectedFiatCurrency && coinPriceData
                          ? Number(
                              roundOff2(
                                Number(maxBet) *
                                  Number(
                                    coinPriceData[currentWalletState.type] ||
                                      '0'
                                  )
                              )
                            ).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )
                          : Number(maxBet).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )}{' '}
                        {`${translate('Max')})`}
                      </span>
                    )}{' '}
                    <span>{`(${translate('Balance')} - ${curBalance.toFixed(
                      decimalDisplayLength(currentWalletState.type)
                    )})`}</span>
                  </div>
                }
                onBlur={handleBetAmountBlur}
                onChange={handleBetAmountChangeMain}
                inputIcon={currencyIcon}
                inputButtons={[
                  <InputButtonV1
                    disabled={gameInProgress}
                    key="inp1"
                    onClick={(): void => handleBetAmountChange('half')}
                  >
                    <span>½</span>
                  </InputButtonV1>,
                  <InputButtonV1
                    disabled={gameInProgress}
                    key="inp2"
                    onClick={(): void => handleBetAmountChange('double')}
                  >
                    <span>2×</span>
                  </InputButtonV1>
                ]}
              />
            </Tooltip>
            <>
              {!gameInProgress && (
                <CustomDropdown
                  $bgBlue
                  v3
                  labelV2
                  wrapperStyle={{ backgroundColor: '#222c56' }}
                  buttonStyle={{ backgroundColor: '#222c56', color: '#fff' }}
                  label={translate('MINES')}
                  isMobile={isMobile}
                  options={
                    Array(24)
                      .fill(0)
                      .map((_, i) => ({
                        value: i + 1,
                        label: (i + 1).toString()
                      })) || []
                  }
                  currentOption={{
                    value: numOfMines,
                    label: numOfMines.toString()
                  }}
                  handleOptionClick={handleNumOfMinesChange}
                />
              )}

              {gameInProgress && (
                <>
                  <FirstLine>
                    <LabelInput
                      readOnly
                      type="number"
                      value={numOfMines}
                      labelChildren="MINES"
                      disabled={false}
                    />
                    <LabelInput
                      readOnly
                      type="number"
                      value={leftGems}
                      labelChildren={translate('GEMS') || 'GEMS'}
                      disabled={false}
                    />
                  </FirstLine>

                  <LabelInput
                    readOnly
                    type="number"
                    value={
                      parseFloat(totalProfit)
                        ? selectedFiatCurrency && coinPriceData
                          ? (
                              parseFloat(totalProfit) - parseFloat(betAmount)
                            ).toFixed(2)
                          : (
                              parseFloat(totalProfit) - parseFloat(betAmount)
                            ).toFixed(
                              decimalDisplayLength(currentWalletState.type)
                            )
                        : selectedFiatCurrency && coinPriceData
                        ? Number(totalProfit).toFixed(2)
                        : Number(totalProfit).toFixed(
                            decimalDisplayLength(currentWalletState.type)
                          )
                    }
                    labelChildren={
                      <span>
                        {translate('TOTAL PROFIT') || 'TOTAL PROFIT'} (
                        {totalPayoutMultiplier}
                        X)
                      </span>
                    }
                    // inputIcon={getCoinIcon(currentWalletState.type)}
                    inputIcon={
                      selectedFiatCurrency
                        ? getFiatCoinIcon(coinPriceData?.Fiat, true)
                        : getCoinIcon(currentWalletState.type)
                    }
                    disabled={false}
                  />

                  <PickRandomTileButton
                    onClick={handleRandomClick}
                    type="button"
                    width="100%"
                    padding="16px"
                  >
                    <ButtonText>PICK RANDOM TILE</ButtonText>
                  </PickRandomTileButton>
                </>
              )}
            </>
            <BetButton
              onClick={gameInProgress ? handleCashout : handleBet}
              type="button"
              width="100%"
              padding="16px"
              disabled={
                (gameInProgress && 25 - numOfMines - leftGems == 0) ||
                (!gameInProgress && !validBetAmount)
              }
            >
              <ButtonText>
                {gameInProgress
                  ? `${translate('Cashout')}`
                  : `${translate('Bet')}`}
              </ButtonText>
            </BetButton>
          </>
        </SidebarMain>
      )}
      {/* <SidebarFooterCommands isMobile={isMobile} /> */}
    </GameSidebarWrapper>
  )
}

const GameSidebarWrapper = styled.div<{ change: boolean | undefined }>`
  display: flex;
  flex-direction: column;
  -webkit-box-align: stretch;
  align-items: stretch;
  width: 100%;
  font-family: 'Open Sans', serif;
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
  color: ${(props): string => (props.$active ? '#ffffff' : '#848aa0')};

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

// INPUT BUTTONS
const InputButtonV1 = styled.button`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 2px;
  background-color: #848aa01f;
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

const InfoShape = styled.div`
  margin-left: 0.5ch;
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  cursor: help;
  width: 12px;
  height: 12px;
  background-color: #848aa0;
  border-radius: 50%;
  font-family: 'Open Sans', serif;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  color: #ffffff;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    font-size: 8px;
  }
`

const FirstLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & div:first-child {
    margin-right: 15px;
  }
`
