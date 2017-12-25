import { app } from 'mobx-app'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react/native'
import styled from 'styled-components/native'
import { Fab, Button, Icon } from 'native-base'
import { observable, action } from 'mobx'
import faker from 'faker'

const testTransaction = () => ({
  amountPaid: parseFloat(faker.finance.amount()),
  currencyPaid: 'USD',
  amountReceived: parseFloat(faker.finance.amount()),
  currencyReceived: 'BTC',
})

@inject(app('Transactions'))
@observer
class TransactionActions extends Component {
  @observable navActive = false

  @action toggleActive = (setTo = !this.navActive) => {
    this.navActive = setTo
  }

  render() {
    const { Transactions } = this.props

    return (
      <Fab
        active={ true }
        direction="up"
        style={{
          bottom: 50,
          backgroundColor: '#5067FF'
        }}
        onPress={ () => Transactions.addItem(testTransaction()) }
        position="bottomRight">
        <Icon name="add" />
      </Fab>
    )
  }
}

export default TransactionActions
