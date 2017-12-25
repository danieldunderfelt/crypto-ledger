
export default storageKey => {

  function getKey(key) {
    return `${ storageKey }:${ key }`
  }

  function observeListener(change) {
    const { type, object, name, newValue, oldValue } = change
    console.log(type, name, newValue)
  }

  return {
    observeListener
  }
}