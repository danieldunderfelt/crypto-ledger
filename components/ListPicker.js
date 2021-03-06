import React, { Component }             from 'react'
import { LayoutAnimation }              from 'react-native'
import { observer }                     from 'mobx-react/native'
import styled                           from 'styled-components/native'
import debounce                         from 'lodash/debounce'
import ListPickerItem                   from './ListPickerItem'
import { observable, action, computed } from 'mobx'
import fuzzyMatch                       from '../helpers/fuzzyMatch'
import get                              from 'lodash/get'
import Layout                           from '../constants/Layout'
import { InputOutline }                 from '../style/elements'

const DEFAULT_ITEMHEIGHT = 20

const PickerContainer = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 5px;
`

const OptionList = styled.FlatList`
  min-width: ${({ minWidth = 60 }) => minWidth}px;
  max-width: ${({ width = 100 }) => width}px;
  height: ${({ itemHeight = DEFAULT_ITEMHEIGHT }) => itemHeight * 3 }px;
`

const FilterInput = styled(InputOutline)`
  border-color: white;
  text-align: center;
  min-width: 50px;
  margin-right: 10px;
`

@observer
class ListPicker extends Component {
  @observable ignoreScroll = false
  @observable filterVisible = false
  @observable filterTerm = ''
  
  @computed get options() {
    const { filterTerm, props: { options } } = this
    
    let opts = !!filterTerm ? options.filter(({ value = '', match = '' }) => {
      return fuzzyMatch(value + match, filterTerm)
    }) : options.slice()
    
    opts = opts.sort((a, b) => a.sort > b.sort ? 1 : -1)
    
    // Add padding items
    opts.push({ value: '_empty_end', label: '', enabled: false })
    opts.unshift({ value: '_empty_start', label: '', enabled: false })
    
    return opts
  }
  
  _keyExtractor = item => item.value
  scrollView = null
  scrollEndTimeout = 0
  ignoreTimeout = 0
  
  onScroll = e => {
    if( this.ignoreScroll ) {
      return
    }
    
    const { y } = e.nativeEvent.contentOffset
    clearTimeout(this.scrollEndTimeout)
    
    this.scrollEndTimeout = setTimeout(offset => {
      this.onScrollEnd(offset)
    }, 100, y)
  }
  
  getIndexFromOffset = offset => {
    const { itemHeight = DEFAULT_ITEMHEIGHT } = this.props
    let scrollOffset = Math.round(offset + 1)
    
    let i = 0
    
    while( scrollOffset % itemHeight !== 0 && i < itemHeight + 1 ) {
      scrollOffset++
      i++
    }
    
    return (scrollOffset / itemHeight)
  }
  
  onScrollEnd = (offset) => {
    const { options } = this
    
    const optionsIndex = this.getIndexFromOffset(offset)
    const optionAtIndex = options[ optionsIndex ]
    
    if( typeof optionAtIndex !== 'undefined' && get(optionAtIndex, 'enabled', true) ) {
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
    const { itemHeight = DEFAULT_ITEMHEIGHT } = this.props
    const nextIndex = this.getIndexOfOption(opt)
    
    if( nextIndex > -1 ) {
      this.disableScroll()
      this.scrollView.scrollToOffset({ offset: (nextIndex - 1) * itemHeight, animated: animation })
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.filterVisible = setTo
    
    if( !setTo ) {
      this.onFilterClose()
    }
  }
  
  @action setFilterTerm = str => {
    this.filterTerm = str
    
    if( this.filterTerm !== '' ) {
      if( this.options.length > 2 ) { // Remember start and end padding
        this.onChange(this.options[ 1 ])
      }
    }
  }
  
  @action onFilterClose = () => {
    this.setFilterTerm('')
    
    const { value } = this.props
    this.scrollToOption(value, false)
  }
  
  onItemPress = opt => {
    this.toggleFilterInput(false)
    this.onChange(opt)
  }
  
  componentDidMount() {
    let { value = null } = this.props
    
    if(!value) {
      this.onChange(get(this, 'options[1]', {}))
    } else {
      this.scrollToOption(value)
    }
  }
  
  componentWillReceiveProps({ value: nextValue }) {
    const { value } = this.props
    
    if( value !== nextValue ) {
      this.scrollToOption(nextValue)
    }
  }
  
  _renderItem = ({ item, index }) => (
    <ListPickerItem
      onLongPress={ () => this.toggleFilterInput() }
      onPress={ this.onItemPress }
      selectedColor="#444"
      itemHeight={ get(this, 'props.itemHeight', DEFAULT_ITEMHEIGHT) }
      item={ item }
      index={ index }
      selected={ this.props.value } />
  )
  
  render() {
    const { style, listWidth = 100, itemHeight = DEFAULT_ITEMHEIGHT } = this.props
    
    return (
      <PickerContainer style={ style }>
        { this.filterVisible && (
          <FilterInput
            autoCorrect={ false }
            autoCapitalize="none"
            onSubmitEditing={ () => this.toggleFilterInput(false) }
            returnKeyType="search"
            autoFocus={ true }
            onChangeText={ this.setFilterTerm }
            value={ this.filterTerm } />
        ) }
        <OptionList
          itemHeight={ itemHeight }
          width={ listWidth }
          showsVerticalScrollIndicator={ false }
          showsHorizontalScrollIndicator={ false }
          getItemLayout={ (data, idx) => ({
            offset: itemHeight * idx,
            length: itemHeight,
            index: idx
          })}
          innerRef={ ref => this.scrollView = ref }
          onScroll={ this.onScroll }
          scrollEnabled={ !this.ignoreScroll }
          keyExtractor={ this._keyExtractor }
          renderItem={ this._renderItem }
          data={ this.options } />
      </PickerContainer>
    )
  }
}

export default ListPicker
