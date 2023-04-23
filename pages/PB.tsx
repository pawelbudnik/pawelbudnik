import React, { useContext } from 'react';
import Image from 'next/image';
import pbimg from '../public/assets/projects/pb_bg.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import DarkModeContext from '../hooks/DarkModeContext';

const PB = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='w-full dark:bg-gray-900'>
        <div className='w-screen h-[50vh] relative'>
          <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
          <Image className='absolute z-1 object-contain' fill src={pbimg} alt='/' />
          <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
            <h2 className='py-2'>Paweł Budnik</h2>
            <h3>Next.js</h3>
          </div>
        </div>

        <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
          <div className='col-span-4'>
            <h4 className='uppercase text-[#0071C5]'>Project</h4>
            <h2 className='py-6 dark:text-gray-300'>Overview</h2>
            <p className='pb-4 dark:text-gray-300'>
              This is the website you&#39;re currently on.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              Feel free to explore the code for this website and if you have any questions or suggestions, please do let me know.
            </p>
            <a href='https://github.com/pawelbudnik/pawelbudnik/' target='_blank' rel='noreferrer'>
              <button className='px-8 py-2 mt-4 mr-8 dark:shadow-gray-700'>Code</button>
            </a>
            <a href='https://pawelbudnik.com/' target='_blank' rel='noreferrer'>
              <button className='px-8 py-2 mt-4 dark:shadow-gray-700'>Website</button>
            </a>
          </div>
          <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-400 dark:shadow-gray-700 rounded-xl py-4'>
            <div className='p-2'>
              <p className='text-center font-bold pb-2 dark:text-gray-300'>Technologies Used</p>
              <div className='p-4  grid grid-cols-3 md:grid-cols-1'>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> React
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Next.js
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> JavaScript
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> TypeScript
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Tailwind CSS
                </p>
              </div>
            </div>
          </div>
          <Link href='/#projects'>
            <p className='underline cursor-pointer dark:text-gray-300'>Back</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PB;