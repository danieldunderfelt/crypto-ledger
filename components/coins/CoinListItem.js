import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import styled               from 'styled-components/native'
import { app }              from 'mobx-app'
import is                   from 'styled-is'
import DynamicPrice         from '../DynamicPrice'

const DataItem = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  
  ${ is('row')`
    flex-direction: row;
  `}
`

const DataLabel = styled.Text`
   font-size: 10px;
   font-weight: 700;
   color: lightgrey;
`

const DataValue = styled.Text`
  font-size: 16px;
`

const PriceValue = styled(DynamicPrice)`
  font-size: 16px;
`

const ListItem = styled.View`
  justify-content: center;
  flex-direction: column;
  padding: 10px 0;
  border-bottom-width: 1;
  border-bottom-color: lightblue;
`

const CoinLogo = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 8px;
`

@inject(app('state'))
@observer
class CoinListItem extends Component {

  render() {
    const { coin, state: { preferences } } = this.props

    return (
      <ListItem>
        <DataItem row>
          <DataItem row>
            <CoinLogo source={ { uri: coin.logo } } />
            <DataValue>
              { coin.name }
            </DataValue>
          </DataItem>
          <DataItem>
            <DataValue>
              { coin.symbol }
            </DataValue>
          </DataItem>
        </DataItem>
        <DataItem row>
          <DataItem>
            <DataLabel>
              CURRENT VALUE
            </DataLabel>
            <PriceValue>
              { coin.marketValue }
            </PriceValue>
          </DataItem>
          <DataItem>
            <DataLabel>
              YOUR HOLDINGS
            </DataLabel>
            <DataValue>
              { coin.positionAmount }
            </DataValue>
          </DataItem>
          <DataItem>
            <DataLabel>
              INVESTMENT
            </DataLabel>
            <DataValue>
              { coin.totalInvestment }
            </DataValue>
          </DataItem>
        </DataItem>
      </ListItem>
    )
  }
}

export default CoinListItem
