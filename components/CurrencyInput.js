import React, { Component }             from 'react'
import styled                           from 'styled-components/native'
import { Input }                        from '../style/elements'
import ListPicker                       from './ListPicker'
import { observer, inject }             from 'mobx-react/native'
import { observable, action, computed } from 'mobx'
import { app }                          from 'mobx-app'
import get                              from 'lodash/get'

const Wrapper = styled.View`
  position: relative;
  overflow: hidden;
`

const PickerWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`

const CoinLogo = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`

@inject(app('state'))
@observer
class CurrencyValue extends Component {
  
  @computed get currencyOptions() {
    const { useFiat = false, state: { crypto, fiat } } = this.props
    return crypto.map(c => ({ value: c.symbol, label: c.symbol, match: c.name, sort: c.marketCapSort }))
  }
  
  @computed get coinLogoSrc() {
    const { state: { crypto }, selectedCurrency } = this.props
    
    if( !selectedCurrency ) return ''
    
    const coin = crypto.find(c => c.symbol === selectedCurrency.value)
    const uri = get(coin, 'logo', '')
    
    if( !uri ) {
      return require('../style/icons/generic.png')
    }
    
    return { uri }
  }
  
  render() {
    const { showLogo = true, style, autoFocus = false, placeholder = '', value = '', onChangeText, selectedCurrency, onSelectCurrency } = this.props
    
    return (
      <Wrapper style={ style }>
        <Input
          autoFocus={ autoFocus }
          returnKeyType="done"
          placeholder={ placeholder }
          keyboardType="numeric"
          onChangeText={ val => onChangeText(parseFloat(val)) }
          value={ value.toString() } />
        <PickerWrapper>
          { (showLogo && !!this.coinLogoSrc) && (
            <CoinLogo source={ this.coinLogoSrc } />
          ) }
          <ListPicker
            itemHeight={ 18 }
            listWidth={ 80 }
            value={ selectedCurrency }
            onChange={ onSelectCurrency }
            options={ this.currencyOptions } />
        </PickerWrapper>
      </Wrapper>
    )
  }
}

export default CurrencyValue
