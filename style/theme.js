import createTheme from 'styled-components-theme'

export const themeConfig = {
  darkBlue: '#21282F',
  greyBlue: '#62768B',
  lightGreyBlue: '#6B8799'
}

export default createTheme(...Object.keys(themeConfig))