// returns a factorial of a number
export function factorial(number: number): number {
  if (number < 0) {
    console.log('Error! Factorial for negative number does not exist.')
    return 1
  }
  // if number is 0
  else if (number === 0) {
    // console.log(`The factorial of ${number} is 1.`);
    return 1
  }
  // if number is positive
  else {
    let fact = 1
    for (let i = 1; i <= number; i++) {
      fact *= i
    }
    // console.log(`The factorial of ${number} is ${fact}.`);
    return fact
  }
}

// returns a combination of mines and diamonds
export function test1(n: number, r: number) {
  if (n - r > 0) {
    return factorial(n) / factorial(r) / factorial(n - r)
  } else {
    return factorial(n) / factorial(r)
  }
}

// returns round of a deicmal number upto 2 deicmal
export function round(value: number) {
  value = value * 1000
  const lastDigit = String(value).substr(-1)
  return parseInt(lastDigit) === 5
    ? (Math.floor(value / 10) / 100).toFixed(2)
    : (value / 1000).toFixed(2)
}

export async function generateNextTileProfit(
  mines: number,
  diamonds: number
): Promise<any> {
  diamonds = diamonds < 1 ? 1 : diamonds
  const totalGems = 25
  const totalProfit =
    (1 - 0.01) *
    (test1(totalGems, diamonds) / test1(totalGems - mines, diamonds))
  const nextProfit =
    1 +
    ((1 - 0.01) *
      (test1(totalGems, diamonds + 1) /
        test1(totalGems - mines, diamonds + 1)) -
      totalProfit)
  // console.log("🚀 ~ file: server.js ~ line 85 ~ test", round(totalProfit.toFixed(3)), round(nextProfit.toFixed(3)))
  return { totalProfit: totalProfit, nextProfit: nextProfit }
}
