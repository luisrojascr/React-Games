/* eslint-disable no-useless-escape */
import { useEffect } from 'react'
import Big from 'big.js'
import { cryptoCurrencies, FiatCurrencyEnumLower, CurrencyEnum, FiatCurrencyEnum } from './cc'
const logger = console

export const round = (
  value: string | number,
  decimalPlaces: number | undefined
): number =>
  Number(
    `${Math.round(parseFloat(`${value}e${decimalPlaces}`))}e-${decimalPlaces}`
  )

export const roundOff = (val: number) => {
  return (
    Big(parseInt((val * 100000000).toString()))
      .div(100000000)
      .toFixed(8) || '0.00000000'
  )
}

export const roundOff2 = (val: number) => {
  if (isNaN(val)) return '0.00'
  return (
    Big(parseInt((val * 100).toString()))
      .div(100)
      .toFixed(2) || '0.00'
  )
}

export const getCashoutValueFromWinChance = (wC: number): number =>
  round(99 / wC, 4)

export const getWinChancefromCashout = (cO: number): number => round(99 / cO, 4)

export const numberOnly = (e: any) => {
  return (
    (e.keyCode === 69 ||
      e.keyCode === 106 ||
      e.keyCode === 107 ||
      e.keyCode === 109 ||
      e.keyCode === 111 ||
      e.keyCode === 191 ||
      e.keyCode === 187 ||
      e.keyCode === 189) &&
    e.preventDefault()
  )
}

export function useOnClickOutside(ref: any, handler: any): any {
  useEffect(
    () => {
      const listener = (event: any): void => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }

        handler(event)
      }

      document.addEventListener('mousedown', listener, { passive: false })
      document.addEventListener('touchstart', listener, { passive: false })

      return (): void => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  )
}

export const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay))
}

export const generateRandomHex = (length: number): string => {
  const characters = 'abcdef0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}

export function clsxm(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export const integerRepSize = (currency: CurrencyEnum) => {
  const crypto = cryptoCurrencies.find(crypto => crypto.currency === currency)
  if (!crypto) throw new Error(`did not find crypto ${currency}`)
  return Math.pow(10, crypto.decimalRepLength)
}

export const decimalRepLength = (currency: CurrencyEnum) => {
  const crypto = cryptoCurrencies.find(crypto => crypto.currency === currency)
  if (!crypto) throw new Error(`did not find crypto ${currency}`)
  return crypto.decimalRepLength
}

export const decimalDisplayLength = (currency: CurrencyEnum) => {
  const crypto = cryptoCurrencies.find(crypto => crypto.currency === currency)
  return crypto!.decimalDisplayLength ?? crypto!.decimalRepLength
}

export const decimalLongDisplayLength = (currency: CurrencyEnum) => {
  const crypto = cryptoCurrencies.find(crypto => crypto.currency === currency)
  return crypto!.decimalDisplayLength + 2 < crypto!.decimalRepLength
    ? crypto!.decimalDisplayLength + 2
    : crypto!.decimalRepLength
}

export const decimalFiatRepLength = (
  currency: FiatCurrencyEnum | FiatCurrencyEnumLower
) => {
  switch (currency) {
    case FiatCurrencyEnum.JPY:
    case FiatCurrencyEnumLower.jpy:
      return 0
  }
  return 2
}
export const isUsdStable = (currency: CurrencyEnum) =>
  cryptoCurrencies.find(crypto => crypto.currency === currency)?.usdStable ??
  false

export const hasCoinPriceParity = (
  cryptoCurrency: CurrencyEnum,
  fiatCurrency: FiatCurrencyEnum | FiatCurrencyEnumLower
): boolean =>
  (fiatCurrency === FiatCurrencyEnum.USD ||
    fiatCurrency == FiatCurrencyEnumLower.usd) &&
  isUsdStable(cryptoCurrency)

export const normalizeCoinPrice = (
  cryptoCurrency: CurrencyEnum,
  fiatCurrency: FiatCurrencyEnum | FiatCurrencyEnumLower,
  coinPrice: number
): number => (hasCoinPriceParity(cryptoCurrency, fiatCurrency) ? 1 : coinPrice)

// Convert integer representation to decimal representation as a Big number
export const toDecimalBigRepr = (
  integerRep: string | number | Big,
  currency: CurrencyEnum,
  roundingMode = Big.roundDown
): Big => {
  try {
    if (!currency) throw new Error('currency is required')
    if (!CurrencyEnum[currency]) throw new Error('currency not recognized')
    return new Big(integerRep)
      .round(0, roundingMode)
      .div(integerRepSize(CurrencyEnum[currency]))
      .round(decimalRepLength(CurrencyEnum[currency]), roundingMode)
  } catch (e: any) {
    console.trace(e)
    logger.error(`toDecimalBigRepr error`, {
      integerRep,
      currency,
      error: e?.message ?? 'unknown',
    })
    return new Big(0)
  }
}

// Convert integer representation to decimal representation
export const toDecimalRepr = (
  integerRep: string | number | Big,
  currency: CurrencyEnum,
  roundingMode = Big.roundDown
): number => {
  try {
    if (!currency) throw new Error('currency is required')
    if (!CurrencyEnum[currency]) throw new Error('currency not recognized')
    return Number(
      toDecimalBigRepr(integerRep, CurrencyEnum[currency], roundingMode)
    )
  } catch (e: any) {
    console.trace(e)
    logger.error(`toDecimalRepr error`, {
      integerRep,
      currency,
      error: e?.message ?? 'unknown',
    })
    return 0
  }
}

// Convert from decimal representation to integer representation as a Big number
export const toIntegerBigRepr = (
  decimalRep: string | number | Big,
  currency: CurrencyEnum,
  roundingMode = Big.roundDown
): Big => {
  try {
    if (!currency) throw new Error('currency is required')
    if (!CurrencyEnum[currency]) throw new Error('currency not recognized')
    return new Big(decimalRep)
      .times(integerRepSize(CurrencyEnum[currency]))
      .round(0, roundingMode)
  } catch (e: any) {
    logger.error(`toIntegerBigRepr error`, {
      decimalRep,
      currency,
      error: e?.message ?? 'unknown',
    })
    return new Big(0)
  }
}

// Convert from decimal representation to integer representation
export const toIntegerRepr = (
  decimalRep: string | number | Big,
  currency: CurrencyEnum,
  roundingMode = Big.roundDown
): number => {
  try {
    if (!currency) throw new Error('currency is required')
    if (!CurrencyEnum[currency]) throw new Error('currency not recognized')
    return Number(toIntegerBigRepr(decimalRep, currency, roundingMode))
  } catch (e: any) {
    logger.error(`toIntegerRepr error`, {
      decimalRep,
      currency,
      error: e?.message ?? 'unknown',
    })
    return 0
  }
}

// returns the decimal representation of a cryptocurrency decimal converted to fiat
export const decimalCryptoToFiat = (
  decimalRep: string | number | Big,
  cryptoCurrency: CurrencyEnum,
  fiatCurrency: FiatCurrencyEnum | FiatCurrencyEnumLower,
  coinPrice: number,
  roundingMode = Big.roundDown
): number => {
  coinPrice = normalizeCoinPrice(cryptoCurrency, fiatCurrency, coinPrice)
  const v = new Big(decimalRep)
    .times(coinPrice)
    .round(decimalFiatRepLength(fiatCurrency), roundingMode)
  return Number(v)
}

// returns string representation of a cryptocurrency decimal converted to fiat
export const decimalCryptoToFiatStr = (
  decimalRep: string | number | Big,
  cryptocurrency: CurrencyEnum,
  fiatCurrency: FiatCurrencyEnum,
  coinPrice: number,
  roundingMode = Big.roundDown
): string => {
  return decimalCryptoToFiat(
    decimalRep,
    cryptocurrency,
    fiatCurrency,
    coinPrice,
    roundingMode
  ).toFixed(decimalFiatRepLength(fiatCurrency))
}

// returns string representation of a cryptocurrency decimal
// rounded to the display precision
export const decimalCryptoDisplay = (
  decimalRep: string | number | Big,
  cryptocurrency: CurrencyEnum,
  roundingMode = Big.roundDown
): string => {
  const v = new Big(decimalRep).round(
    decimalDisplayLength(cryptocurrency),
    roundingMode
  )
  return Number(v).toFixed(decimalDisplayLength(cryptocurrency))
}

export const fiatToCryptoStr = (
  decimalRep: string | number | Big,
  cryptocurrency: CurrencyEnum,
  coinPrice: number,
  roundingMode = Big.roundDown
): string => {
  const v = new Big(decimalRep)
    .div(coinPrice)
    .round(decimalDisplayLength(cryptocurrency), roundingMode)
  return Number(v).toFixed(decimalDisplayLength(cryptocurrency))
}

export function getNextDecimal(str: string): string {
  // Convert the string to a number
  let number = Number(str);

  // Check if the conversion was successful
  if (!isNaN(number)) {
    // Increment the number by the smallest representable decimal
    number += 1 / Math.pow(10, str.length - str.indexOf('.') - 1);

    // Convert the incremented number to a string
    let result = number.toString();

    return result;
  } else {
    // Handle the case where the conversion failed
    console.error(`Unable to convert "${str}" to a number.`);
    return str; // Return the input string as is
  }
}
