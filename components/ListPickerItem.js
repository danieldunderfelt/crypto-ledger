import React, { Component } from 'react'
import { observer }         from 'mobx-react/native'
import styled               from 'styled-components/native'
import is                   from 'styled-is'
import get                  from 'lodash/get'
import { NormalText }       from '../style/typography'
import theme from '../style/theme'

const OptionItem = styled.TouchableOpacity`
  height: ${({ height = 20 }) => height }px;
  background-color: transparent;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: nowrap;
`

const OptionLabel = styled(NormalText)``

@observer
class ListPickerItem extends Component {
  
  onItemPress = e => {
    const { item, index, onPress } = this.props
    const { enabled = true } = item
    
    if( enabled ) {
      onPress(item, index)
    }
  }
  
  render() {
    const { onLongPress, itemHeight, item, selected } = this.props
    const isSelected = get(selected, 'value', false) === get(item, 'value', true)
    
    return (
      <OptionItem
        onLongPress={ onLongPress }
        onPress={ this.onItemPress }
        height={ itemHeight }>
        <OptionLabel
          weight="bold"
          size={ 16 }
          color={ isSelected ? 'white' : theme.lightGreyBlue }
          selected={ isSelected }>
          { item.label }
        </OptionLabel>
      </OptionItem>
    )
  }
}

export default ListPickerItem
