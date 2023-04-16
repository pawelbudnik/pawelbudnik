import React from 'react'
import { FaLinkedinIn } from 'react-icons/fa'

function LinkedinIcon() {
  return (
    <a href='https://www.linkedin.com/in/pawel-budnik' target='blank' rel="noreferrer">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
        <FaLinkedinIn />
      </div>
    </a>
  )
}

export default LinkedinIcon