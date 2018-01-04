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
  ignoreScroll = true
  scrollDidEnd = false
  
  onScroll = e => {
    if(this.ignoreScroll) {
      this.ignoreScroll = false
      return
    }
    
    const { options } = this.props
    const scrollOffset = Math.round(e.nativeEvent.contentOffset.y)
    
    if( scrollOffset % 20 === 0) {
      const optionsIndex = scrollOffset > 0 ? Math.round(scrollOffset / 20) + 1 : 0
      const optionAtIndex = get(options, `[${ optionsIndex }]`, false)
  
      if( optionAtIndex ) {
        this.onChange(optionAtIndex)
      }
    }
  }
  
  onChange = opt => {
    this.ignoreScroll = true
    this.props.onChange(opt)
  }
  
  getIndexOfOption = option => {
    const { options } = this.props
    const idx = options.findIndex(opt => opt.value === option.value)
    
    return idx
  }
  
  scrollToOption = opt => {
    const nextIndex = this.getIndexOfOption(opt)
    
    if(nextIndex > -1) {
      this.ignoreScroll = true
      this.scrollView.scrollToIndex({ index: nextIndex, viewPosition: 0.5 })
    }
  }
  
  componentDidMount() {
    const { value } = this.props
    this.scrollToOption(value)
  }
  
  componentWillReceiveProps({ value: nextValue }) {
    const { value } = this.props
    
    if(value !== nextValue) {
      this.scrollToOption(nextValue)
    }
  }
  
  _renderItem = ({ item, index }) => (
    <ListPickerItem
      item={ item }
      index={ index }
      selected={ this.props.value } />
  )
  
  render() {
    const { options } = this.props
    
    let opts = options.slice()
    opts.push({ value: '_empty_end', label: '' })
    
    return (
      <Wrapper>
        <OptionList
          contentInset={{ top: 20 }}
          showsVerticalScrollIndicator={ false }
          showsHorizontalScrollIndicator={ false }
          getItemLayout={ (data, idx) => ({ offset: 20 * idx, length: 20, index: idx })}
          innerRef={ ref => this.scrollView = ref }
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
