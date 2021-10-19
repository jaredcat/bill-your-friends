// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app';
import { useState } from 'react';
import { Global, ThemeProvider, css } from '@emotion/react';
import styled from '@emotion/styled';
import { themeTypes } from '../types';
import { Theme } from '../interfaces';

const initThemeState: Theme = {
  fontColor: '#FFFFFF',
  backgroundColor: '#85bb65',
};

function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(initThemeState);

  const updateTheme = (newTheme: Theme) => {
    if (!newTheme || Object.entries(newTheme).length === 0) {
      setTheme(initThemeState);
    }
    setTheme((prevTheme) => {
      console.log(prevTheme, newTheme);
      return { ...prevTheme, ...newTheme };
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          body {
            background-color: ${theme.backgroundColor};
          }
        `}
      />
      <Component {...pageProps} updateTheme={updateTheme} />
    </ThemeProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App;
