import React from 'react';
import Link from 'next/link';
import { BsFillPersonLinesFill } from 'react-icons/bs';

function ResumeIcon(): JSX.Element {
  return (
    <Link href="/#resume">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100 ">
        <BsFillPersonLinesFill className='dark:fill-gray-300'/>
      </div>
    </Link>
  );
}

export default ResumeIcon