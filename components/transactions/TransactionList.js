import { app } from 'mobx-app'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import { FlatList } from 'react-native'
import { computed } from 'mobx'
import TransactionListItem from './TransactionListItem'
import styled from 'styled-components/native'

const TxList = styled(FlatList)`
  flex: 1;
`

@inject(app('Currencies'))
@observer
class TransactionList extends Component {

  @computed get transactionData() {
    const { state } = this.props
    return state.transactions.slice()
  }

  _keyExtractor = (item, idx) => `tx-item_${ idx }_${ item.transactionTime.valueOf() }`

  onItemPress = transaction => {
    console.log(transaction)
  }

  renderItem = ({ item, index }) => {
    return <TransactionListItem
      transaction={ item }
      key={ this._keyExtractor(item, index) } />
  }

  render() {

    return (
      <TxList
        data={ this.transactionData }
        renderItem={ this.renderItem }
        keyExtractor={ this._keyExtractor }/>
    )
  }
}

export default TransactionList
