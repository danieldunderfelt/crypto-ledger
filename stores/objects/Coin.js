import { extendObservable, observable, action, runInAction, reaction } from 'mobx'
import roundToDecimals                                                 from '../../helpers/roundToDecimals'
import CurrencyActions                                                 from '../../actions/CurrencyActions'
import NetworkActions                                                  from '../../actions/NetworkActions'
import isAfter                                                         from 'date-fns/is_after'
import subSeconds                                                      from 'date-fns/sub_seconds'
import get                                                             from 'lodash/get'

export default (data, state) => {
  const currencyActions = CurrencyActions(state)
  const network = NetworkActions(state)
  
  const coin = extendObservable(observable({
    symbol: '',
    name: '',
    logo: '',
    marketCapSort: 0,
    set marketCapSort(val) {
      this.marketCapSort = parseInt(val)
    },
    _loading: false,
    _cache: {
      priceData: {
        params: '',
        value: null
      }
    },
    _resetCache: action(() => Object.keys(coin._cache).forEach(cacheKey => {
      extendObservable(coin._cache[ cacheKey ], {
        params: '',
        value: null
      })
    })),
    get type() {
      return currencyActions.getCurrencyType(this.symbol)
    },
    // Total amount of currentHoldings currently in users possession
    get positionAmount() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyPaid === coin.symbol ) {
          return value - tx.amountPaid
        } else if( tx.currencyReceived === coin.symbol ) {
          return value + tx.amountReceived
        }
        
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    // How much USD the user has invested into this coin
    get totalInvestment() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.symbol ) return value + tx.paidAmount
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    get acquisitionFees() {
      const val = state.transactions.reduce((value, tx) => {
        if( tx.currencyReceived === coin.symbol ) return value + tx.transactionFees
        return value
      }, 0)
      
      return roundToDecimals(val)
    },
    get _priceData() {
      const { symbol, _cache: { priceData: { params, value, updated = null } } } = coin
      const { defaultFiat = 'USD' } = state
      const updatedAt = !updated ? new Date() : updated
      
      // Update if cache is old or defaultFiat is changed
      if( !value || isAfter(subSeconds(new Date(), 10), updatedAt) || params !== defaultFiat ) {
        
        network
          .getPrice(symbol, defaultFiat)
          .then(action(val => {
            // If we got data, update the cache.
            if( Object.keys(val).length > 0 ) {
              // Extend the cache object with new data.
              extendObservable(coin._cache.priceData, {
                value: val,
                params: defaultFiat,
                updated: new Date()
              })
            }
            
            // Loading complete.
            coin._loading = false
          }))
      }
      
      return value ? value : {}
    },
    get marketValue() {
      const { price = '' } = coin._priceData
      return price
    },
    get positionValue() {
      const { positionAmount, marketValue } = coin
      return roundToDecimals(positionAmount * marketValue)
    },
    get change24hr() {
      const { change24hr = '' } = coin._priceData
      return change24hr
    }
  }), data)
  
  return coin
}