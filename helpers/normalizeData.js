import get    from 'lodash/get'
import reduce from 'lodash/reduce'

const apiSchema = {
  cryptocompare_coinlist: {
    schema: {
      'Symbol': 'symbol',
      'CoinName': 'name',
      'ImageUrl': 'logo',
      'SortOrder': 'marketCapSort'
    },
    process: {
      'ImageUrl': value => 'https://www.cryptocompare.com' + value,
      'SortOrder': value => parseInt(value)
    }
  },
  cryptocompare_pricemultifull: {
    schema: {
      'PRICE': 'price',
      'CHANGE24HOUR': 'priceChange24hr',
      'CHANGEPCT24HOUR': 'change24hr',
      'MKTCAP': 'marketCap'
    }
  }
}

const normalize = (schemaName = 'cryptocompare') => data => {
  const schema = get(apiSchema, `${ schemaName }.schema`, false)
  const process = get(apiSchema, `${ schemaName }.process`, {})
  
  if( !schema ) return data
  
  return reduce(data, (normalized, value, foreignKey) => {
    const key = get(schema, foreignKey, false)
    
    if( !key ) return normalized
    
    const processValue = get(process, foreignKey, val => val)
    normalized[ key ] = processValue(value)
    
    return normalized
  }, {})
}

export default normalize