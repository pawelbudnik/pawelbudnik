import React, { useContext } from 'react';
import Image from 'next/image';
import tdimg from '../public/assets/projects/td_bg.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import DarkModeContext from '../hooks/DarkModeContext';

const TreasuryDelta = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='w-full dark:bg-gray-900'>
        <div className='w-screen h-[50vh] relative'>
          <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
          <Image className='absolute z-1 object-contain' fill src={tdimg} alt='/' />
          <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
            <h2 className='py-2'>TreasuryDelta</h2>
            <h3>Laravel</h3>
          </div>
        </div>

        <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
          <div className='col-span-4'>
            <h4 className='uppercase text-[#0071C5]'>Project</h4>
            <h2 className='py-6 dark:text-gray-300'>Overview</h2>
            <p className='pb-4 dark:text-gray-300'>
              TreasuryDelta is a fintech application designed to revolutionize the corporate banking world.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              Treasury Delta is an innovative platform that enables corporate clients to save money on banking fees while simplifying and speeding up the RFP process. With its advanced features, such as real-time internal and external messaging, user administration, and comprehensive reporting tools, Treasury Delta streamlines the RFP process like never before.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              As a member of the development team for Treasury Delta, I was responsible for creating and implementing various features and functionalities to enhance the user experience. My contributions included developing and testing the internal and external messenger, integrating file upload/download capabilities, and optimizing the user administration system with it&#39;s various roles and rights.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              Unfortunately, I am unable to provide access to the code or a demo version of the application due to data protection regulations and client confidentiality agreements. However, I am happy to discuss the technical aspects of the project and share my experience working on it.
            </p>
            <a href='https://treasurydelta.com/' target='_blank' rel='noreferrer'>
              <button className='px-8 py-2 mt-4 mr-8 dark:shadow-gray-700'>Landing Page</button>
            </a>
            {/* <a href='https://property-finder-development.web.app/' target='_blank' rel='noreferrer'>
              <button disabled className='px-8 py-2 mt-4 dark:shadow-gray-700'>Demo</button>
            </a> */}
          </div>
          <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-400 dark:shadow-gray-700 rounded-xl py-4'>
            <div className='p-2'>
              <p className='text-center font-bold pb-2 dark:text-gray-300'>Technologies Used</p>
              <div className='p-4  grid grid-cols-3 md:grid-cols-1'>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Laravel
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> PHP
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> JavaScript
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> JQUery
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> MySQL
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Composer
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Symphony
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

export default TreasuryDelta;