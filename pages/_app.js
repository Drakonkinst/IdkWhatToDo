import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material/styles';
import GlobalStyle from '../components/globalstyles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fafafa'
    },
    secondary: {
      main: '#111'
    }
  }
});
console.log(theme);

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
