import React, { Component }                   from 'react'
import { StyleSheet } from 'react-native'
import { observer }                           from 'mobx-react/native'
import styled                                 from 'styled-components/native'
import debounce                                    from 'lodash/debounce'
import ListPickerItem                         from './ListPickerItem'
import { observable, action, computed } from 'mobx'
import fuzzyMatch from '../helpers/fuzzyMatch'

const ITEMHEIGHT = 20

const PickerContainer = styled.View`
  position: relative;
  height: 60px;
  border-width: ${ StyleSheet.hairlineWidth }
`

const OptionList = styled.FlatList``

const FilterInput = styled.TextInput`
  position: absolute;
  top: -${ ITEMHEIGHT + 5 }px;
  left: 0;
  font-size: 12px;
  padding: 4px 2px;
  width: 60px;
  background: #dedede;
  color: black;
  border-radius: 4px;
  text-align: center;
`

@observer
class ListPicker extends Component {
  @observable ignoreScroll = false
  @observable filterVisible = false
  @observable filterTerm = ''
  
  @computed get options() {
    const { filterTerm, props: { options } } = this
    
    let opts = !!filterTerm ? options.filter(opt => {
      return fuzzyMatch(opt.value, filterTerm)
    }) : options.slice()
    
    opts = opts.sort((a, b) => a.sort > b.sort ? 1 : -1)
    
    opts.push({ value: '_empty_end', label: '' })
    opts.unshift({ value: '_empty_start', label: '' })
    
    return opts
  }
  
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
    let scrollOffset = Math.round(offset + 0.5)
  
    let i = 0
  
    while( scrollOffset % ITEMHEIGHT !== 0 && i < ITEMHEIGHT + 1 ) {
      scrollOffset++
      i++
    }
   
    return (scrollOffset / ITEMHEIGHT)
  }
  
  onScrollEnd = (offset) => {
    const { options } = this
    
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
    const { options } = this
    const idx = options.findIndex(opt => opt.value === option.value)
    
    return idx
  }
  
  scrollToOption = (opt, animation = true) => {
    const nextIndex = this.getIndexOfOption(opt)
    
    if(nextIndex > -1) {
      this.disableScroll()
      this.scrollView.scrollToOffset({ offset: (nextIndex - 1) * ITEMHEIGHT, animated: animation })
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
      }), 500)
    }
  }
  
  toggleFilterInput = (setTo = !this.filterVisible) => {
    this.filterVisible = setTo
    
    if(!setTo) {
      this.onFilterClose()
    }
  }
  
  @action setFilterTerm = str => {
    this.filterTerm = str
    
    if(this.filterTerm !== '') {
      if(this.options.length > 2) { // Remember start and end padding
        this.onChange(this.options[ 1 ])
      }
    }
  }
  
  @action onFilterClose = () => {
    this.setFilterTerm('')
    
    const { value } = this.props
    this.scrollToOption(value, false)
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
      onLongPress={ () => this.toggleFilterInput() }
      onPress={ this.onChange }
      selectedColor="#444"
      itemHeight={ ITEMHEIGHT }
      item={ item }
      index={ index }
      selected={ this.props.value } />
  )
  
  render() {
    
    return (
      <PickerContainer>
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
          data={ this.options } />
        { this.filterVisible && (
          <FilterInput
            onSubmitEditing={ () => this.toggleFilterInput(false) }
            returnKeyType="search"
            autoFocus={ true }
            onChangeText={ this.setFilterTerm }
            value={ this.filterTerm } />
        )}
      </PickerContainer>
    )
  }
}

export default ListPicker
