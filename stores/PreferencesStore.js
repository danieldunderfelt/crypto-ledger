import { extendObservable, action } from 'mobx'
import get from 'lodash/get'

export default (state, initialData) => {
  
  extendObservable(state, {
    preferences: {
      defaultFiat: 'USD'
    }
  })
  
  const setOption = action((key, value) => {
    state.preferences[ key ] = value
  })
  
  setOption('defaultFiat', get(initialData, 'preferences.defaultFiat', 'USD'))
  
  return {
    setOption
  }
}