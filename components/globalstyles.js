import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --transition-duration: 200ms;
  }
  
  html,
  body {
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.secondary.main};
    padding: 0;
    margin: 0;
    font-family: Roboto;
  }
  
  * {
    box-sizing: border-box;
  }
  
  html,
  body,
  body > div:first-child,
  div#__next,
  div#__next > div {
    height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`

export default GlobalStyle
