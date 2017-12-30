import { extendObservable, observable, action } from 'mobx'
import { calculateFees, calculateExchangeRate } from '../../helpers/calculate'
import { convertFiat }                          from '../../helpers/currencyHelpers'
import get                                      from 'lodash/get'
import getFloat                                 from '../../helpers/getFloat'
import CurrencyActions                          from '../../actions/CurrencyActions'

export default (data, state) => {
  let prevDefaultFiat = state.preferences.defaultFiat
  
  const currencyActions = CurrencyActions(state)
  
  const transaction = extendObservable(observable({
    transactionTime: get(data, 'transactionTime', new Date()),
    addedTime: new Date(),
    amountPaid: getFloat(data, 'amountPaid', ''),
    currencyPaid: get(data, 'currencyPaid', state.preferences.defaultFiat),
    amountReceived: getFloat(data, 'amountReceived', ''),
    currencyReceived: get(data, 'currencyReceived', 'BTC'),
    exchangeRate: getFloat(data, 'exchangeRate', null),
    exchangeDirection: get(data, 'exchangeDirection', 'paid/received'), // Which direction the exchange rate is
                                                                        // calculated in
    exchange: get(data, 'exchange', ''),
    fees: getFloat(data, 'fees', null),
    _baseFiatPaid: null,
    get paidAmount() {
      const { defaultFiat } = state.preferences
      const { _baseFiatPaid, currencyPaid, amountPaid, transactionTime } = transaction
      
      if( currencyPaid === defaultFiat ) return amountPaid
      
      // React correctly to defaultFiat preference changes
      let baseFiatPaid = _baseFiatPaid
      
      if( defaultFiat !== prevDefaultFiat ) {
        baseFiatPaid = null
        prevDefaultFiat = defaultFiat
      }
      
      if( currencyActions.isFiat(currencyPaid) && baseFiatPaid === null ) {
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
    
    get txExchangeRate() {
      const { fees, exchangeRate, amountPaid, amountReceived } = transaction
      if( exchangeRate ) return exchangeRate
      
      return calculateExchangeRate(amountPaid, amountReceived, fees)
    },
    
    // Difference between paid and received amount is the tx fee,
    // if the fee is not manually set.
    get transactionFees() {
      const { fees, txExchangeRate, amountPaid, amountReceived } = transaction
      if( fees ) return fees
      
      return calculateFees(amountPaid, amountReceived, txExchangeRate)
    }
  }))
  
  return transaction
}