import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  TileState,
  TileStateEnum,
  MinesBoardStatesEnum,
  MinesState,
  Action,
  MinesStateActionsEnum
} from './mines-types'
import { LanguageEnum, randomIntFromInterval, timeout } from 'utils'

const FiatArr = ['usd', 'jpy', 'eur']
const CryptoArr = [
  'arb',
  'ava',
  'bnb',
  'btc',
  'cro',
  'dai',
  'dash',
  'demo',
  'doge',
  'eth',
  'ftm',
  'ltc',
  'matic',
  'usdc',
  'usdt'
]

interface BalanceItem {
  sessionId: number | string
  balance: number
}

export function initMineField(): TileState[] {
  return Array(25)
    .fill(0)
    .map((_, i) => ({
      id: i,
      index: i,
      isMine: undefined,
      state: TileStateEnum.Hidden
    }))
}

export const MinesContext = React.createContext<{
  curBalance: number
  setCurBalance: any
  updateStorageBalance: any
  currentWalletState: any
  coinPriceData: any
  selectedFiatCurrency: any
  isSound: any
  lang: any
  checkGameState: any
  mineSubsData: any
  maxPayoutData: any
  gameInProgress: boolean
  numOfMines: number
  leftGems: number
  nextMultiplier: number
  totalMultiplier: number
  cardStatus: Array<TileState>
  betAmount: any

  setGameInProgress: React.Dispatch<React.SetStateAction<boolean>>
  setNumOfMines: React.Dispatch<React.SetStateAction<number>>
  setbetAmount: React.Dispatch<React.SetStateAction<any>>
  setSelectedFiatCurrency: React.Dispatch<React.SetStateAction<any>>
  setIsSound: React.Dispatch<React.SetStateAction<any>>
  setLang: React.Dispatch<React.SetStateAction<any>>
  setCurrentWalletState: React.Dispatch<React.SetStateAction<any>>
  setCoinPriceData: React.Dispatch<React.SetStateAction<any>>
  setCheckGameState: React.Dispatch<React.SetStateAction<any>>
  setMineSubsData: React.Dispatch<React.SetStateAction<any>>
  setMaxPayoutData: React.Dispatch<React.SetStateAction<any>>
  handleBet: () => void
  handleCashout: () => void
  handleTileClick: (index: number) => void
  handleRandomClick: () => void
}>({
  curBalance: 0,
  setCurBalance: () => null,
  updateStorageBalance: (
    sessionIdToUpdate: number | string,
    newBalance: number
  ) => null,
  selectedFiatCurrency: {},
  gameInProgress: false,
  numOfMines: 0,
  setNumOfMines: () => null,
  setGameInProgress: () => null,
  setSelectedFiatCurrency: () => null,
  currentWalletState: {},
  setCurrentWalletState: () => null,
  coinPriceData: {},
  setCoinPriceData: () => null,
  isSound: {},
  setIsSound: () => null,
  lang: {},
  setLang: () => null,
  leftGems: 0,
  nextMultiplier: 0,
  totalMultiplier: 0,
  cardStatus: [],
  betAmount: '0.00',
  setbetAmount: () => null,
  checkGameState: {},
  setCheckGameState: () => null,
  mineSubsData: {},
  setMineSubsData: () => null,
  maxPayoutData: {},
  setMaxPayoutData: () => null,
  handleBet: () => null,
  handleCashout: () => null,
  handleTileClick: (index: number) => null,
  handleRandomClick: () => null
})

let nums = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24
]

export const useMinesStateContext = () => React.useContext(MinesContext)

export function MinesStateProvider({ children }: any): JSX.Element {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const currency = searchParams.get('currency') || 'usdt'
  const fiat = searchParams.get('fiat')
  const startBalance = searchParams.get('startBalance') || '100'
  const sessionId = searchParams.get('sessionId') || '1001'
  const maxWin = searchParams.get('maxWin') || '1000'

  const [currentWalletState, setCurrentWalletState] = React.useState<any>({
    type: currency
      ? CryptoArr.includes(currency.toLowerCase())
        ? currency.toLowerCase()
        : 'btc'
      : 'btc',
    available: startBalance || 100
  })

  const [selectedFiatCurrency, setSelectedFiatCurrency] = React.useState<any>(
    fiat ? (FiatArr.includes(fiat.toLowerCase()) ? fiat : null) : null
  )

  const [coinPriceData, setCoinPriceData] = React.useState<any>({
    Fiat: fiat || 'USD',
    btc: 30180,
    dai: 1,
    doge: 0.070666,
    eth: 1909.54,
    ltc: 92.92,
    matic: 0.767363,
    usdc: 1,
    usdt: 1,
    updatedAt: 1689835170652
  })

  const [isSound, setIsSound] = React.useState<any>(true)

  const [lang, setLang] = React.useState<any>(LanguageEnum.En)

  const [maxPayoutData, setMaxPayoutData] = React.useState<any>(maxWin)

  const [checkGameState, setCheckGameState] = React.useState<any>(null)
  const [gameInProgress, setGameInProgress] = React.useState<boolean>(false)
  const [numOfMines, setNumOfMines] = React.useState<number>(3)
  const [minePositions, setMinePositions] = React.useState<Array<number>>([])
  const [cardStatus, setCardStatus] = React.useState<Array<TileState>>(
    initMineField()
  )
  const [nextMultiplier, setNextMultiplier] = React.useState<number>(0)
  const [totalMultiplier, setTotalMultiplier] = React.useState<number>(0)
  const [leftGems, setLeftGems] = React.useState<number>(0)

  const [mineSubsData, setMineSubsData] = React.useState<any>(undefined)

  const [betAmount, setbetAmount] = React.useState<string>('0.00000000')
  const [curBalance, setCurBalance] = React.useState<number>(0)
  const [balanceList, setBalanceList] = React.useState<BalanceItem[]>(
    JSON.parse(localStorage.getItem('balance') || '[]')
  )

  const generateRandomArr = () => {
    if (numOfMines > 0) {
      let newList: any = []
      for (var i = 0; i < numOfMines; i++) {
        var randomIndex
        var randomElement
        do {
          randomIndex = Math.floor(Math.random() * nums.length)
          randomElement = nums[randomIndex]
        } while (newList.includes(randomElement))

        newList.push(randomElement)
      }
      return newList
    }
  }

  const handleRandomClick = () => {
    const hiddenTiles: TileState[] = cardStatus.filter(
      (tile) => tile.state === TileStateEnum.Hidden
    )
    const randomTileIndex = randomIntFromInterval(0, hiddenTiles?.length - 1)

    const randomTileID = hiddenTiles[randomTileIndex].id

    handleTileClick(randomTileID)
  }

  const handleTileClick = async (index: number) => {
    if (cardStatus[index].state === TileStateEnum.Hidden) {
      const isMine = checkIfMine(index)

      if (isMine) {
        const newCardStatus = cardStatus.map((tile) =>
          tile.id === index
            ? { ...tile, state: TileStateEnum.UserRevealed, isMine: true }
            : checkIfMine(tile.id)
            ? { ...tile, state: TileStateEnum.Revealed, isMine: true }
            : tile
        )
        setCardStatus(newCardStatus)
        setGameInProgress(false)
        setNextMultiplier(0)
        setTotalMultiplier(0)
        setLeftGems(0)
        await timeout(300)

        const nextCardStatus = newCardStatus.map((tile) =>
          tile.state === TileStateEnum.Hidden
            ? { ...tile, state: TileStateEnum.Revealed }
            : tile
        )
        setCardStatus(nextCardStatus)
      } else {
        const newCardStatus = cardStatus.map((tile) =>
          tile.id === index
            ? { ...tile, state: TileStateEnum.UserRevealed }
            : tile
        )
        setCardStatus(newCardStatus)
        calculateNextMultiplier()
        setLeftGems(leftGems - 1)
      }
    }
  }

  const checkIfMine = (index: number) => {
    return minePositions.includes(index)
  }

  const calculateNextMultiplier = () => {
    let total = Number(
      (1 + Math.pow(1 - numOfMines / 25, 25 - leftGems - numOfMines + 1)).toFixed(2)
    )
    console.log(1 + Math.pow(1 - numOfMines / 25, 25 - leftGems - numOfMines + 1))
    setTotalMultiplier(total)
  }

  const handleBet = () => {
    setGameInProgress(true)
    setCardStatus(initMineField())
    setMinePositions(generateRandomArr())
    setLeftGems(25 - numOfMines)
    setCurBalance(curBalance - Number(betAmount))
    setTotalMultiplier(1)
    if (sessionId)
      updateStorageBalance(sessionId, curBalance - Number(betAmount))
  }

  const handleCashout = () => {
    setGameInProgress(true)

    const newCardStatus = cardStatus.map((tile) => {
      if (tile.state === TileStateEnum.Hidden) {
        if (checkIfMine(tile.id)) {
          return {
            ...tile,
            state: TileStateEnum.Revealed,
            isMine: true
          }
        } else {
          return {
            ...tile,
            state: TileStateEnum.Revealed
          }
        }
      }
      return tile
    })
    setCardStatus(newCardStatus)

    const newBalance = curBalance + Number(betAmount) * totalMultiplier
    updateStorageBalance(sessionId, Number(newBalance))
    setCurBalance(Number(newBalance))
    setCurrentWalletState({
      ...currentWalletState,
      available: Number(newBalance)
    })
  }

  React.useEffect(() => {
    if (sessionId) {
      const storedBalance = balanceList.find(
        (item) => item.sessionId === sessionId
      )
      if (storedBalance) {
        if (storedBalance.sessionId === sessionId) {
          setCurBalance(storedBalance.balance)
          setCurrentWalletState({
            ...currentWalletState,
            available: storedBalance.balance
          })
        } else {
          updateStorageBalance(sessionId, Number(startBalance))
          setCurBalance(Number(startBalance))
          setCurrentWalletState({
            ...currentWalletState,
            available: Number(startBalance)
          })
        }
      } else {
        updateStorageBalance(sessionId, Number(startBalance))
        setCurBalance(Number(startBalance))
        setCurrentWalletState({
          ...currentWalletState,
          available: Number(startBalance)
        })
      }
    }
  }, [sessionId])

  React.useEffect(() => {
    localStorage.setItem('balance', JSON.stringify(balanceList))
  }, [balanceList])

  const updateStorageBalance = (
    sessionIdToUpdate: number | string,
    newBalance: number
  ) => {
    const updatedList = [...balanceList]
    const indexToUpdate = updatedList.findIndex(
      (item) => item.sessionId === sessionIdToUpdate
    )
    if (indexToUpdate !== -1) {
      updatedList[indexToUpdate].balance = newBalance
      setBalanceList(updatedList)
    } else {
      setBalanceList([
        ...updatedList,
        { sessionId: sessionIdToUpdate, balance: newBalance }
      ])
    }
  }

  return (
    <MinesContext.Provider
      value={{
        curBalance,
        setCurBalance,
        updateStorageBalance,
        gameInProgress,
        setGameInProgress,
        numOfMines,
        setNumOfMines,
        selectedFiatCurrency,
        setSelectedFiatCurrency,
        currentWalletState,
        setCurrentWalletState,
        coinPriceData,
        setCoinPriceData,
        isSound,
        setIsSound,
        lang,
        setLang,
        nextMultiplier,
        totalMultiplier,
        leftGems,
        cardStatus,
        betAmount,
        setbetAmount,
        checkGameState,
        setCheckGameState,
        mineSubsData,
        setMineSubsData,
        maxPayoutData,
        setMaxPayoutData,
        handleBet,
        handleCashout,
        handleRandomClick,
        handleTileClick
      }}
    >
      {children}
    </MinesContext.Provider>
  )
}
