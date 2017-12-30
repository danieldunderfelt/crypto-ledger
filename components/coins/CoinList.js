import { app } from 'mobx-app'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import { FlatList } from 'react-native'
import CoinListItem from './CoinListItem'
import styled from 'styled-components/native'

const CoinListing = styled(FlatList)`
  flex: 1;
`

@inject(app('Transactions'))
@observer
class CoinList extends Component {
  _keyExtractor = (item, idx) => `coin-item_${ idx }_${ item.name }`

  renderItem = ({ item, index }) => {
    return <CoinListItem
      coin={ item }
      key={ this._keyExtractor(item, index) } />
  }

  render() {
    const { state } = this.props
    
    return (
      <CoinListing
        data={ state.currentHoldings }
        renderItem={ this.renderItem }
        keyExtractor={ this._keyExtractor }/>
    )
  }
}

export default CoinList
