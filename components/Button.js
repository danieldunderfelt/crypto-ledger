import React, { Component }       from 'react'
import { observer }               from 'mobx-react/native'
import styled, { css }                     from 'styled-components/native'
import omit from 'lodash/omit'
import styledIf from 'styled-if'

const Btn = styled.TouchableHighlight`
  padding: 10px 20px;
  background-color: ${({ background = 'transparent' }) => background };
  
  ${ styledIf('full', css`
    flex: 1;
  `)}
  
  ${ styledIf('disabled', css`
    background-color: lightgrey;
  `)}
`

const DefaultLabel = styled.Text`
  color: ${({ color = '#000000' }) => color };
`

@observer
class Button extends Component {
  
  render() {
    const { label = '', labelColor = '#000000', children = <DefaultLabel color={ labelColor }>{ label }</DefaultLabel> } = this.props
    
    return (
      <Btn { ...omit(this.props, [ 'label', 'children' ]) }>
        { children }
      </Btn>
    )
  }
}

export default Button
