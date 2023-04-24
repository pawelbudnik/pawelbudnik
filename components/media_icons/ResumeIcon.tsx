import React from 'react';
import Link from 'next/link';
import { BsFillPersonLinesFill } from 'react-icons/bs';

function ResumeIcon(): JSX.Element {
  return (
    <a href="/resume/Resume-Pawel-Budnik.pdf" download>
      <div className="relative rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100 ">
        <BsFillPersonLinesFill className='dark:fill-gray-300 hover:text'/>
          <span className="absolute bottom-0 left-0 right-0 text-center text-sm font-bold dark:text-gray-300 rounded-b-full py-2 opacity-0 hover:opacity-100">
            CV
          </span>
      </div>
    </a>
  );
}

export default ResumeIcon