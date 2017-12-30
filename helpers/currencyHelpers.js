import get from 'lodash/get'
import axios from 'axios'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'

const ratesCache = {}

async function getOxrRates(endpoint) {
  const oxrReq = await axios.get(`https://openexchangerates.org/api/${ endpoint }.json?`, {
    params: { app_id: 'a92579c0d07a4a9c845d5c20b35cf102' }
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

export function exists(symbol, collection = []) {
  return collection.findIndex(c => c.symbol === symbol) > -1
}