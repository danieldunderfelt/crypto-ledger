import React                    from 'react'
import { StackNavigator }       from 'react-navigation'
import TransactionTabsNavigator from './TransactionTabsNavigator'

const RootStackNavigator = StackNavigator({
  Main: {
    screen: TransactionTabsNavigator
  }
}, {
  headerMode: 'none'
})

class RootNavigator extends React.Component {

  render() {
    return (
      <RootStackNavigator />
    )
  }
}

export default RootNavigator