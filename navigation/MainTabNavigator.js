import React                          from 'react'
import { Platform }                   from 'react-native'
import { TabNavigator, TabBarBottom } from 'react-navigation'
import { Ionicons }                   from '@expo/vector-icons'
import Colors                         from '../constants/Colors'
import TransactionsScreen             from '../screens/Transactions'
import CoinsScreen                    from '../screens/Coins'

export default TabNavigator({
    Coins: {
      screen: CoinsScreen
    },
    Transactions: {
      screen: TransactionsScreen
    }
  }, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        let iconName
        
        switch( routeName ) {
          case 'Transactions':
            iconName =
              Platform.OS === 'ios'
                ? `ios-list${focused ? '' : '-outline'}`
                : 'md-list'
            break
          case 'Coins':
            iconName = Platform.OS === 'ios' ? `ios-cash${focused ? '' : '-outline'}` : 'md-cash'
            break
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true
  }
)
