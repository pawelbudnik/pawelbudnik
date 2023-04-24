import { useContext } from 'react';
import DarkModeContext from '../hooks/DarkModeContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useRouter, NextRouter } from 'next/router';
import NavLogo from '../public/assets/navlogo_blue.png';

const Navbar = (): JSX.Element => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState('#ecf0f3');
  const [linkColor, setLinkColor] = useState('#1f2937');
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (
      router.asPath === '/cageminder' ||
      router.asPath === '/treasurydelta' ||
      router.asPath === '/vast' ||
      router.asPath === '/PB'
    ) {
      setNavBg('transparent');
      setLinkColor('#ecf0f3');
    } else {
      setNavBg('#ecf0f3');
      setLinkColor('#1f2937');
    }
  }, [router]);

  const handleNav = () => {
    setNav(!nav);
  }

  const toggleDarkModeFromSidebar = () => {
    toggleDarkMode();
    setNav(false);
  }

  useEffect(() => {
    const handleShadow = () => {
      window.scrollY >= 90 ? setShadow(true) : setShadow(false);
    }
    window.addEventListener('scroll', handleShadow);
  }, []);

  return (
    <div style={{ backgroundColor: `${navBg}`}}
      className={shadow ? 'fixed w-full h-20 shadow-xl z-[100]' : 'fixed w-full h-20 z-[100]'}>
      <div className='flex justify-between items-center w-full h-full px-2 2xl:px-16'>
        <Link href='/'>
            <Image src={NavLogo} alt='/' width='125' height='50' className='cursor-pointer'/>
        </Link>
        <div>
          <ul style={{ color: `${linkColor}`}}
            className='hidden md:flex'>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <Link href='/'>Home</Link>
            </li>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <Link href='/#about'>About</Link>
            </li>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <Link href='/#skills'>Skills</Link>
            </li>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <Link href='/#projects'>Projects</Link>
            </li>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <a href="/resume/Resume-Pawel-Budnik.pdf" download>
                Resume
              </a>
            </li>
            <li className='ml-10 text-sm uppercase hover:border-b'>
              <Link href='/#contact'>Contact</Link>
            </li>
            <li className='ml-10 text-xl' onClick={toggleDarkMode}>
                {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
            </li>
          </ul>
          {/* Mobile nav elements */}
          <div className='md:hidden flex flex-row'>
            <div className='text-xl pr-10 pt-0.5' onClick={toggleDarkMode}>
                {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
            </div>
            <div onClick={handleNav}>
              <AiOutlineMenu size={25} />
            </div>
          </div>
        </div>
      </div>

      <div className={nav ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70' : ''}>
        {/* Side Drawer Menu */}
        <div
          className={nav 
            ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-[#ecf0f3] p-10 ease-in duration-100' 
            : 'fixed left-[-100%] top-0 p-10 ease-in duration-100'}
        >
          <div>
            
            <div className='flex w-full items-center justify-between'>
              <Link href='/'>
                  <Image src={NavLogo} width='87' height='35' alt='/'/>
              </Link>
              <div onClick={handleNav} className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer'>
                <AiOutlineClose />
              </div>
            </div>
            <div className='border-b border-gray-300 my-4'>
              <p className={nav ? 'w-[85%] md:w-[90%] py-4' : 'hidden'}>
                Let&#39;s collaborate to create something truly remarkable
              </p>
            </div>
          </div>
          <div className='py-4 flex flex-col'>
            <ul className='uppercase'>
              <Link href='/'>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  Home
                </li>
              </Link>
              <Link href='/#about'>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  About
                </li>
              </Link>
              <Link href='/#skills'>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  Skills
                </li>
              </Link>
              <Link href='/#projects'>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  Projects
                </li>
              </Link>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  <a href="/resume/Resume-Pawel-Budnik.pdf" download>
                    Resume
                  </a>
                </li>
              <Link href='/#contact'>
                <li onClick={() => setNav(false)} className='py-4 text-sm'>
                  Contact
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;