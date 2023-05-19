import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --transition-duration: 200ms;
    --font-family: 'Wix Madefor Display', sans-serif;
    --text-color: #fafafa;
    --text-color-light: #eeeeee;
    --text-color-dark: #bbbbbb;
    --background-color: #111111;
    --page-margin: 50px;
  }
  
  html,
  body {
    color: var(--text-color);
    background-color: var(--background-color);
    padding: 0;
    margin: 0;
    font-family: var(--font-family);
    
    animation: fadeInAnimation ease 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
  
  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
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
`

export default GlobalStyle
