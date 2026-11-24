import { useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import DarkModeContext from '../hooks/DarkModeContext';
import '../styles/globals.css';
import '../styles/waves.css';

function MyApp({ Component, pageProps }: AppProps ): JSX.Element {
  const [darkMode, setDarkMode] = useState(false);
  const { pathname } = useRouter();
  const standaloneViewer = pathname === '/seetakeoffs' || pathname === '/pilotspy';

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  
  return (
    <>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        {!standaloneViewer && <Navbar />}
        <Component {...pageProps} />
      </DarkModeContext.Provider>
    </>
  );
}

export default MyApp;
