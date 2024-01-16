import styled from 'styled-components'
import usdSVG from 'assets/images/fiatSection/usd.svg'
import jpySVG from 'assets/images/fiatSection/jpy.svg'
import eurSVG from 'assets/images/fiatSection/eur.svg'
import { FiatCurrencyEnum } from 'utils'

export const getFiatCoinIcon = (
  coin: FiatCurrencyEnum | undefined | string | null,
  biggerIcon?: boolean,
  mediumIcon?: boolean,
  style?: any,
  walletSize?: any
): JSX.Element => {
  const widthSize = biggerIcon ? '20px' : mediumIcon ? '16px' : '12px'
  const heightSize = biggerIcon ? '20px' : walletSize ? '18px' : '16px'
  if (coin === FiatCurrencyEnum.USD) {
    return (
      <img
        src={usdSVG}
        style={{
          width: widthSize,
          height: heightSize,
          paddingBottom: walletSize ? '2px' : ''
        }}
      />
    )
  }
  if (coin === FiatCurrencyEnum.JPY) {
    return (
      <img
        src={jpySVG}
        style={{
          width: widthSize,
          height: heightSize,
          paddingBottom: walletSize ? '2px' : ''
        }}
      />
    )
  }
  if (coin === FiatCurrencyEnum.EUR) {
    return (
      <img
        src={eurSVG}
        style={{
          width: widthSize,
          height: heightSize,
          paddingBottom: walletSize ? '2px' : ''
        }}
      />
    )
  }
  return <CoinName>?</CoinName>
}

const CoinName = styled.span`
  font-size: 10px;
  color: #ffffff;
  flex-shrink: 0;
`
