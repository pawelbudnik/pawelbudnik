import React from 'react';
import Link from 'next/link';
import { BsFillPersonLinesFill } from 'react-icons/bs';

function ResumeIcon(): JSX.Element {
  return (
    <a href="/resume/Resume-Pawel-Budnik.pdf" download>
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100 ">
        <BsFillPersonLinesFill className='dark:fill-gray-300'/>
      </div>
    </a>
  );
}

export default ResumeIcon