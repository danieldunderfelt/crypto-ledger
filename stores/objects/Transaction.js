import { extendObservable, observable, action } from 'mobx'
import { isFiat, convertFiat }          from '../../currencies'

const Transaction = (data, state) => {
  let prevDefaultFiat = state.preferences.defaultFiat
  
  const transaction = extendObservable(observable({
    transactionTime: new Date(),
    addedTime: new Date(),
    amountPaid: '',
    currencyPaid: state.preferences.defaultFiat,
    amountReceived: '',
    currencyReceived: 'BTC',
    exchangeRate: 1,
    exchangeDirection: 'received/paid', // Which direction the exchange rate is calculated in
    exchange: '',
    fees: false, // Manually added fees
    _baseFiatPaid: null,
    get paidAmount() {
      const { defaultFiat } = state.preferences
      const { _baseFiatPaid, currencyPaid, amountPaid, transactionTime } = transaction
      
      if(currencyPaid === defaultFiat) return amountPaid
      
      // React correctly to defaultFiat preference changes
      let baseFiatPaid = _baseFiatPaid
      
      if(defaultFiat !== prevDefaultFiat) {
        baseFiatPaid = null
        prevDefaultFiat = defaultFiat
      }
      
      if( isFiat(currencyPaid) && baseFiatPaid === null ) {
        convertFiat(amountPaid, currencyPaid, defaultFiat, transactionTime)
          .then(action(value => transaction._baseFiatPaid = value))
      }
      
      return baseFiatPaid
    },
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
  
  return transaction
}

export default Transaction