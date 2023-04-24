import React from 'react';
import { FaGithub } from 'react-icons/fa';

function GithubIcon(): JSX.Element {
  return (
    <a href='https://github.com/pawelbudnik' target='blank' rel="noreferrer">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
        <FaGithub className='dark:fill-gray-300'/>
      </div>
    </a>
  );
}

export default GithubIcon;