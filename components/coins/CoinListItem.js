import React, { Component } from 'react'
import { observer } from 'mobx-react/native'
import styled from 'styled-components/native'

const CoinName = styled.Text`
  
`

const CoinValue = styled.Text`

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
class CoinListItem extends Component {

  render() {
    const { coin } = this.props

    return (
      <ListItem>
        <CoinName>
          { coin.name }
        </CoinName>
        <CoinValue>
          { coin.value }
        </CoinValue>
      </ListItem>
    )
  }
}

export default CoinListItem
