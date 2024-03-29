import { useState } from 'react';
import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import DarkModeContext from '../hooks/DarkModeContext';
import '../styles/globals.css';
import '../styles/waves.css';

function MyApp({ Component, pageProps }: AppProps ): JSX.Element {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  
  return (
    <>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Navbar />
        <Component {...pageProps} />
      </DarkModeContext.Provider>
    </>
  );
}

export default MyApp;
