import React, { useContext } from 'react';
import Image from 'next/image';
import cageminderimg from '../public/assets/projects/cageminder_bg.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import DarkModeContext from '../hooks/DarkModeContext';

const Cageminder = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className='w-full dark:bg-gray-900'>
        <div className='w-screen h-[50vh] relative'>
          <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
          <Image className='absolute z-1 object-cover' fill src={cageminderimg} alt='/' />
          <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
            <h2 className='py-2'>CageMinder</h2>
            <h3>React JS</h3>
          </div>
        </div>

        <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
          <div className='col-span-4'>
            <h4 className='uppercase text-[#0071C5]'>Project</h4>
            <h2 className='py-6 dark:text-gray-300'>Overview</h2>
            <p className='pb-4 dark:text-gray-300'>
              CageMinder is an ERP application designed to streamline data gathering, CRUD operations, worker time management, and report production. It also provides users with the ability to register new products via handheld devices.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              It replaced an older version of similar system as the design is clearer, more accessible via mobile devices and more responsive.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              I was hired as a solo developer and had the responsibility of designing, building, hosting and securing this platform on my own. It connects to a remote database and uses various APIs to send data to external servers, which enables it to perform various tasks such as product registration or time management.
            </p>
            <p className='pb-4 dark:text-gray-300'>
              Unfortunately, I am unable to provide access to the code or a demo version of the application due to data protection regulations and client confidentiality agreements. However, I am happy to discuss the technical aspects of the project and share my experience working on it.
            </p>
          </div>
          <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-400 dark:shadow-gray-700 rounded-xl py-4'>
            <div className='p-2'>
              <p className='text-center font-bold pb-2 dark:text-gray-300'>Technologies Used</p>
              <div className='p-4  grid grid-cols-3 md:grid-cols-1'>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> React
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Javascript
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> MySQL
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Sequelize
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> NodeJS
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> Core UI
                </p>
                <p className='text-gray-600 dark:text-gray-300 py-2 flex items-center'>
                  <RiRadioButtonFill className='pr-1' /> MUI
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

export default Cageminder;