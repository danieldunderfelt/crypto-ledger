import React, { Component }       from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { observer }               from 'mobx-react/native'
import styled                     from 'styled-components/native'
import { observable, action }             from 'mobx'

const Price = styled.Text``

/**
 * This component only updates if the new value is truthy.
 */

@observer
class DynamicPrice extends Component {
  
  @observable price = ''
  
  @action componentWillReceiveProps({ children }) {
    if(children) {
      this.price = children
    }
  }
  
  render() {
    
    return (
      <Price>
        { this.price }
      </Price>
    )
  }
}

export default DynamicPrice
