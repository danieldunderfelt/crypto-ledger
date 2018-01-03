import React, { Component }                   from 'react'
import { View, Text, StyleSheet }             from 'react-native'
import { observer }                           from 'mobx-react/native'
import styled                                 from 'styled-components/native'
import get                                    from 'lodash/get'
import debounce                                    from 'lodash/debounce'
import ListPickerItem                         from './ListPickerItem'

const Wrapper = styled.View``
const OptionList = styled.FlatList`
  height: 60px;
`

@observer
class ListPicker extends Component {
  _keyExtractor = item => item.value
  scrollView = null
  ignoreScroll = false
  
  onScroll = e => {
    if(this.ignoreScroll) {
      this.ignoreScroll = false
      return
    }
    
    const { options } = this.props
    const scrollOffset = Math.round(e.nativeEvent.contentOffset.y)
    const optionsIndex = (scrollOffset / 20) + 1
    const optionAtIndex = get(options, `[${ optionsIndex }]`, false)
  
    if( optionAtIndex ) {
      this.onChange(optionAtIndex)
    }
  }
  
  onChange = debounce(opt => {
    this.props.onChange(opt)
  }, 100)
  
  getIndexOfOption = option => {
    const { options } = this.props
    return options.findIndex(opt => opt.value === option.value)
  }
  
  getOffsetOfOption = option => {
    const idx = this.getIndexOfOption(option)
    
    if(idx > -1) {
      return idx * 20
    }
    
    return 0
  }
  
  componentWillReceiveProps({ value: nextValue }) {
    const { value } = this.props
    
    if(value !== nextValue) {
      const nextOffset = this.getIndexOfOption(nextValue)
      
      this.ignoreScroll = true
      this.scrollView.scrollToIndex({ index: nextOffset, viewPosition: 0.5  })
    }
  }
  
  _renderItem = ({ item }) => (
    <ListPickerItem
      item={ item }
      selected={ this.props.value } />
  )
  
  render() {
    const { options } = this.props
    
    return (
      <Wrapper>
        <OptionList
          getItemLayout={ (data, idx) => ({ offset: 20 * idx, length: 20, index: idx })}
          innerRef={ ref => this.scrollView = ref }
          decelerationRate={ 0 }
          onScroll={ this.onScroll }
          snapToAlignment="center"
          snapToInterval={ 20 }
          keyExtractor={ this._keyExtractor }
          renderItem={ this._renderItem }
          data={ options } />
      </Wrapper>
    )
  }
}

export default ListPicker
