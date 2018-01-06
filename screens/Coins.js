import React, { Component }             from 'react'
import { observer, inject }             from 'mobx-react/native'
import styled                           from 'styled-components/native'
import CoinsList                        from '../components/coins/CoinList'
import ListPicker                       from '../components/ListPicker'
import { app }                          from 'mobx-app'
import { computed, observable, action } from 'mobx'
import { AppBg }                        from '../style/elements'
import CurrencyInput                    from '../components/CurrencyInput'

const Wrapper = styled(AppBg)`
  flex: 1;
  padding-top: 50px;
`

@inject(app('state'))
@observer
class Coins extends Component {
  
  @observable selectedCoin = null
  @observable inputValue = ''
  
  @action selectCoin = selection => {
    this.selectedCoin = selection
  }
  
  @action onInput = value => {
    this.inputValue = value
  }
  
  render() {
    
    return (
      <Wrapper>
        <CurrencyInput
          value={ this.inputValue }
          onChangeText={ this.onInput }
          selectedCurrency={ this.selectedCoin }
          onSelectCurrency={ this.selectCoin }/>
        <CoinsList />
      </Wrapper>
    )
  }
}

export default Coins
