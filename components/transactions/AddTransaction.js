import { app }                           from 'mobx-app'
import React, { Component }              from 'react'
import { ScrollView, Picker } from 'react-native'
import { observer, inject }              from 'mobx-react/native'
import styled, { css }                            from 'styled-components/native'
import { observable, action, toJS, computed }      from 'mobx'
import Transaction                       from '../../stores/objects/Transaction'
import currencies                        from '../../currencies'
import Button from '../Button'
import { Ionicons } from '@expo/vector-icons'
import styledIf from 'styled-if'

const Wrapper = styled.View`
  background-color: white;
  flex: 1;
  border-radius: 10;
  elevation: 5;
  margin: 10px;
`

const InnerWrapper = styled(ScrollView)``

const Form = styled.View`
  padding: 15px;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
`

const Heading = styled.Text`
  font-size: 20px;
`

const CloseButton = styled(Button)`
  margin-left: auto;
`

const FormItem = styled.View`
  flex: 2;
  
  ${ styledIf('alignRight', css`
    margin-left: auto;
    min-width: 10%;
    flex: 1;
  `)}
`

const ButtonLabel = styled.Text`
  color: white;
`

const Input = styled.TextInput`
  padding: 10px;
`

const InputGroup = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

const Label = styled.Text`
  flex: 1;
`

const ConfirmButton = styled(Button).attrs({
  full: true,
  background: 'dodgerblue'
})`
  padding: 15px;
  margin-top: auto;
`

@inject(app('Transactions'))
@observer
class AddTransaction extends Component {
  @observable newTransaction = Transaction({}, ( this.props.state ))
  
  @computed get canConfirm() {
    const { amountPaid, amountReceived } = this.newTransaction
    
    if( !!amountPaid && !!amountReceived ) {
      return true
    }
    
    return false
  }
  
  setProp = key => action(value => {
    this.newTransaction[ key ] = value
  })
  
  setNumericProp = key => action(value => {
    let setVal = parseFloat(value)
    
    if( !setVal || isNaN(setVal) ) {
      setVal = ''
    }
    
    this.newTransaction[ key ] = setVal
  })
  
  onConfirm = () => {
    const { Transactions, onClose } = this.props
    
    if(this.canConfirm) {
      Transactions.addItem(toJS(this.newTransaction))
    }
    
    onClose()
  }
  
  getCurrencyOptions = (exclude = []) => {
    const fiat = Object.keys(currencies.fiat)
    const crypto = Object.keys(currencies.fiat)
    const combined = []
  }
  
  render() {
    
    return (
      <Wrapper>
        <Header>
          <Heading>
            Add a transaction
          </Heading>
          <CloseButton
            onPress={this.props.onClose}>
            <Ionicons
              size={ 32 }
              name="md-close"
              color="#000" />
          </CloseButton>
        </Header>
        <InnerWrapper>
          <Form>
            <InputGroup>
              <Label>
                Paid
              </Label>
              <FormItem>
                <Input
                  placeholder="Amount paid"
                  keyboardType="numeric"
                  onChangeText={this.setNumericProp('amountPaid')}
                  value={this.newTransaction.amountPaid.toString()} />
              </FormItem>
              <FormItem alignRight>
                <Picker
                  mode="dropdown"
                  placeholder="Select currency"
                  onValueChange={this.setProp('currencyPaid')}
                  selectedValue={this.newTransaction.currencyPaid}>
                  {Object.keys(currencies.fiat).concat(Object.keys(currencies.crypto)).map(c => (
                    <Picker.Item
                      key={`currency_opt_${ c }`}
                      label={c}
                      value={c} />
                  ))}
                </Picker>
              </FormItem>
            </InputGroup>
            <InputGroup>
              <Label>
                Received
              </Label>
              <FormItem>
                <Input
                  placeholder="Amount received"
                  keyboardType="numeric"
                  onChangeText={this.setNumericProp('amountReceived')}
                  value={this.newTransaction.amountReceived.toString()} />
              </FormItem>
              <FormItem alignRight>
                <Picker
                  mode="dropdown"
                  placeholder="Select currency"
                  onValueChange={this.setProp('currencyReceived')}
                  selectedValue={this.newTransaction.currencyReceived}>
                  {Object.keys(currencies.fiat).concat(Object.keys(currencies.crypto)).map(c => (
                    <Picker.Item
                      key={`currency_opt_${ c }`}
                      label={c}
                      value={c} />
                  ))}
                </Picker>
              </FormItem>
            </InputGroup>
          </Form>
          <ConfirmButton
            disabled={ !this.canConfirm }
            onPress={this.onConfirm}>
            <ButtonLabel>
              Add transaction
            </ButtonLabel>
          </ConfirmButton>
        </InnerWrapper>
      </Wrapper>
    )
  }
}

export default AddTransaction
