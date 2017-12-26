import { extendObservable, observable } from 'mobx'
import { getCurrencyType }              from '../../currencies'
import roundToDecimals from '../../helpers/roundToDecimals'

const Coin = (data, state) => {
  const coin = extendObservable(observable({
    name: '',
    ticker: '',
    get type() {
      return getCurrencyType(coin.ticker)
    },
    // Total amount of coins currently in users possession
    get positionAmount() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyPaid === coin.ticker ) {
          return value - tx.amountPaid
        } else if( tx.currencyReceived === coin.ticker ) {
          return value + tx.amountReceived
        }
        
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    // How much USD the user has invested into this coin
    get totalInvestment() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.ticker ) return value + tx.paidAmount
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    get acquisitionFees() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.ticker ) return value + tx.transactionFees
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    get positionValue() {
      return 0
    },
    get marketValue() {
      return 0
    },
    get positionChange() {
      return 0
    },
  }), data)
  
  return coin
}

export default Coin