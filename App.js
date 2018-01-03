import { AppLoading, Asset, Font } from 'expo'
import { toJS, observe } from 'mobx'
import React from 'react'
import { StyleSheet, View, Platform, StatusBar, Dimensions } from 'react-native'
import { Provider, observer } from 'mobx-react/native'
import stores from './stores'
import { Ionicons } from '@expo/vector-icons'
import { createStore } from 'mobx-app'
import { observable, action } from 'mobx'
import RootNavigation from './navigation/RootNavigation'
import NetworkActions from './actions/NetworkActions'

console.ignoredYellowBox = [ 'Warning: Can only update a mounted or mounting component' ];

let prevState = {
  preferences: {
    defaultFiat: 'EUR'
  },
  fiat: [{
    name: 'Euro',
    symbol: 'EUR'
  }, {
    name: 'US Dollar',
    symbol: 'USD'
  }],
  crypto: []
}

@observer
class App extends React.Component {

  store = {
    state: {},
    actions: {}
  }

  @observable isLoadingComplete = false

  componentWillMount() {
    const { actions, state } = createStore(stores, prevState)
    prevState = toJS(state)
    
    this.store = { actions, state }
  }

  render() {
    if( !this.isLoadingComplete && !this.props.skipLoadingScreen ) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <Provider state={this.store.state} actions={this.store.actions}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' && <View style={ styles.statusBarUnderlay } />}
            <RootNavigation />
          </View>
        </Provider>
      )
    }
  }

  _loadResourcesAsync = async () => {
    const network = NetworkActions(this.store.state)
    return Promise.all([
      network.loadCryptocurrencies(),
      Font.loadAsync({
        ...Ionicons.font,
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
      })
    ])
  }

  @action _handleFinishLoading = () => {
    this.isLoadingComplete = true
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
})