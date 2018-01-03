import { exists }     from '../helpers/currencyHelpers'
import { collection } from 'mobx-app'
import Coin           from '../stores/objects/Coin'

export default state => {
  
  function isFiat(symbol) {
    return exists(symbol, state.fiat)
  }
  
  function isCrypto(symbol) {
    return exists(symbol, state.crypto)
  }
  
  function getCurrencyType(symbol) {
    if( isFiat(symbol) ) {
      return 'fiat'
    } else if( isCrypto(symbol) ) {
      return 'crypto'
    }
    
    return ''
  }
  
  function getNameForSymbol(symbol) {
    const type = getCurrencyType(symbol)
    if( !type ) return ''
    
    const currency = state[ type ].find(cur => cur.symbol === symbol)
    return currency ? currency.name : ''
  }
  
  function getCoinsFromTransactions(transactions) {
    
    return transactions.reduce((coins, tx) => {
      // Skip it if this already exists in the new array
      if( coins.find(c => c === tx.currencyReceived || c === tx.currencyPaid) ) {
        return coins
      }
    
      // Is the receiving side a crypto?
      if( getCurrencyType(tx.currencyReceived) === 'crypto' ) {
        coins.push(tx.currencyReceived)
      }
    
      // Is the paying side a crypto?
      if( getCurrencyType(tx.currencyPaid) === 'crypto' ) {
        coins.push(tx.currencyPaid)
      }
    
      return coins
    }, [])
  }
  
  const cryptoActions = collection(state.crypto, coinData => Coin(coinData, state))
  
  return {
    cryptoCollection: cryptoActions,
    isFiat,
    isCrypto,
    getCurrencyType,
    getNameForSymbol,
    getCoinsFromTransactions
  }
}