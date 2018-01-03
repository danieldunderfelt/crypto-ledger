import { extendObservable, action, observe } from 'mobx'
import { collection }                                    from 'mobx-app'
import Transaction                                       from './objects/Transaction'
import Storage                                           from '../helpers/storage'

export default (state, initialState) => {
  extendObservable(state, {
    transactions: []
  })
  
  const transactionCollection = collection(state.transactions, data => Transaction(data, state))
  transactionCollection.addItems(initialState.transactions, false)
  
  
  /*const storage = Storage('ledger_transactions')
  observe(state, 'transactions', storage.observeListener, true)*/
  
  return {
    ...transactionCollection
  }
}