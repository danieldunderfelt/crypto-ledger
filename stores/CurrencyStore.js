import { observe, observable, extendObservable, action } from 'mobx'
import CurrencyActions                                   from '../actions/CurrencyActions'

export default (state, initialState) => {
  
  extendObservable(state, {
    crypto: [],
    fiat: initialState.fiat,
    get sortedCrypto() {
      return state.crypto.sort((a, b) => a.marketCapSort > b.marketCapSort ? 1 : -1)
    },
    get currentHoldings() {
      const { transactions, crypto } = state
      const holdings = currencyActions.getCoinsFromTransactions(transactions)
      return crypto.filter(coin => holdings.indexOf(coin.symbol) > -1)
    }
  })
  
  const currencyActions = CurrencyActions(state)
  currencyActions.cryptoCollection.addItems(initialState.crypto)
  
  return {
    ...currencyActions
  }
}