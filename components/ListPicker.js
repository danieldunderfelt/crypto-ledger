import React, { Component }                   from 'react'
import { observer }                           from 'mobx-react/native'
import styled                                 from 'styled-components/native'
import debounce                                    from 'lodash/debounce'
import ListPickerItem                         from './ListPickerItem'
import { observable, action } from 'mobx'

const Wrapper = styled.View`
  position: relative;
  height: 60px;
`

const OptionList = styled.FlatList``

const ITEMHEIGHT = 20

@observer
class ListPicker extends Component {
  @observable ignoreScroll = false
  
  _keyExtractor = item => item.value
  scrollView = null
  scrollEndTimeout = 0
  ignoreTimeout = 0
  
  onScroll = e => {
    if(this.ignoreScroll) {
      return
    }
  
    const { y } = e.nativeEvent.contentOffset
    clearTimeout(this.scrollEndTimeout)
    
    this.scrollEndTimeout = setTimeout(offset => {
      this.onScrollEnd(offset)
    }, 100, y)
  }
  
  getIndexFromOffset = offset => {
    let scrollOffset = Math.round(offset)
  
    let i = 0
  
    while( scrollOffset % ITEMHEIGHT !== 0 && i < ITEMHEIGHT + 1 ) {
      scrollOffset++
      i++
    }
   
    return (scrollOffset / ITEMHEIGHT) - 1
  }
  
  onScrollEnd = (offset) => {
    const { options } = this.props
    
    const optionsIndex = this.getIndexFromOffset(offset)
    const optionAtIndex = options[ optionsIndex ]

    if( typeof optionAtIndex !== 'undefined' ) {
      this.onChange(optionAtIndex, optionsIndex)
    }
  }
  
  onChange = debounce((opt, index) => {
    this.disableScroll()
    this.props.onChange(opt, index)
  }, 10)
  
  getIndexOfOption = option => {
    const { options } = this.props
    const idx = options.findIndex(opt => opt.value === option.value)
    
    return idx
  }
  
  scrollToOption = opt => {
    const nextIndex = this.getIndexOfOption(opt)
    
    if(nextIndex > -1) {
      this.disableScroll()
      this.scrollView.scrollToOffset({ offset: nextIndex * ITEMHEIGHT })
      this.scrollView.recordInteraction()
    }
  }
  
  disableScroll = () => {
    this.ignoreScroll = true
    // Ignore while scroll animation is happening.
    // And don't spawn more than one timeout :)
    if( !this.ignoreTimeout ) {
      this.ignoreTimeout = setTimeout(action(() => {
        this.ignoreScroll = false
        this.ignoreTimeout = 0
      }), 400)
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
      onPress={ this.onChange }
      selectedColor="#444"
      itemHeight={ ITEMHEIGHT }
      item={ item }
      index={ index }
      selected={ this.props.value } />
  )
  
  render() {
    const { options } = this.props
    
    let opts = options.slice()
    opts.push({ value: '_empty_end', label: 'START' })
    opts.unshift({ value: '_empty_start', label: 'END' })
    
    return (
      <Wrapper>
        <OptionList
          showsVerticalScrollIndicator={ false }
          showsHorizontalScrollIndicator={ false }
          getItemLayout={ (data, idx) => ({ offset: ITEMHEIGHT * idx, length: ITEMHEIGHT, index: idx }) }
          innerRef={ ref => this.scrollView = ref }
          onScroll={ this.onScroll }
          decelerationRate="fast"
          scrollEnabled={ !this.ignoreScroll }
          keyExtractor={ this._keyExtractor }
          renderItem={ this._renderItem }
          data={ opts } />
      </Wrapper>
    )
  }
}

export default ListPicker
