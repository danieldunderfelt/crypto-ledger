import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import styled               from 'styled-components/native'
import { app }              from 'mobx-app'

const DataItem = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const DataLabel = styled.Text`
   font-size: 10px;
   font-weight: 700;
   color: lightgrey;
`

const DataValue = styled.Text`
  font-size: 16px;
`

const ListItem = styled.View`
  justify-content: center;
  flex-direction: row;
  padding: 10px 0;
  border-bottom-width: 1;
  border-bottom-color: lightblue;
`

@inject(app('state'))
@observer
class CoinListItem extends Component {

  render() {
    const { coin, state: { preferences } } = this.props

    return (
      <ListItem>
        <DataItem>
          <DataLabel>
            NAME
          </DataLabel>
          <DataValue>
            {coin.name}
          </DataValue>
        </DataItem>
        <DataItem>
          <DataLabel>
            SYMBOL
          </DataLabel>
          <DataValue>
            {coin.symbol}
          </DataValue>
        </DataItem>
        <DataItem>
          <DataLabel>
            YOUR HOLDINGS
          </DataLabel>
          <DataValue>
            {coin.positionAmount}
          </DataValue>
        </DataItem>
        <DataItem>
          <DataLabel>
            INVESTMENT
          </DataLabel>
          <DataValue>
            {coin.totalInvestment} {preferences.defaultFiat}
          </DataValue>
        </DataItem>
      </ListItem>
    )
  }
}

export default CoinListItem
