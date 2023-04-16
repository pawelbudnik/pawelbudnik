import Link from 'next/link'
import React from 'react'
import { BsFillPersonLinesFill } from 'react-icons/bs'

function ResumeIcon() {
  return (
    <Link href="/#resume">
      <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100 ">
        <BsFillPersonLinesFill />
      </div>
    </Link>
  )
}

export default ResumeIcon