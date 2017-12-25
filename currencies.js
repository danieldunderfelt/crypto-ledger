import get from 'lodash/get'

const currencies = {
  fiat: {
    EUR: {
      name: 'Euro'
    },
    USD: {
      name: 'US Dollar'
    }
  },
  crypto: {
    BTC: {
      name: 'Bitcoin'
    },
    ETH: {
      name: 'Ethereum'
    },
    LTC: {
      name: 'Litecoin'
    }
  }
}

export function exists(name, collection = []) {
  return !!collection.find(c => c === name)
}

export function isFiat(name) {
  return exists(name, Object.keys(currencies.fiat))
}

export function isCrypto(name) {
  return exists(name, Object.keys(currencies.crypto))
}

export function getCurrencyType(name) {
  if(isFiat(name)) {
    return 'fiat'
  } else if(isCrypto(name)) {
    return 'crypto'
  }
  
  return ''
}

export function getNameForTicker(ticker) {
  const type = getCurrencyType(ticker)
  if(!type) return ''
  
  return get(currencies, `${ type }.${ ticker }.name`, '')
}

export default currencies