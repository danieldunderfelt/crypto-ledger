import React, { Component }                     from 'react'
import { Container, Header, Body, Content, H1 } from 'native-base'
import { observer }                             from 'mobx-react/native'
import styled                                   from 'styled-components/native'
import CoinsList                                from '../components/coins/CoinList'

const Wrapper = styled.View`
  flex: 1;
  backgroundColor: #fff;
`

@observer
class Coins extends Component {

  render() {

    return (
      <Wrapper>
        <CoinsList />
      </Wrapper>
    )
  }
}

export default Coins
