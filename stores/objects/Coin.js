import { extendObservable, observable } from 'mobx'
import roundToDecimals                  from '../../helpers/roundToDecimals'
import CurrencyActions                  from '../../actions/CurrencyActions'

export default (data, state) => {
  const currencyActions = CurrencyActions(state)
  
  const coin = extendObservable(observable({
    symbol: '',
    name: '',
    get type() {
      return currencyActions.getCurrencyType(this.symbol)
    },
    // Total amount of currentHoldings currently in users possession
    get positionAmount() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyPaid === coin.symbol ) {
          return value - tx.amountPaid
        } else if( tx.currencyReceived === coin.symbol ) {
          return value + tx.amountReceived
        }
        
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    // How much USD the user has invested into this coin
    get totalInvestment() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.symbol ) return value + tx.paidAmount
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    get acquisitionFees() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.symbol ) return value + tx.transactionFees
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