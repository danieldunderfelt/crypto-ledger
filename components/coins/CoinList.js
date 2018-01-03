import { app }              from 'mobx-app'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import { FlatList }         from 'react-native'
import CoinListItem         from './CoinListItem'
import styled               from 'styled-components/native'
import { computed, action }         from 'mobx'

const CoinListing = styled(FlatList)`
  flex: 1;
`

@inject(app('Transactions'))
@observer
class CoinList extends Component {
  
  @computed get loading() {
    const { currentHoldings } = this.props.state
    return !currentHoldings.every(c => c._loading === false)
  }
  
  _keyExtractor = (item, idx) => `coin-item_${ idx }_${ item.name }`
  
  renderItem = ({ item, index }) => {
    return <CoinListItem
      coin={ item }
      key={ this._keyExtractor(item, index) } />
  }
  
  @action refreshItems = () => {
    const { currentHoldings } = this.props.state
    currentHoldings.forEach(coin => {
      coin._loading = true
      coin._resetCache()
    })
  }

  render() {
    const { state } = this.props
    
    return (
      <CoinListing
        refreshing={ this.loading }
        onRefresh={ this.refreshItems }
        data={ state.currentHoldings }
        renderItem={ this.renderItem }
        keyExtractor={ this._keyExtractor }/>
    )
  }
}

export default CoinList
