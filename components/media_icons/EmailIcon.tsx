import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';

function EmailIcon(): JSX.Element {
  return (
    <a href="mailto:pawelbudnik@gmail.com">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
        <AiOutlineMail className='dark:fill-gray-300'/>
      </div>
    </a>
  );
}

export default EmailIcon;
