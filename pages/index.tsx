import { useContext } from 'react';
import Head from 'next/head';
import Main from '../components/Main';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import DarkModeContext from '../hooks/DarkModeContext';

export default function Home(): JSX.Element {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='bg-white dark:bg-gray-900'>
        <Head>
          <title>Paweł | Full-Stack Developer</title>
          <meta name="description" content="Welcome to my portfolio website! I am a Full-Stack Developer. Browse through my projects and experience to learn more about my skills and capabilities" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Main />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}
