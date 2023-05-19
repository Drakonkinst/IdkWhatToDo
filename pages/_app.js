import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../components/globalstyles'

// Use a blank theme, styling handled manually
const theme = {};

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
