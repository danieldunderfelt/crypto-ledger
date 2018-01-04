import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import styled               from 'styled-components/native'
import CoinsList            from '../components/coins/CoinList'
import ListPicker           from '../components/ListPicker'
import { app }              from 'mobx-app'
import { computed, observable, action }         from 'mobx'

const Wrapper = styled.View`
  flex: 1;
  padding-top: 50px;
  backgroundColor: #fff;
`

@inject(app('state'))
@observer
class Coins extends Component {
  
  @computed get cryptoOptions() {
    const { state } = this.props
    const crypto = state.sortedCrypto
    return crypto.map(c => ({ value: c.symbol, label: c.symbol, match: c.name }))
  }
  
  @observable selectedCoin = (this.cryptoOptions.find(c => c.value === 'BTC'))
  
  @action selectCoin = selection => {
    this.selectedCoin = selection
  }
  
  render() {
    
    return (
      <Wrapper>
        <ListPicker
          value={ this.selectedCoin }
          onChange={ this.selectCoin }
          options={ this.cryptoOptions } />
        <CoinsList />
      </Wrapper>
    )
  }
}

export default Coins
