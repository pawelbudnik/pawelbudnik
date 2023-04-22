import React, { useContext } from 'react';
import Image from 'next/image';
import DarkModeContext from '../hooks/DarkModeContext';

const SkillTags = ({ skill }) => {
  const { darkMode } = useContext(DarkModeContext);
  
  let darkText = '.png';
  if(skill === 'nextjs' || skill === 'github') {
    darkText = darkMode ? '_dark.png' : '.png';
  }

  return (
    <div className='grid p-6 shadow-xl dark:shadow-gray-700 dark:shadow-md rounded-xl hover:scale-105 ease-in duration-100'>
      <div className='grid grid-cols-2 gap-4 justify-center items-center'>
        <div className='m-auto'>
          <Image src={`/../public/assets/skills/${skill}${darkText}`} width={64} height={64} alt='/' />
        </div>
        <div className='flex fexl-col items-center justify-center'>
          <h3>{skill.toUpperCase()}</h3>
        </div>
      </div>
    </div>
  );
}

export default SkillTags;