import React              from 'react'
import { StackNavigator } from 'react-navigation'
import { View }           from 'react-native'
import TransactionActions from '../components/TransactionActions'
import MainTabNavigator   from './MainTabNavigator'

const RootStackNavigator = StackNavigator({
  Main: {
    screen: MainTabNavigator
  }
}, {
  headerMode: 'none'
})

class RootNavigator extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RootStackNavigator />
        <TransactionActions />
      </View>
    )
  }
}

export default RootNavigator