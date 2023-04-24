import React, { useContext } from 'react';
import Image from 'next/image';
import vastimg from '../public/assets/projects/vast_bg.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import DarkModeContext from '../hooks/DarkModeContext';

const Vast = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='w-full dark:bg-gray-900'>
        <div className='w-screen h-[50vh] relative'>
          <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
          <Image className='absolute z-1 object-contain' fill src={vastimg} alt='/' />
          <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
            <h2 className='py-2'>Vast.ch</h2>
            <h3>Next.js</h3>
          </div>
        </div>

        <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
          <div className='col-span-4'>
            <h4 className='uppercase text-[#0071C5]'>Project</h4>
            <h2 className='py-6 dark:text-gray-300'>Overview</h2>
            <p className='pb-4 dark:text-gray-300'>
              Vast is a dynamic and eco-conscious adventure company that offers thrilling packages mainly focused around paragliding.
            </p>
            <p className='pb-4 dark:text-gray-300'>
               Their website is a great reflection of their values and the quality of services they offer. As a member of the development team, I had the privilege of contributing to this project by fixing some bugs and redesigning some of the website components.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              Overall, the Vast website is a fantastic example of how a website can successfully convey a company&#39;s values and offerings to its users. As a developer, I am proud to have contributed to the creation of a user-friendly, efficient, and eco-conscious website that helps Vast&#39;s customers to plan their adventure packages while keeping the environment in mind.
            </p>
            <a href='https://github.com/vast-ch/' target='_blank' rel='noreferrer'>
              <button className='px-8 py-2 mt-4 mr-8 dark:shadow-gray-700'>Code</button>
            </a>
            <a href='https://vast.ch/' target='_blank' rel='noreferrer'>
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
                  <RiRadioButtonFill className='pr-1' /> Redux
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> GraphQL
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Figma
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Stripe
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

export default Vast;