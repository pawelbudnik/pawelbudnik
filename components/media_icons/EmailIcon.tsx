import React from 'react'
import { AiOutlineMail } from 'react-icons/ai'

function EmailIcon() {
  return (
    <a href="mailto:pawelbudnik@gmail.com">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300">
        <AiOutlineMail />
      </div>
    </a>
  )
}

export default EmailIcon