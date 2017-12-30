import { observe, observable, extendObservable, action } from 'mobx'
import { collection }                                    from 'mobx-app'
import Coin                                              from './objects/Coin'
import CurrencyActions                                   from '../actions/CurrencyActions'

export default (state, initialState) => {
  
  extendObservable(state, {
    crypto: [],
    fiat: initialState.fiat,
    
    get currentHoldings() {
      const { transactions, crypto } = state
      const holdings = currencyActions.getCoinsFromTransactions(transactions)
      return crypto.filter(coin => holdings.indexOf(coin.symbol) > -1)
    }
  })
  
  const currencyActions = CurrencyActions(state)
  
  const cryptoActions = collection(state.crypto, coinData => Coin(coinData, state))
  cryptoActions.addItems(initialState.crypto)
  
  return {
    ...cryptoActions,
    ...currencyActions
  }
}