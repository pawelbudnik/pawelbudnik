import React from 'react'
import { FaGithub } from 'react-icons/fa'

function GithubIcon() {
  return (
    <a href='https://github.com/pawelbudnik' target='blank' rel="noreferrer">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-300">
        <FaGithub />
      </div>
    </a>
  )
}

export default GithubIcon