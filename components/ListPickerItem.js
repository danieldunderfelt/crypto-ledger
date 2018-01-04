import React, { Component }       from 'react'
import { observer }               from 'mobx-react/native'
import styled                     from 'styled-components/native'
import is                         from 'styled-is'
import get from 'lodash/get'

const OptionItem = styled.View`
  height: ${({ height = 20 }) => height }px;
`

const OptionLabel = styled.Text`
  color: ${({ defaultColor = 'lightgrey' }) => defaultColor };

  ${ is('selected')`
    color: ${({ selectedColor = '#444' }) => selectedColor };
  `}
`

@observer
class ListPickerItem extends Component {
  
  render() {
    const { height, item, selected } = this.props
    const isSelected = get(selected, 'value', false) === get(item, 'value', true)
    
    return (
      <OptionItem
        height={ height }>
        <OptionLabel
          selected={ isSelected }>
          { item.label }
        </OptionLabel>
      </OptionItem>
    )
  }
}

export default ListPickerItem
