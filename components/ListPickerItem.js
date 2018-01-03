import React, { Component }       from 'react'
import { observer }               from 'mobx-react/native'
import styled                     from 'styled-components/native'
import is                         from 'styled-is'
import get from 'lodash/get'

const OptionItem = styled.Text`
  height: ${({ height = 20 }) => height}px;
  color: ${({ defaultColor = 'lightgrey' }) => defaultColor };
  
  ${ is('selected')`
    color: ${({ selectedColor = '#444' }) => selectedColor };
  `}
`

@observer
class ListPickerItem extends Component {
  
  render() {
    const { item, selected } = this.props
    const isSelected = get(selected, 'value', false) === get(item, 'value', true)
    
    return (
      <OptionItem selected={ isSelected }>
        { item.label }
      </OptionItem>
    )
  }
}

export default ListPickerItem
