import { extendObservable, observable } from 'mobx'

const Transaction = data => {

  return extendObservable(observable({
    transactionTime: new Date(),
    addedTime: new Date(),
    amountPaid: 0,
    currencyPaid: 'USD',
    amountReceived: 0,
    currencyReceived: 'BTC',
    exchangeRate: 1,
    exchangeDirection: 'received/paid', // Which direction the exchange rate is calculated in
    exchange: 'Coinbase',
    fees: false, // Manually added fees

    // How much one currencyPaid was worth in fiat at tx time
    get currencyPaidFiatValue() {
      return 0
    },

    // How much one currencyReceived was worth in fiat at tx time
    get currencyReceivedFiatValue() {
      return 0
    },

    // How much the amount of currencyPaid was worth in fiat at tx time
    get fiatAmountPaid() {
      return 0
    },

    // How much the amount of currencyReceived was worth in fiat at tx time
    get fiatAmountReceived() {
      return 0
    },

    // Difference between paid and received amount is the tx fee
    get transactionFees() {
      return 0
    }
  }), data)
}

export default Transaction