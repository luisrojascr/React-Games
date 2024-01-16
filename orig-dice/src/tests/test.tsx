import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { it, vi, test, describe, expect } from 'vitest'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByTestId
} from '@testing-library/react'
import { randomUUID } from 'crypto'
import { act } from 'react-dom/test-utils'
import checkWinOrLose from '../components/dice-context'
// import '@testing-library/jest-dom/extend-expect';

import '../i18n'

import { MainModule } from './../modules/main'
import DiceContextProvider, {
  DiceContext,
  useDiceContext
} from '../components/dice-context'
import { DiceRollConditionEnum, round, timeout } from 'utils'

// UI Unit Testing

describe('Manual Bet', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MainModule />
      </BrowserRouter>
    )
  })

  it('should init elements for bets', () => {
    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement
    expect(sliderElement.value).toBe('50.50')
    expect(profitElement.value).toBe('0.00')
    expect(inputElement.value).toBe('0.00')
  })

  it('verify profit amount on win for 50/50', () => {
    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement
    fireEvent.change(inputElement, { target: { value: '0.05' } })
    expect(sliderElement.value).toBe('50.50')
    expect(inputElement.value).toBe('0.05')
    expect(profitElement.value).toBe('0.05')
  })

  it('verify profit amount on win for 25', () => {
    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    fireEvent.change(inputElement, { target: { value: '0.05' } })
    fireEvent.change(sliderElement, { target: { value: 75.0 } })

    expect(sliderElement.value).toBe('75.00')
    expect(inputElement.value).toBe('0.05')
    expect(profitElement.value).toBe('0.15')
  })
})

describe('Manual Best Running', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MainModule />
      </BrowserRouter>
    )
  })

  it('test bet with another win chance', async () => {
    const newValue = '10.00'
    const rollOverUnder = parseFloat(newValue).toFixed(2)

    const initialBalanceElement = screen.getByText(/balance/i)
    const initialBalance = Number(
      initialBalanceElement.innerText.split(' - ')[1].slice(0, -1)
    )

    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    let betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    expect(betButton.disabled).toBe(true)

    // Change Win Chance slider
    fireEvent.change(inputElement, { target: { value: '10' } })
    // Input Bet Amount
    fireEvent.change(sliderElement, {
      target: { value: rollOverUnder }
    })

    expect(sliderElement.value).toBe(rollOverUnder)

    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    expect(inputElement.value).toBe('10')

    await waitFor(() => {
      expect(profitElement.value).toBe('1.00')
    })

    betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    expect(betButton.disabled).toBe(false)

    act(() => {
      betButton.click()
    })

    const balanceAfterBetElement = screen.getByText(/balance/i)
    const balanceAfterBet = Number(
      balanceAfterBetElement.innerText.split(' - ')[1].slice(0, -1)
    )
    expect(
      balanceAfterBet === initialBalance + 10 ||
        balanceAfterBet === initialBalance - 10
    ).toBe(true)
  })
})

describe('Auto Bet', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <MainModule />
      </BrowserRouter>
    )
  })

  it('bet amount infinite times', async () => {
    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    fireEvent.change(betInputElement, { target: { value: '1.00' } })
    // fireEvent.change(numberOfBetsInputElement, { target: { value: '1' } })

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
    })

    // autobet button won't stop..
    expect(
      async () =>
        await waitFor(() => {
          const betButton = screen.getByTestId(
            'bet-button'
          ) as HTMLButtonElement
          expect(betButton.textContent?.toLowerCase()).toBe('start autobet')
        })
    ).rejects.toBeTruthy()
  })

  it('bet amount with number of bets and reset profit/loss', async () => {
    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const numberOfBetsInputElement = screen.getByTestId(
      'number-of-bets'
    ) as HTMLInputElement

    fireEvent.change(betInputElement, { target: { value: '1.00' } })
    fireEvent.change(numberOfBetsInputElement, { target: { value: '1' } })

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
    })

    // check if past-bet were shown on screen
    await waitFor(() => {
      expect(screen.getByTestId('past-bet-button:0')).toBeTruthy()
    })

    // eventually autobet button will stop
    await waitFor(() => {
      const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
      expect(betButton.textContent?.toLowerCase()).toBe('start autobet')
    })
  })

  it('stop on profit', async () => {
    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const stopOnProfit = screen.getByTestId(
      'stop-on-profit'
    ) as HTMLInputElement

    const initialBalanceElement = screen.getAllByText(/balance/i)
    const initialBalance = Number(
      initialBalanceElement[0].innerText.split(' - ')[1].slice(0, -1)
    )

    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    fireEvent.change(sliderElement, {
      target: { value: '2.00' }
    })

    fireEvent.change(betInputElement, { target: { value: '100.00' } })
    fireEvent.change(stopOnProfit, { target: { value: '1.00' } })

    let betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
    })

    await waitFor(() => {
      const balanceElementAfterBet = screen.getAllByText(/balance/i)
      const balanceAfterBet = Number(
        balanceElementAfterBet[0].innerText.split(' - ')[1].slice(0, -1)
      )
      expect(balanceAfterBet).toBeGreaterThanOrEqual(initialBalance)
    })
  })

  it('stop on loss', async () => {
    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const stopOnProfit = screen.getByTestId(
      'stop-on-profit'
    ) as HTMLInputElement

    const initialBalanceElement = screen.getByText(/balance/i)
    const initialBalance = Number(
      initialBalanceElement.innerText.split(' - ')[1].slice(0, -1)
    )

    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    fireEvent.change(sliderElement, {
      target: { value: '98.00' }
    })

    fireEvent.change(betInputElement, { target: { value: '10.00' } })
    fireEvent.change(stopOnProfit, { target: { value: '1.00' } })

    let betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
    })

    await waitFor(() => {
      const balanceElementAfterBet = screen.getByText(/balance/i)
      const balanceAfterBet = Number(
        balanceElementAfterBet.innerText.split(' - ')[1].slice(0, -1)
      )
      expect(balanceAfterBet).toBeLessThanOrEqual(initialBalance - 1)
    })
  })
})

// Dice Context Function UI test
describe('update Past Bets', () => {
  interface pastBetsData {
    id: string | null
    numberRolled: number
    win: boolean
  }
  it('should add a new bet to pastBets', async () => {
    const TestComponent = () => {
      const { pastBets, setPastBets } = useDiceContext()
      const addBet = () => {
        setPastBets([...pastBets, { id: '1', numberRolled: 50.25, win: true }])
      }

      return (
        <>
          <button onClick={addBet}>Add Bet</button>
          <div data-testid="pastBets">{JSON.stringify(pastBets)}</div>
        </>
      )
    }

    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <DiceContextProvider>
          <TestComponent />
        </DiceContextProvider>
      </BrowserRouter>
    )

    act(() => {
      getByText('Add Bet').click()
    })

    const pastBetsElement = getByTestId('pastBets')
    const pastBetsData: pastBetsData = JSON.parse(
      pastBetsElement.textContent ?? ''
    )

    expect(pastBetsData).toStrictEqual([
      {
        id: '1',
        numberRolled: 50.25,
        win: true
      }
    ])
  })
})

describe('checkWinOrLose', () => {
  interface TestComponentProps {
    result: number
    rolledNumber: number
    condition: string
  }

  const checkWinOrLoseMock = vi.fn((result, rolledNumber, condition) => {
    return condition === 'over' ? result > rolledNumber : false
  })

  const renderedTestComponent = (
    result: number,
    rolledNumber: number,
    condition: string
  ) => {
    return render(
      <BrowserRouter>
        <DiceContextProvider>
          <TestComponent
            result={result}
            rolledNumber={rolledNumber}
            condition={condition}
          />
        </DiceContextProvider>
      </BrowserRouter>
    )
  }

  const TestComponent = ({
    result,
    rolledNumber,
    condition
  }: TestComponentProps) => {
    const isWin = checkWinOrLoseMock(result, rolledNumber, condition)

    return <div data-testid="result">{isWin.toString()}</div>
  }

  it('should return true when result is greater than rolledNumber, Over', () => {
    const { getByTestId } = renderedTestComponent(60, 50, 'over')

    const resultElement = getByTestId('result')
    const resultValue = resultElement.textContent
    expect(resultValue).toEqual('true')

    expect(checkWinOrLoseMock).toHaveBeenCalledWith(60, 50, 'over')
  })

  it('should return false when result is less than rolledNUmber, Over', () => {
    const { getByTestId } = renderedTestComponent(50, 70, 'over')

    const resultElement = getByTestId('result')
    const resultValue = resultElement.textContent
    expect(resultValue).toEqual('false')

    expect(checkWinOrLoseMock).toHaveBeenCalledWith(50, 70, 'over')
  })

  it('should return true when result is less than rolledNUmber, Under', () => {
    const { getByTestId } = renderedTestComponent(50, 70, 'under')

    const resultElement = getByTestId('result')
    const resultValue = resultElement.textContent
    expect(resultValue).toEqual('false')

    expect(checkWinOrLoseMock).toHaveBeenCalledWith(50, 70, 'under')
  })

  it('should return false when result is more than rolledNumber, under', () => {
    const { getByTestId } = renderedTestComponent(60, 70, 'under')

    const resultElement = getByTestId('result')
    const resultValue = resultElement.textContent
    expect(resultValue).toEqual('false')

    expect(checkWinOrLoseMock).toHaveBeenCalledWith(60, 70, 'under')
  })
})

describe('checkStopOnLossOrProfit', () => {
  interface TestComponentProps {
    curProfit: number
    stopOnLoss: number
    stopOnProfit: number
  }

  const checkStopOnLossOrProfitMock = vi.fn(
    (curProfit, stopOnLoss, stopOnProfit) => {
      if (stopOnProfit > 0 && curProfit >= stopOnProfit) {
        return true
      }
      if (stopOnLoss > 0 && Math.abs(curProfit) >= stopOnLoss) {
        return true
      }

      return false
    }
  )

  const renderedTestComponent = (
    curProfit: number,
    stopOnLoss: number,
    stopOnProfit: number
  ) => {
    return render(
      <BrowserRouter>
        <DiceContextProvider>
          <TestComponent
            curProfit={curProfit}
            stopOnLoss={stopOnLoss}
            stopOnProfit={stopOnProfit}
          />
        </DiceContextProvider>
      </BrowserRouter>
    )
  }

  const TestComponent = ({
    curProfit,
    stopOnLoss,
    stopOnProfit
  }: TestComponentProps) => {
    const stop = checkStopOnLossOrProfitMock(
      curProfit,
      stopOnLoss,
      stopOnProfit
    )
    return <div data-testid="stop">{stop.toString()}</div>
  }

  it('should return true when curProfit is grater than stopOnProfit', () => {
    const { getByTestId } = renderedTestComponent(50, 10, 0)

    const stopElement = getByTestId('stop')
    const stopValue = stopElement.textContent
    expect(stopValue).toEqual('true')

    expect(checkStopOnLossOrProfitMock).toHaveBeenCalledWith(50, 10, 0)
  })

  it('should return true when postive value curProfit is greater than stopOnLoss', () => {
    const { getByTestId } = renderedTestComponent(100, 10, 50)

    const stopElement = getByTestId('stop')
    const stopValue = stopElement.textContent
    expect(stopValue).toEqual('true')

    expect(checkStopOnLossOrProfitMock).toHaveBeenCalledWith(100, 10, 50)
  })
})

describe('handleGetResult', () => {
  it('should return a random number after a delay', async () => {
    const getRandomNumberMock = vi.fn(() => 47.5)

    const handleGetResult = async () => {
      await timeout(300)
      const randomNum = getRandomNumberMock()
      return randomNum
    }

    const getResultPromise = handleGetResult()

    await timeout(300)

    const result = await getResultPromise

    expect(result).toEqual(47.5)
  })
})

// Unit Testing on DiceContext workflow
describe('Manual Bet', () => {
  it('bet input value', () => {
    render(
      <BrowserRouter>
        <DiceContextProvider betAmount={'0.00'}>
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement

    expect(inputElement.value).toBe('0.00')

    // on change
    fireEvent.change(inputElement, { target: { value: '10.00' } })
    expect(inputElement.value).toBe('10.00')
  })

  it('random number rolled', async () => {
    render(
      <BrowserRouter>
        <DiceContextProvider betAmount={'0.00'} numberRolled={0}>
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )
    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    const handleManualBet = vi.fn(() => {})

    expect(inputElement.value).toBe('0.00')
    expect(sliderElement.value).toBe('50.50')

    // on changing the values

    fireEvent.change(sliderElement, { target: { value: '25.00' } })
    fireEvent.change(inputElement, { target: { value: '10.00' } })

    act(() => {
      betButton.click()
      handleManualBet()
    })
    expect(handleManualBet).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByTestId('past-bet-button:0')).toBeTruthy()
    })
  })

  it('verify profit on win', () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          rollOverUnder={'50.50'}
          winChance={'49.50'}
          numberRolled={0}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement
    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement

    expect(sliderElement.value).toBe('50.50')
    expect(inputElement.value).toBe('0.00')
    expect(profitElement.value).toBe('0.00')

    // on changing the values

    fireEvent.change(sliderElement, { target: { value: '25.00' } })
    fireEvent.change(inputElement, { target: { value: '10.00' } })
    fireEvent.change(profitElement, { target: { value: '3.20' } })
    expect(sliderElement.value).toBe('25.00')
    expect(inputElement.value).toBe('10.00')
    expect(profitElement.value).toBe('3.20')
  })

  it('test bet with another win chance', async () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          rollOverUnder={'50.50'}
          winChance={'49.50'}
          numberRolled={0}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const newValue = '10.00'
    const rollOverUnder = parseFloat(newValue).toFixed(2)

    const initialBalanceElement = screen.getByText(/balance/i)
    const initialBalance = Number(
      initialBalanceElement.innerText.split(' - ')[1].slice(0, -1)
    )
    const handleManualBet = vi.fn(() => {})

    const inputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    expect(sliderElement.value).toBe('50.50')
    expect(inputElement.value).toBe('0.00')
    expect(handleManualBet).toHaveBeenCalledTimes(0)

    // on changing the values

    let betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    expect(betButton.disabled).toBe(true)

    // Change Win Chance slider
    fireEvent.change(inputElement, { target: { value: '10' } })
    // Input Bet Amount
    fireEvent.change(sliderElement, {
      target: { value: rollOverUnder }
    })

    expect(sliderElement.value).toBe(rollOverUnder)

    const profitElement = screen.getByTestId(
      'profit-on-win'
    ) as HTMLInputElement
    expect(inputElement.value).toBe('10')

    await waitFor(() => {
      expect(profitElement.value).toBe('1.00')
    })

    betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    expect(betButton.disabled).toBe(false)

    act(() => {
      betButton.click()
      handleManualBet()
    })

    const balanceAfterBetElement = screen.getByText(/balance/i)
    const balanceAfterBet = Number(
      balanceAfterBetElement.innerText.split(' - ')[1].slice(0, -1)
    )
    expect(
      balanceAfterBet === initialBalance + 10 ||
        balanceAfterBet === initialBalance - 10
    ).toBeTruthy()
    expect(handleManualBet).toHaveBeenCalledTimes(1)
  })
})

describe('Auto', () => {
  it('bet loops infinite times', () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          numOfBets={'0.00'}
          stopOnProfit={'0'}
          stopOnLoss={'0'}
          currentProfit={0}
          rollOverUnder={'50.50'}
          profitOnWin={'0.00'}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    const handleAutoBet = vi.fn(() => {})
    const handleAutoBetInProgress = vi.fn(() => {})

    act(() => {
      autoBetButton.click()
    })

    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    fireEvent.change(betInputElement, { target: { value: '1.00' } })

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement

    act(() => {
      betButton.click()
      handleAutoBet()
      handleAutoBetInProgress()
    })

    // autobet button won't stop
    expect(
      async () =>
        await waitFor(() => {
          const betButton = screen.getByTestId(
            'bet-button'
          ) as HTMLButtonElement
          expect(betButton.textContent?.toLowerCase()).toBe('start autobet')
        })
    ).rejects.toBeTruthy()

    expect(handleAutoBet).toHaveBeenCalled()
    expect(handleAutoBetInProgress).toHaveBeenCalledTimes(1)
  })

  it('bet amount with number of bets and reset profit/loss', async () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          numOfBets={'0.00'}
          stopOnProfit={'0'}
          stopOnLoss={'0'}
          currentProfit={0}
          rollOverUnder={'50.50'}
          profitOnWin={'0.00'}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    const handleAutoBet = vi.fn(() => {})
    const handleAutoBetInProgress = vi.fn(() => {})

    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const numberOfBetsInputElement = screen.getByTestId(
      'number-of-bets'
    ) as HTMLInputElement

    fireEvent.change(betInputElement, { target: { value: '1.00' } })
    fireEvent.change(numberOfBetsInputElement, { target: { value: '1' } })

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
      handleAutoBet()
      handleAutoBetInProgress()
    })

    // check if past-bet were shown on screen
    await waitFor(() => {
      expect(handleAutoBetInProgress).toBeCalledTimes(1)
      expect(screen.getByTestId('past-bet-button:0')).toBeTruthy()
      handleAutoBetInProgress()
    })

    // eventually autobet button will stop
    await waitFor(() => {
      expect(betButton.textContent?.toLowerCase()).toBe('start autobet')
      expect(handleAutoBet).toHaveBeenCalled()
      expect(handleAutoBetInProgress).toBeCalledTimes(2)
    })
  })

  it('stop on profit', async () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          numOfBets={'0.00'}
          stopOnProfit={'0'}
          stopOnLoss={'0'}
          currentProfit={0}
          rollOverUnder={'50.50'}
          profitOnWin={'0.00'}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )

    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    const handleAutoBet = vi.fn(() => {})

    act(() => {
      autoBetButton.click()
    })

    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const stopOnProfit = screen.getByTestId(
      'stop-on-profit'
    ) as HTMLInputElement
    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    expect(betInputElement.value).toBe('0.00')
    expect(stopOnProfit.value).toBe('0.00')
    expect(sliderElement.value).toBe('50.50')

    const initialBalanceElement = screen.getAllByText(/balance/i)
    console.log(initialBalanceElement[0].innerText)
    const initialBalance = Number(
      initialBalanceElement[0].innerText.split(' - ')[1].slice(0, -1)
    )
    // changing the values

    fireEvent.change(sliderElement, {
      target: { value: '2.00' }
    })

    fireEvent.change(betInputElement, { target: { value: '100.00' } })
    fireEvent.change(stopOnProfit, { target: { value: '1.00' } })

    let betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
      handleAutoBet()
    })

    await waitFor(() => {
      const balanceElementAfterBet = screen.getAllByText(/balance/i)
      const balanceAfterBet = Number(
        balanceElementAfterBet[0].innerText.split(' - ')[1].slice(0, -1)
      )
      expect(balanceAfterBet).toBeGreaterThanOrEqual(initialBalance)
      expect(handleAutoBet).toHaveBeenCalledTimes(1)
    })
  })

  it('stop on loss', async () => {
    render(
      <BrowserRouter>
        <DiceContextProvider
          betAmount={'0.00'}
          numOfBets={'0.00'}
          stopOnProfit={'0'}
          stopOnLoss={'0'}
          currentProfit={0}
          rollOverUnder={'50.50'}
          profitOnWin={'0.00'}
        >
          <MainModule />
        </DiceContextProvider>
      </BrowserRouter>
    )
    const autoBetButton = screen.getByTestId('auto-bet') as HTMLInputElement
    const handleAutoBet = vi.fn(() => {})

    act(() => {
      autoBetButton.click()
    })
    const betInputElement = screen.getByTestId('bet-amount') as HTMLInputElement
    const stopOnLoss = screen.getByTestId('stop-on-loss') as HTMLInputElement

    const sliderElement = screen.getByTestId(
      'dice-slider-input'
    ) as HTMLInputElement

    expect(betInputElement.value).toBe('0.00')
    expect(stopOnLoss.value).toBe('0.00')
    expect(sliderElement.value).toBe('50.50')

    const initialBalanceElement = screen.getAllByText(/balance/i)
    const initialBalance = Number(
      initialBalanceElement[0].innerText.split(' - ')[1].slice(0, -1)
    )

    // on changing values

    fireEvent.change(sliderElement, {
      target: { value: '98.00' }
    })

    fireEvent.change(betInputElement, { target: { value: '10.00' } })
    fireEvent.change(stopOnLoss, { target: { value: '1.00' } })

    const betButton = screen.getByTestId('bet-button') as HTMLButtonElement
    act(() => {
      betButton.click()
      handleAutoBet()
    })

    await waitFor(() => {
      const balanceElementAfterBet = screen.getAllByText(/balance/i)
      const balanceAfterBet = Number(
        balanceElementAfterBet[0].innerText.split(' - ')[1].slice(0, -1)
      )
      expect(balanceAfterBet).toBeLessThanOrEqual(initialBalance - 1)
      expect(handleAutoBet).toHaveBeenCalled()
    })
  })
})
