import { observe, observable, extendObservable, action } from 'mobx'
import { collection }                                    from 'mobx-app'
import Transaction                                       from './objects/Transaction'
import Storage                                           from '../helpers/storage'
import { getCurrencyType, getNameForTicker }                               from '../currencies'
import Coin from './objects/Coin'

export default (state, initialState) => {
  extendObservable(state, {
    transactions: [],
    get coins() {
      const { transactions } = state
      return transactions.reduce((coins, tx) => {
        // Skip it if this already exists in the new array
        if(coins.find(c => c.ticker === tx.currencyReceived || c.ticker === tx.currencyPaid)) {
          return coins
        }
        
        // Is the receiving side a crypto?
        if(getCurrencyType(tx.currencyReceived) === 'crypto') {
          coins.push(Coin({
            ticker: tx.currencyReceived,
            name: getNameForTicker(tx.currencyReceived)
          }, state))
        }
  
        // Is the paying side a crypto?
        if( getCurrencyType(tx.currencyPaid) === 'crypto' ) {
          coins.push(Coin({
            ticker: tx.currencyPaid,
            name: getNameForTicker(tx.currencyPaid)
          }, state))
        }
        
        return coins
      }, [])
    }
  })

  const transactionCollection = collection(state.transactions, Transaction)
  transactionCollection.addItems(initialState.transactions, false)

  /*const storage = Storage('ledger_transactions')
  observe(state, 'transactions', storage.observeListener, true)*/

  return {
    ...transactionCollection
  }
}