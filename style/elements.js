import styled   from 'styled-components/native'
import theme    from './theme'
import styledBy from 'styled-by'

export const AppBg = styled.View`
  background: ${ theme.darkBlue };
`

export const Input = styled.TextInput`
  font-family: "SourceCodePro-Light";
  font-size: 24px;
  color: white;
  padding: 10px 15px;
  background-color: ${ theme.greyBlue };
  border-radius: 5px;
`