import get from 'lodash/get'
import axios from 'axios'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'

const currencies = {
  fiat: {
    USD: {
      name: 'US Dollar'
    },
    EUR: {
      name: 'Euro'
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

const ratesCache = {}

async function getOxrRates(endpoint) {
  const oxrReq = await axios.get(`https://openexchangerates.org/api/${ endpoint }.json?`, {
    params: {
      app_id: 'a92579c0d07a4a9c845d5c20b35cf102'
    }
  })
  
  return get(oxrReq, 'data.rates', {})
}

export async function convertFiat(value, from = 'EUR', to = 'USD', date = false) {
  if(from === to) return value
  
  const dateStr = date && !isSameDay(date, new Date()) ? format(date, 'YYYY-MM-DD') : 'latest'
  
  if(Object.keys(get(ratesCache, dateStr, {})).length === 0) {
    const endpoint = dateStr !== 'latest' ? `historical/${ dateStr }` : 'latest'
    ratesCache[ dateStr ] = await getOxrRates(endpoint)
  }
  
  const fromRate = get(ratesCache, `${ dateStr }.${ from }`, 0)
  const toRate = get(ratesCache, `${ dateStr }.${ to }`, 0)
  const usdValue = value * fromRate
  
  return to === 'USD' ? usdValue : usdValue * toRate
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