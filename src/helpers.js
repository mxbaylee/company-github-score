const MONTHS_PER_YEAR = 12

export const isWithinLastXMonths = (inputString, lastMonths) => {
  const input = new Date(inputString)
  const today = new Date()

  const todayTotalMonths = (input.getFullYear() * MONTHS_PER_YEAR) + input.getMonth()
  const inputTotalMonths = (today.getFullYear() * MONTHS_PER_YEAR) + today.getMonth()

  return Math.abs(todayTotalMonths - inputTotalMonths) <= lastMonths
}
