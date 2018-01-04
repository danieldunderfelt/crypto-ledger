import React, { Component }                   from 'react'
import { observer }                           from 'mobx-react/native'
import styled                                 from 'styled-components/native'
import debounce                                    from 'lodash/debounce'
import ListPickerItem                         from './ListPickerItem'
import { LinearGradient } from 'expo'

const Wrapper = styled.View`
  position: relative;
  height: 60px;
`

const OptionList = styled.FlatList``

@observer
class ListPicker extends Component {
  _keyExtractor = item => item.value
  scrollView = null
  ignoreScroll = true
  scrollEndTimeout = 0
  
  onScroll = e => {
    if(this.ignoreScroll) {
      this.ignoreScroll = false
      return
    }
    
    clearTimeout(this.scrollEndTimeout)
    
    this.scrollEndTimeout = setTimeout(offset => {
      this.onScrollEnd(offset)
    }, 100, e.nativeEvent.contentOffset.y)
  }
  
  onScrollEnd = offset => {
    const { options } = this.props
    let scrollOffset = Math.round(offset)
  
    if( scrollOffset % 20 === 0) {
      const optionsIndex = scrollOffset > 0 ? Math.round(scrollOffset / 20) + 1 : 0
      const optionAtIndex = options[ optionsIndex ]
  
      if( typeof optionAtIndex !== 'undefined' ) {
        this.ignoreScroll = true
        this.onChange(optionAtIndex)
      }
    }
  }
  
  onChange = opt => {
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
      selectedColor="#444"
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
          showsVerticalScrollIndicator={ false }
          showsHorizontalScrollIndicator={ false }
          getItemLayout={ (data, idx) => ({ offset: 20 * idx, length: 20, index: idx }) }
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
