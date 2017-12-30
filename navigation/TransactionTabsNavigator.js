import React, { Component }           from 'react'
import { Platform, View, Modal }      from 'react-native'
import { observable, action }         from 'mobx'
import { observer }                   from 'mobx-react/native'
import { TabNavigator, TabBarBottom } from 'react-navigation'
import { Ionicons }                   from '@expo/vector-icons'
import { Icon, Fab }                  from 'native-base'
import AddTransaction                 from '../components/transactions/AddTransaction'
import Colors                         from '../constants/Colors'
import TransactionsScreen             from '../screens/Transactions'
import CoinsScreen                    from '../screens/Coins'

const TransactionTabsNav = TabNavigator({
    Currencies: {
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
          case 'Currencies':
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

@observer
class TransactionTabsNavigator extends Component {
  
  @observable addTxOpen = false
  
  @action toggleOpen = (setTo = !this.addTxOpen) => {
    this.addTxOpen = setTo
  }
  
  render() {
    
    return (
      <View style={{ flex: 1 }}>
        <TransactionTabsNav />
        <Modal
          transparent={ true }
          animationType="slide"
          onRequestClose={ () => this.toggleOpen(false) }
          visible={ this.addTxOpen }>
          <AddTransaction onClose={ () => this.toggleOpen(false) }/>
        </Modal>
        <Fab
          direction="up"
          style={{ bottom: 50, backgroundColor: '#5067FF' }}
          onPress={ this.toggleOpen }
          position="bottomRight">
          <Icon name="add" />
        </Fab>
      </View>
    )
  }
}

export default TransactionTabsNavigator
