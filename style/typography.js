import styled from 'styled-components/native'
import theme from './theme'

export const Value = styled.Text`
  font-family: ${ ({ weight = 'regular' }) => weight === 'light' ? 'SourceCodePro-Light' : 'SourceCodePro' };
  font-size: ${({ size = 14 }) => size }px;
  color: ${({ color = 'white' }) => color };
`

export const NormalText = styled.Text`
  font-family: ${ ({ weight = 'regular' }) => ({
    'regular': 'Montserrat',
    'light': 'Montserrat-Light',
    'bold': 'Montserrat-Bold',
  }[ weight ])};
  font-size: ${({ size = 14 }) => size }px;
  color: ${({ color = 'white' }) => color };
`