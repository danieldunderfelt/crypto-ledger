import { collection } from 'mobx-app'
import axios from 'axios'
import get from 'lodash/get'
import map from 'lodash/map'
import normalize from '../helpers/normalizeData'
import CurrencyActions from './CurrencyActions'

const endpoints = {
  coinList: 'https://min-api.cryptocompare.com/data/all/coinlist',
  coinPrice: 'https://min-api.cryptocompare.com/data/pricemultifull'
}

export default state => {
  
  const currencyActions = CurrencyActions(state)
  
  async function loadCryptocurrencies() {
    const coinListRequest = await axios.get(endpoints.coinList)
    const coinListData = get(coinListRequest, 'data.Data', {})
    
    const normalizer = normalize('cryptocompare_coinlist')
    const normalized = map(coinListData, normalizer)
    
    currencyActions.cryptoCollection.addItems(normalized, 'symbol')
  }
  
  async function getPrice(symbol, priceIn = 'USD') {
    
    const priceRequest = await axios.get(endpoints.coinPrice, {
      params: {
        fsyms: symbol,
        tsyms: priceIn
      }
    })
    
    const normalizer = normalize('cryptocompare_pricemultifull')
    return normalizer(get(priceRequest, `data.RAW.${ symbol }.${ priceIn }`))
  }
  
  return {
    loadCryptocurrencies,
    getPrice
  }
}