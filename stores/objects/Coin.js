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
    get value() {
      return state.transactions.reduce((value, tx, idx) => {
        if( tx.currencyPaid === coin.ticker ) {
          return roundToDecimals(value - tx.amountPaid)
        } else if( tx.currencyReceived === coin.ticker ) {
          return roundToDecimals(value + tx.amountReceived)
        }
        
        return value
      }, 0)
    }
  }), data)
  
  return coin
}

export default Coin