import roundToDecimals from './roundToDecimals'

export function calculateFees(paid, received, exchangeRate = ( paid / received)) {
  const calcReceived = paid / exchangeRate
  const difference = calcReceived - received
  
  const fee = difference * exchangeRate
  return roundToDecimals(fee, 2)
}

export function calculateExchangeRate(paid, received, fees = 0) {
  const numberPaid = paid ? paid : 1
  const numberReceived = received ? received : 1
  
  const feesExcluded = numberPaid - fees
  
  const exchangeRate = feesExcluded / numberReceived
  return roundToDecimals(exchangeRate, 6)
}