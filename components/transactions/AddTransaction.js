import { app }                                from 'mobx-app'
import React, { Component }                   from 'react'
import { ScrollView, Picker }                 from 'react-native'
import { observer, inject }                   from 'mobx-react/native'
import styled, { css }                        from 'styled-components/native'
import { observable, action, toJS, computed } from 'mobx'
import Transaction                            from '../../stores/objects/Transaction'
import currencies, { isFiat }                 from '../../helpers/currencyHelpers'
import Button                                 from '../Button'
import { Ionicons }                           from '@expo/vector-icons'
import reject                                 from 'lodash/reject'
import is                                     from 'styled-is'
import DatePicker                             from 'react-native-datepicker'
import parse                                  from 'date-fns/parse'
import currencyActions                        from '../../actions/CurrencyActions'

const Wrapper = styled.View`
  background-color: white;
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

const FormItem = styled.View`
  flex: 3;
  
  ${ is('alignRight')`
    margin-left: auto;
    min-width: 30%;
    flex: 0;
  `}
`

const Label = styled.Text`
  flex: 2;
`

const Suffix = styled.Text`
  flex: 1;
`

const RefreshButton = styled(Button)`
  padding: 5px 10px;
`

const ConfirmButton = styled(Button).attrs({
  full: true,
  background: 'dodgerblue'
})`
  padding: 15px;
  margin-top: auto;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
`

@inject(app('Transactions', 'Currencies'))
@observer
class AddTransaction extends Component {
  currencyActions = currencyActions((this.props.state))
  @observable newTransaction = Transaction({}, (this.props.state))
  
  @computed get canConfirm() {
    const { amountPaid, amountReceived } = this.newTransaction
    
    if( !!amountPaid && !!amountReceived ) {
      return true
    }
    
    return false
  }
  
  @computed get currencies() {
    const { crypto, fiat } = this.props.state
    
    return crypto.concat(fiat).reduce((all, item) => {
      all[ item.symbol ] = item
      return all
    }, {})
  }
  
  @action calculateFees = () => {
    this.newTransaction.fees = null
  }
  
  @action calculateExchangeRate = () => {
    this.newTransaction.exchangeRate = null
  }
  
  setProp = key => action(value => {
    this.newTransaction[ key ] = value
  })
  
  setDateProp = key => action(date => {
    this.newTransaction[ key ] = parse(date)
  })
  
  setNumericProp = key => action(value => {
    let setVal = value
    
    if( setVal === '' || isNaN(parseFloat(setVal)) ) {
      setVal = ''
    }
    
    this.newTransaction[ key ] = setVal
  })
  
  onConfirm = () => {
    const { Transactions, onClose } = this.props
    
    if( this.canConfirm ) {
      Transactions.addItem(toJS(this.newTransaction))
    }
    
    onClose()
  }
  
  getCurrencyOptions = (exclude = []) => {
    const excludeOption = Array.isArray(exclude) ? exclude : [ exclude ]
    const { currencies } = this
    
    return reject(Object.keys(currencies), opt => excludeOption.indexOf(opt) > -1)
  }
  
  render() {
    const { fiat } = this.props.state
    const { transactionFees, fees, exchangeRate, txExchangeRate, currencyPaid, currencyReceived, amountPaid, amountReceived } = this.newTransaction
    const fiatSymbols = fiat.map(f => f.symbol)
    
    const paidCurrencyExclude = this.currencyActions.isFiat(currencyReceived) ? fiatSymbols : currencyReceived
    const receivedCurrencyExclude = this.currencyActions.isFiat(currencyPaid) ? fiatSymbols : currencyPaid
    
    const displayExchange = exchangeRate === null && (amountReceived && amountPaid) ?
      txExchangeRate :
      exchangeRate ? exchangeRate : ''
    
    const displayFees = fees === null && transactionFees ?
      transactionFees :
      fees !== null ? fees : 0
    
    return (
      <Wrapper>
        <Header>
          <Heading>
            Add a transaction
          </Heading>
          <CloseButton
            onPress={ this.props.onClose }>
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
                  autoFocus
                  selectTextOnFocus
                  placeholder="Amount paid"
                  keyboardType="numeric"
                  onChangeText={ this.setNumericProp('amountPaid') }
                  value={ amountPaid.toString() } />
              </FormItem>
              <FormItem alignRight>
                <Picker
                  mode="dropdown"
                  placeholder="Select currency"
                  onValueChange={ this.setProp('currencyPaid') }
                  selectedValue={ currencyPaid }>
                  { this.getCurrencyOptions(paidCurrencyExclude).map(c => (
                    <Picker.Item
                      key={ `currency_opt_${ c }` }
                      label={ c }
                      value={ c } />
                  )) }
                </Picker>
              </FormItem>
            </InputGroup>
            <InputGroup>
              <Label>
                Received
              </Label>
              <FormItem>
                <Input
                  selectTextOnFocus
                  placeholder="Amount received"
                  keyboardType="numeric"
                  onChangeText={ this.setNumericProp('amountReceived') }
                  value={ amountReceived.toString() } />
              </FormItem>
              <FormItem alignRight>
                <Picker
                  mode="dropdown"
                  placeholder="Select currency"
                  onValueChange={ this.setProp('currencyReceived') }
                  selectedValue={ currencyReceived }>
                  { this.getCurrencyOptions(receivedCurrencyExclude).map(c => (
                    <Picker.Item
                      key={ `currency_opt_${ c }` }
                      label={ c }
                      value={ c } />
                  )) }
                </Picker>
              </FormItem>
            </InputGroup>
            <InputGroup>
              <Label>
                { currencyPaid } / { currencyReceived } rate
              </Label>
              <FormItem>
                <Input
                  selectTextOnFocus
                  keyboardType="numeric"
                  onChangeText={ this.setNumericProp('exchangeRate') }
                  value={ displayExchange.toString() } />
              </FormItem>
              <RefreshButton onPress={ this.calculateExchangeRate }>
                <Ionicons
                  size={ 25 }
                  name="ios-refresh" />
              </RefreshButton>
            </InputGroup>
            <InputGroup>
              <Label>
                Transaction fees
              </Label>
              <FormItem>
                <Input
                  selectTextOnFocus
                  keyboardType="numeric"
                  onChangeText={ this.setNumericProp('fees') }
                  value={ displayFees.toString() } />
              </FormItem>
              <Suffix>
                { currencyPaid }
              </Suffix>
              <RefreshButton onPress={ this.calculateFees }>
                <Ionicons
                  size={ 25 }
                  name="ios-refresh" />
              </RefreshButton>
            </InputGroup>
            <InputGroup>
              <Label>
                Transaction time
              </Label>
              <FormItem>
                <DatePicker
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  mode="datetime"
                  duration={ 200 }
                  showIcon={ false }
                  is24Hour={ true }
                  onDateChange={ this.setDateProp('transactionTime') }
                  placeholder="Set txion time"
                  date={ this.newTransaction.transactionTime }/>
              </FormItem>
            </InputGroup>
          </Form>
          <ConfirmButton
            disabled={ !this.canConfirm }
            onPress={ this.onConfirm }>
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
