import React, { Component } from 'react'
import { observer } from 'mobx-react/native'
import styled from 'styled-components/native'

const TransactionDetailText = styled.Text`
  
`

const ListItem = styled.View`
  justify-content: space-around;
  flex-direction: row;
  padding-horizontal: 20;
  padding-vertical: 10;
  border-bottom-width: 1;
  border-bottom-color: lightblue;
`

@observer
class TransactionListItem extends Component {

  render() {
    const { transaction } = this.props

    return (
      <ListItem>
        <TransactionDetailText>
          Paid: {transaction.amountPaid} {transaction.currencyPaid}
        </TransactionDetailText>
        <TransactionDetailText>
          Received: {transaction.amountReceived} {transaction.currencyReceived}
        </TransactionDetailText>
      </ListItem>
    )
  }
}

export default TransactionListItem
