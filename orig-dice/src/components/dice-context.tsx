import * as React from 'react'
import { useLocation } from 'react-router-dom'
import useSound from 'use-sound'
import {
  DiceRollConditionEnum,
  LanguageEnum,
  decimalCryptoDisplay,
  decimalDisplayLength,
  generateRandomHex,
  timeout
} from 'utils'
import { OnWin, OnLoss } from './dice-sidebar'
import diceBetSound from 'assets/sounds/bet-button-press.mp3'
import diceRollSound from 'assets/sounds/dice-roll-sound.mp3'
import diceWinSound from 'assets/sounds/dice-win.mp3'

export interface Bet {
  id: string | undefined
  numberRolled: string | number | undefined
  win: boolean | undefined
}

interface BalanceItem {
  sessionId: number | string
  balance: number
}

interface DiceContextInterface {
  numberRolled: number
  rollOverUnder: string
  isRollOverOrUnder: DiceRollConditionEnum
  betAmount: string
  initialBetAmount: string
  onWin: string
  onLoss: string
  currentProfit: number
  profitOnWin: string
  stopOnProfit: string
  stopOnLoss: string
  numOfBets: string
  betsFinished: number
  selectedOnWin: OnWin
  selectedOnLoss: OnLoss
  minBet: string
  maxBet1: string
  cashout: string
  winChance: string
  gameInProgress: boolean
  rotateBoxTo: number
  autoBetInProgress: boolean | undefined
  angle: number
  pastBets: Bet[]
  playBetSound: any
  playDiceRollSound: any
  playDiceWinSound: any
  needToStopNextTime: boolean
  setInitialBetAmount: React.Dispatch<React.SetStateAction<string>>
  setOnWin: React.Dispatch<React.SetStateAction<string>>
  setOnLoss: React.Dispatch<React.SetStateAction<string>>
  setProfitOnWin: React.Dispatch<React.SetStateAction<string>>
  setStopOnProfit: React.Dispatch<React.SetStateAction<string>>
  setStopOnLoss: React.Dispatch<React.SetStateAction<string>>
  setNumOfBets: React.Dispatch<React.SetStateAction<string>>
  setSelectedOnWin: React.Dispatch<React.SetStateAction<OnWin>>
  setSelectedOnLoss: React.Dispatch<React.SetStateAction<OnLoss>>
  setCurrentProfit: React.Dispatch<React.SetStateAction<number>>
  setBetsFinished: React.Dispatch<React.SetStateAction<number>>
  setPastBets: React.Dispatch<React.SetStateAction<Bet[]>>
  setAngle: React.Dispatch<React.SetStateAction<number>>
  setRotateBoxTo: React.Dispatch<React.SetStateAction<number>>
  setWinChance: React.Dispatch<React.SetStateAction<string>>
  setAutoBetInProgress: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
  setGameInProgress: React.Dispatch<React.SetStateAction<boolean>>
  setNeedToStopNextTime: React.Dispatch<React.SetStateAction<boolean>>
  setCashout: React.Dispatch<React.SetStateAction<string>>
  setBetAmount: React.Dispatch<React.SetStateAction<string>>
  setNumberRolled: React.Dispatch<React.SetStateAction<number>>
  setrollOverUnder: React.Dispatch<React.SetStateAction<string>>
  setIsRollOverOrUnder: React.Dispatch<
    React.SetStateAction<DiceRollConditionEnum>
  >
  resetBoard: (isAuto: boolean) => void
  handleAutoBet: () => void
  handleManualBet: () => void
  handleOnePlay: (isAuto: boolean) => void

  selectedFiatCurrency: any
  isSound: any
  lang: any
  maxPayoutData: any
  currentWalletState: any
  coinPriceData: any
  loading: boolean
  curBalance: number
  setSelectedFiatCurrency: React.Dispatch<React.SetStateAction<any>>
  setIsSound: React.Dispatch<React.SetStateAction<any>>
  setLang: React.Dispatch<React.SetStateAction<any>>
  setMaxPayoutData: React.Dispatch<React.SetStateAction<any>>
  setCurrentWalletState: React.Dispatch<React.SetStateAction<any>>
  setCoinPriceData: React.Dispatch<React.SetStateAction<any>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const DiceContext = React.createContext({} as DiceContextInterface)

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

const DiceContextProvider: React.FC = ({ children }: any) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const currency = searchParams.get('currency') || 'usdt'
  const fiat = searchParams.get('fiat')
  const startBalance = searchParams.get('startBalance') || '100'
  const sessionId = searchParams.get('sessionId') || '1001'
  const maxWin = searchParams.get('maxWin') || '1000'
  const minBet = searchParams.get('minBet') || '0'
  const maxBet1 = searchParams.get('maxBet') || '100'

  const [gameInProgress, setGameInProgress] = React.useState<boolean>(false)
  const [autoBetInProgress, setAutoBetInProgress] = React.useState<
    boolean | undefined
  >()

  const [pastBets, setPastBets] = React.useState<Bet[]>([])

  const [rotateBoxTo, setRotateBoxTo] = React.useState<number>(0)
  const [angle, setAngle] = React.useState<number>(0)

  const [numberRolled, setNumberRolled] = React.useState<number>(0)
  const [rollOverUnder, setrollOverUnder] = React.useState<string>('50.50')
  const [isRollOverOrUnder, setIsRollOverOrUnder] =
    React.useState<DiceRollConditionEnum>(DiceRollConditionEnum.Over)

  const [betAmount, setBetAmount] = React.useState<string>('0.00')
  const [cashout, setCashout] = React.useState<string>('2.0000')
  const [winChance, setWinChance] = React.useState<string>('49.50')

  const [currentWalletState, setCurrentWalletState] = React.useState<any>({
    type: currency
      ? CryptoArr.includes(currency.toLowerCase())
        ? currency.toLowerCase()
        : 'btc'
      : 'btc',
    available: startBalance || 100
  })

  const [initialBetAmount, setInitialBetAmount] = React.useState(
    decimalCryptoDisplay(0, currentWalletState.type)
  )
  const [onWin, setOnWin] = React.useState<string>('0.00')
  const [onLoss, setOnLoss] = React.useState<string>('0.00')
  const [currentProfit, setCurrentProfit] = React.useState<number>(0)
  const [profitOnWin, setProfitOnWin] = React.useState<string>(
    decimalCryptoDisplay(0, currentWalletState.type)
  )
  const [stopOnProfit, setStopOnProfit] = React.useState<string>(
    decimalCryptoDisplay(0, currentWalletState.type)
  )
  const [stopOnLoss, setStopOnLoss] = React.useState<string>(
    decimalCryptoDisplay(0, currentWalletState.type)
  )
  const [numOfBets, setNumOfBets] = React.useState<string>('0')
  const [betsFinished, setBetsFinished] = React.useState<number>(0)
  const [selectedOnWin, setSelectedOnWin] = React.useState<OnWin>(OnWin.AUTO)
  const [selectedOnLoss, setSelectedOnLoss] = React.useState<OnLoss>(
    OnLoss.AUTO
  )

  const [playBetSound] = useSound(diceBetSound)
  const [playDiceRollSound] = useSound(diceRollSound)
  const [playDiceWinSound] = useSound(diceWinSound)

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

  const [loading, setLoading] = React.useState<boolean>(false)
  const [curBalance, setCurBalance] = React.useState<number>(0)
  const [needToStopNextTime, setNeedToStopNextTime] =
    React.useState<boolean>(false)
  const [balanceList, setBalanceList] = React.useState<BalanceItem[]>(
    JSON.parse(localStorage.getItem('balance') || '[]')
  )

  const handleManualBet = () => {
    handleOnePlay(false)
  }

  const handleAutoBet = () => {
    setAutoBetInProgress(true)
    handleOnePlay(true)
  }

  const handleOnePlay = async (isAutoBet: boolean) => {
    setGameInProgress(true)
    updateBalance(parseFloat(betAmount))
    setLoading(true)

    if (isSound) {
      playBetSound()
    }
    const result = await handleGetResult() //// to replace API
    setNumberRolled(result)
    if (isSound) {
      playDiceRollSound()
    }
    const isWin = checkWinOrLose(
      result,
      parseFloat(rollOverUnder),
      isRollOverOrUnder
    )
    updatePastPets(generateRandomHex(10), result, isWin)
    if (isAutoBet) {
      let newProfit = currentProfit
      if (isWin) {
        setTimeout(() => {
          playDiceWinSound()
        }, 500)
        updateBetAmountOnWin()
        newProfit = currentProfit + parseFloat(profitOnWin)
        setCurrentProfit(newProfit)
      } else {
        updateBetAmountOnLoss()
        newProfit = currentProfit - parseFloat(betAmount)
        setCurrentProfit(newProfit)
      }
      if (
        checkStopOnLossOrProfit(
          newProfit,
          parseFloat(stopOnLoss),
          parseFloat(stopOnProfit)
        )
      ) {
        setNeedToStopNextTime(true)
      } else {
        if (parseInt(numOfBets) !== 0) {
          if (parseInt(numOfBets) === betsFinished) {
            setNeedToStopNextTime(true)
          } else {
            setBetsFinished(betsFinished + 1)
          }
        }
      }
    } else {
      setCurrentProfit(0)
    }
    if (isWin) {
      updateBalance(parseFloat(betAmount), parseFloat(profitOnWin))
    }
    await timeout(500)
    setLoading(false)
    setGameInProgress(false)
  }

  const updatePastPets = (id: string, result: number, isWin: boolean) => {
    const newBet: Bet = {
      id,
      numberRolled: result.toFixed(2),
      win: isWin
    }
    if (pastBets.length >= 7) {
      pastBets.pop()
    }
    const newBetsArray = pastBets
    newBetsArray.unshift(newBet)
    setPastBets(newBetsArray)
  }

  const updateBetAmountOnWin = () => {
    if (selectedOnWin === OnWin.INCREASE) {
      const amountToAdd = (parseFloat(betAmount) / 100) * parseFloat(onWin)
      const newBetAmount = (parseFloat(betAmount) + amountToAdd).toFixed(
        decimalDisplayLength(currentWalletState.type)
      )
      setBetAmount(
        selectedFiatCurrency && coinPriceData
          ? Number(newBetAmount).toFixed(2)
          : newBetAmount
      )
    } else {
      setBetAmount(
        selectedFiatCurrency && coinPriceData
          ? Number(initialBetAmount).toFixed(2)
          : initialBetAmount
      )
    }
    setBetAmount(
      ((parseFloat(betAmount) * (100 + parseFloat(onWin))) / 100).toString()
    )
  }

  const updateBetAmountOnLoss = () => {
    if (selectedOnLoss === OnLoss.INCREASE) {
      const amountToAdd = (parseFloat(betAmount) / 100) * parseFloat(onLoss)
      const newBetAmount = (parseFloat(betAmount) + amountToAdd).toFixed(
        decimalDisplayLength(currentWalletState.type)
      )

      setBetAmount(
        selectedFiatCurrency && coinPriceData
          ? Number(newBetAmount).toFixed(2)
          : newBetAmount
      )
    } else {
      setBetAmount(
        selectedFiatCurrency && coinPriceData
          ? Number(initialBetAmount).toFixed(2)
          : initialBetAmount
      )
    }
  }

  const checkWinOrLose = (
    result: number,
    rolledNumber: number,
    isRollOverOrUnder: DiceRollConditionEnum
  ) => {
    if (isRollOverOrUnder === DiceRollConditionEnum.Over) {
      if (result >= rolledNumber) {
        return true
      } else {
        return false
      }
    } else {
      if (result <= rolledNumber) {
        return true
      } else {
        return false
      }
    }
  }

  const checkStopOnLossOrProfit = (
    curProfit: number,
    stopOnLoss: number,
    stopOnProfit: number
  ) => {
    // console.log(curProfit, stopOnLoss, stopOnProfit)
    if (stopOnProfit > 0 && curProfit >= stopOnProfit) {
      return true
    }
    if (stopOnLoss > 0 && Math.abs(curProfit) >= stopOnLoss) {
      return true
    }

    return false
  }

  React.useEffect(() => {
    if (autoBetInProgress) {
      if (needToStopNextTime) {
        resetBoard(true)
      } else {
        if (!gameInProgress) {
          if (parseFloat(numOfBets) === 0) {
            handleOnePlay(true)
          } else {
            if (betsFinished < parseFloat(numOfBets)) {
              handleOnePlay(true)
            } else {
              resetBoard(true)
            }
          }
        }
      }
    }
  }, [betsFinished, gameInProgress])

  const randomNum =
    Math.floor(Math.random() * (100 * 100 - 1 * 100) + 1 * 100) / (1 * 100)

  const handleGetResult = async () => {
    return randomNum
  }

  const updateBalance = (amount: number, profit = 0) => {
    let balance = 0
    if (profit === 0) {
      balance = curBalance - amount
      setCurBalance(balance)
      setCurrentWalletState({
        ...currentWalletState,
        available: balance
      })
      setCurBalance(balance)
    } else {
      balance = curBalance + Number(profit)
      setCurrentWalletState({
        ...currentWalletState,
        available: balance
      })
      setCurBalance(balance)
    }
    if (sessionId) updateStorageBalance(sessionId, balance)
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

  const resetBoard = (isAuto: boolean): void => {
    if (!isAuto) {
      setNumberRolled(0)
      setAngle(180)
      setrollOverUnder('50.50')
      setWinChance('49.50')
      setCashout('2.0000')
      setRotateBoxTo(180)
    }
    setAutoBetInProgress(false)
    setGameInProgress(false)
    setNeedToStopNextTime(false)
    setCurrentProfit(0)
    setBetsFinished(0)
  }

  return (
    <DiceContext.Provider
      value={{
        pastBets,
        rollOverUnder,
        rotateBoxTo,
        numberRolled,
        isRollOverOrUnder,
        betAmount,
        cashout,
        gameInProgress,
        winChance,
        autoBetInProgress,
        angle,
        initialBetAmount,
        onWin,
        onLoss,
        currentProfit,
        profitOnWin,
        stopOnProfit,
        stopOnLoss,
        numOfBets,
        betsFinished,
        selectedOnWin,
        selectedOnLoss,
        selectedFiatCurrency,
        isSound,
        lang,
        maxPayoutData,
        currentWalletState,
        coinPriceData,
        needToStopNextTime,
        loading,
        minBet,
        maxBet1,
        curBalance,
        setrollOverUnder,
        setInitialBetAmount,
        setOnWin,
        setOnLoss,
        setCurrentProfit,
        setStopOnLoss,
        setStopOnProfit,
        setNumOfBets,
        setBetsFinished,
        setSelectedOnLoss,
        setSelectedOnWin,
        setProfitOnWin,
        setPastBets,
        setAngle,
        setRotateBoxTo,
        setWinChance,
        setGameInProgress,
        setCashout,
        setBetAmount,
        setNumberRolled,
        setIsRollOverOrUnder,
        setAutoBetInProgress,
        resetBoard,

        playBetSound,
        playDiceRollSound,
        playDiceWinSound,

        setNeedToStopNextTime,
        setSelectedFiatCurrency,
        setLang,
        setIsSound,
        setMaxPayoutData,
        setCurrentWalletState,
        setCoinPriceData,
        setLoading,
        handleAutoBet,
        handleManualBet,
        handleOnePlay
      }}
    >
      {children}
    </DiceContext.Provider>
  )
}

export default DiceContextProvider

export const useDiceContext = () => {
  return React.useContext(DiceContext);
}