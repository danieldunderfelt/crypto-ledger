import React, { Component }                     from 'react'
import { Container, Header, Body, Content, H1 } from 'native-base'
import { observer }                             from 'mobx-react/native'
import styled                                   from 'styled-components/native'
import TransactionList                          from '../components/transactions/TransactionList'

const Wrapper = styled.View`
  flex: 1;
  backgroundColor: #fff;
`

@observer
class Transactions extends Component {

  render() {

    return (
      <Wrapper>
        <TransactionList />
      </Wrapper>
    )
  }
}

export default Transactions
