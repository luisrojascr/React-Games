import { Big } from 'big.js'
const logger = console

export enum FiatCurrencyEnum {
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY'
}
export enum CurrencyEnum {
  arb = 'arb',
  ava = 'ava',
  bnb = 'bnb',
  btc = 'btc',
  cro = 'cro',
  dai = 'dai',
  dash = 'dash',
  demo = 'demo',
  doge = 'doge',
  eth = 'eth',
  ftm = 'ftm',
  ltc = 'ltc',
  matic = 'matic',
  usdc = 'usdc',
  usdt = 'usdt'
}

export type WalletVault = {
  __typename?: 'WalletVault'
  available: Scalars['Float']
  type: CurrencyEnum
}

export type CurrentWallet = {
  __typename?: 'CurrentWallet'
  _id: Scalars['ID']
  type: CurrencyEnum
  available: Scalars['Float']
  vault?: Maybe<WalletVault>
}

//#region Mines Subscription
export type roundType = {
  __typename?: 'roundType'
  field?: Maybe<Scalars['Int']>
  payoutMultiplier?: Maybe<Scalars['Int']>
}

export type nextProfitTypes = {
  __typename?: 'nextProfit'
  nextProfit?: Maybe<Scalars['Float']>
  totalProfit?: Maybe<Scalars['Float']>
}

export type betDetailsTypes = {
  __typename?: 'betDetails'
  amount?: Maybe<Scalars['Float']>
  currency?: CurrencyEnum
}

export type Maybe<T> = T | null
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  Decimal128: any
  BigInt: any
  Upload: any
  Any: any //
}

export type CasinoGameMineState = {
  __typename?: 'CasinoGameMineState'
  minesCount?: Maybe<Scalars['Int']>
  rounds: Maybe<Array<roundType>>
  mines: Maybe<Scalars['Any']>
  nextProfit?: Maybe<nextProfitTypes>
  betDetails?: Maybe<betDetailsTypes>
}

export type MineCashoutEvent = {
  __typename?: 'MineCashoutEvent'
  type: Scalars['String']
  won: Scalars['String']
  payoutMultiplier: Scalars['Float']
  currency: CurrencyEnum
  minesPosition: Scalars['Any']
}

export type MineUserEvent = {
  __typename?: 'MineUserEvent'
  type: Scalars['String']
  userId?: Maybe<Scalars['String']>
  username?: Maybe<Scalars['String']>
  betAmount?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
  nextPayoutMultiplier: Scalars['Float']
  totalPayoutMultiplier: Scalars['Float']
  minesPosition: Scalars['Any']
}

export enum CryptoNetworkEnum {
  arb = 'arb',
  ava = 'ava',
  bnb = 'bnb',
  btc = 'btc',
  cro = 'cro',
  doge = 'doge',
  eth = 'eth',
  ftm = 'ftm',
  // goerli = 'goerli',
  ltc = 'ltc',
  // mumbai = 'mumbai',
  polygon = 'polygon'
  // sepolia = 'sepolia',
  // testava = 'testava',
  // testbsc = 'testbsc',
  // testcro = 'testcro',
}


export enum FiatCurrencyEnumLower {
  usd = 'usd',
  eur = 'eur',
  jpy = 'jpy',
}

export const fiatCurrencies = [
  FiatCurrencyEnumLower.usd,
  FiatCurrencyEnumLower.eur,
  FiatCurrencyEnumLower.jpy,
]

export enum CryptoNetworkType {
  evm = 'evm',
  bitcoin = 'bitcoin',
}

export interface CryptoCurrency {
  currency: CurrencyEnum
  name: string
  specificName: string
  symbol: string
  coinGeckoName?: string // for CoinGecko price feed
  confirmations: number
  decimalRepLength: number
  decimalDisplayLength: number
  alwaysShowWallet?: boolean // show zero-balance pseudo-wallet even when not created
  autoCreateWallet?: boolean // create on new player creation
  disableBuyOption?: boolean
  disableDeposits?: boolean
  disableSyncOption?: boolean
  disableWithdrawals?: boolean
  hideWallet?: boolean
  usdStable?: boolean
  downScale?: number
}

export const bnb: CryptoCurrency = {
  currency: CurrencyEnum.bnb,
  name: 'BNB',
  specificName: 'BNB',
  symbol: 'BNB',
  coinGeckoName: 'binancecoin',
  decimalRepLength: 18,
  decimalDisplayLength: 4,
  confirmations: 2,
  alwaysShowWallet: true,
  hideWallet: true,
  disableWithdrawals: true,
  disableDeposits: true,
  disableBuyOption: true,
}

export const btc: CryptoCurrency = {
  currency: CurrencyEnum.btc,
  name: 'Bitcoin',
  specificName: 'Native Bitcoin',
  symbol: 'BTC',
  coinGeckoName: 'bitcoin',
  decimalRepLength: 8,
  decimalDisplayLength: 7,
  confirmations: 1,
  autoCreateWallet: true,
  alwaysShowWallet: true,
}

export const eth: CryptoCurrency = {
  currency: CurrencyEnum.eth,
  name: 'Ether',
  specificName: 'Native Ether',
  symbol: 'ETH',
  coinGeckoName: 'ethereum',
  decimalRepLength: 18,
  decimalDisplayLength: 6,
  confirmations: 2,
  autoCreateWallet: true,
  alwaysShowWallet: true,
}

export const dai: CryptoCurrency = {
  currency: CurrencyEnum.dai,
  name: 'Dai',
  specificName: 'ERC-20 DAI',
  symbol: 'DAI',
  coinGeckoName: 'dai',
  decimalRepLength: 18,
  decimalDisplayLength: 2,
  usdStable: true,
  confirmations: 2,
  alwaysShowWallet: true,
}

export const doge: CryptoCurrency = {
  currency: CurrencyEnum.doge,
  name: 'Dogecoin',
  specificName: 'Dogecoin',
  symbol: 'DOGE',
  coinGeckoName: 'dogecoin',
  decimalRepLength: 8,
  decimalDisplayLength: 1,
  confirmations: 2,
  autoCreateWallet: true,
  alwaysShowWallet: true,
}

export const ltc: CryptoCurrency = {
  currency: CurrencyEnum.ltc,
  name: 'Litecoin',
  specificName: 'Litecoin',
  symbol: 'LTC',
  coinGeckoName: 'litecoin',
  decimalRepLength: 8,
  decimalDisplayLength: 4,
  confirmations: 2,
  autoCreateWallet: true,
  alwaysShowWallet: true,
}

export const matic: CryptoCurrency = {
  currency: CurrencyEnum.matic,
  name: 'Matic',
  specificName: 'Matic (Polygon)',
  symbol: 'MATIC',
  coinGeckoName: 'matic-network',
  decimalRepLength: 18,
  decimalDisplayLength: 2,
  confirmations: 2,
  alwaysShowWallet: true,
}

export const usdc: CryptoCurrency = {
  currency: CurrencyEnum.usdc,
  name: 'USDCoin',
  specificName: 'ERC-20 USDC',
  symbol: 'USDC',
  coinGeckoName: 'usd-coin',
  decimalDisplayLength: 2,
  decimalRepLength: 6,
  usdStable: true,
  confirmations: 2,
  alwaysShowWallet: true,
  hideWallet: false,
  disableWithdrawals: false,
  disableDeposits: false,
  disableBuyOption: false,
}

export const usdt: CryptoCurrency = {
  currency: CurrencyEnum.usdt,
  name: 'Tether',
  specificName: 'ERC-20 Tether',
  symbol: 'USDT',
  coinGeckoName: 'tether',
  decimalDisplayLength: 2,
  decimalRepLength: 6,
  usdStable: true,
  confirmations: 2,
  alwaysShowWallet: true,
  hideWallet: false,
  disableWithdrawals: false,
  disableDeposits: false,
  disableBuyOption: false,
}

export const cryptoCurrencies: CryptoCurrency[] = [
  bnb,
  btc,
  dai,
  doge,
  eth,
  ltc,
  matic,
  usdc,
  usdt,
]

export interface CryptoToken {
  crypto: CryptoCurrency
  tokenContract: string
  decimalRepLength: number
  chainId?: string
  isDefaultChain?: boolean
}

export enum LanguageEnum {
  Bi = 'bi',
  Ch = 'zh',
  De = 'de',
  En = 'en',
  Es = 'es',
  Fi = 'fi',
  Fr = 'fr',
  Ja = 'ja',
  Pr = 'pr',
  Pt = 'pt',
  Ru = 'ru',
  Cs = 'cs'
}