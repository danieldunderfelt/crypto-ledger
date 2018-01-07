import { StyleSheet, Platform } from 'react-native'
import styled   from 'styled-components/native'
import theme    from './theme'
import styledBy from 'styled-by'

export const AppBg = styled.View`
  background: ${ theme.darkBlue };
`

export const Input = styled.TextInput.attrs({
  underlineColorAndroid: 'rgba(0, 0, 0, 0)'
})`
  font-family: "SourceCodePro-Light";
  font-size: 24px;
  color: white;
  padding: 10px 15px;
  background-color: ${ theme.greyBlue };
  border-radius: 5px;
  border-width: 0;
`

export const InputOutline = styled.TextInput.attrs({
  underlineColorAndroid: 'rgba(0, 0, 0, 0)'
})`
  border-width: 1;
  border-color: ${ theme.greyBlue };
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 12px;
  color: white;
`