import React from 'react'
import styled from 'styled-components'
// import { cryptoCurrencies } from './CashierOptions'
import BnbIcon from 'components/Icons/BnbIcon'
import BtcIcon from 'components/Icons/BtcIcon'
import DaiIcon from 'components/Icons/DaiIcon'
import DashIcon from 'components/Icons/DashIcon'
import DogeIcon from 'components/Icons/DogeIcon'
import EthIcon from 'components/Icons/EthIcon'
import LtcIcon from 'components/Icons/LtcIon'
import MaticIcon from 'components/Icons/MaticIcon'
import UsdcIcon from 'components/Icons/UsdcIcon'
import UsdtIcon from 'components/Icons/UsdtIcon'
import { CurrencyEnum } from 'utils'

const CoinName = styled.span<{ isMobile: boolean }>`
  font-size: ${props => (props.isMobile ? '8.5px' : '10px')};
  color: #ffffff;
  flex-shrink: 0;
  @media (max-width: 300px) {
    font-size: 7px;
  }
`

export interface CoinIconOptions {
  current?: boolean
  addText?: boolean
  biggerIcon?: boolean
  mediumIcon?: boolean
  style?: any
  hw?: boolean
  isMobile?: boolean
  pxSize?: number
  coin?: string
}

export const getCoinIcon = (
  coin: CurrencyEnum | undefined | string | null,
  opts?: CoinIconOptions
): JSX.Element => {
  // console.log("coin: ", coin);
  // console.log("opts: ", opts);
  const size = opts?.pxSize
    ? `${opts?.pxSize}px`
    : opts?.biggerIcon
    ? '20px'
    : opts?.mediumIcon
    ? '16px'
    : opts?.hw
    ? '100%'
    : '12px'
  switch (coin) {
    case CurrencyEnum.btc:
      return (
        <>
          <BtcIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!!}>BTC</CoinName>
          )}
        </>
      )
    case CurrencyEnum.doge:
      return (
        <>
          <DogeIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!!}>DOGE</CoinName>
          )}
        </>
      )
    case CurrencyEnum.eth:
      return (
        <>
          <EthIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>ETH</CoinName>
          )}
        </>
      )
    case CurrencyEnum.ltc:
      return (
        <>
          <LtcIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>LTC</CoinName>
          )}
        </>
      )
    case CurrencyEnum.dash:
      return (
        <>
          <DashIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>DASH</CoinName>
          )}
        </>
      )
    case CurrencyEnum.usdt:
      return (
        <>
          <UsdtIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>USDT</CoinName>
          )}
        </>
      )
    case CurrencyEnum.usdc:
      return (
        <>
          <UsdcIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>USDC</CoinName>
          )}
        </>
      )
    case CurrencyEnum.dai:
      return (
        <>
          <DaiIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>DAI</CoinName>
          )}
        </>
      )
    case CurrencyEnum.matic:
      return (
        <>
          <MaticIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>MATIC</CoinName>
          )}
        </>
      )
    case CurrencyEnum.bnb:
      return (
        <>
          <BnbIcon style={opts?.style || {}} width={size} height={size} />
          {!opts?.current && opts?.addText && (
            <CoinName isMobile={opts?.isMobile!}>BNB</CoinName>
          )}
        </>
      )
    default:
      return <CoinName isMobile={opts?.isMobile!}>?</CoinName>
  }
}

type Props = {
  coin: string
  current?: boolean
  addText?: boolean
  biggerIcon?: boolean
  mediumIcon?: boolean
  style?: any
  hw?: boolean
  isMobile?: boolean
  pxSize?: number
}

export const CoinIcon = (props: Props): JSX.Element => {
  return getCoinIcon(props.coin.toLowerCase(), {
    ...props,
  })
}
