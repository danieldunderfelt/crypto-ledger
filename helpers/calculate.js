import roundToDecimals from './roundToDecimals'

export function calculateFees(paid, received, exchangeRate = ( paid / received)) {
  const calcReceived = paid / exchangeRate
  const difference = calcReceived - received
  
  const fee = difference * exchangeRate
  return roundToDecimals(fee, 2)
}

export function calculateExchangeRate(paid, received, fees = 0) {
  const numberPaid = paid && !isNaN(parseFloat(paid)) ? paid : 1
  const numberReceived = received && !isNaN(parseFloat(received)) ? received : 1
  const numberFees = fees && !isNaN(parseFloat(fees)) ? fees : 0
  
  const feesExcluded = numberPaid - numberFees
  
  const exchangeRate = numberReceived > 0 ? feesExcluded / numberReceived : 0
  return roundToDecimals(exchangeRate, 6)
}