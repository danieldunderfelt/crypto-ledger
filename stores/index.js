import TransactionStore from './TransactionStore'
import PreferencesStore from './PreferencesStore'
import CurrencyStore    from './CurrencyStore'

const stores = {
  Preferences: PreferencesStore,
  Transactions: TransactionStore,
  Currencies: CurrencyStore
}

export default stores