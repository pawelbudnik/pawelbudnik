import React from 'react'
import Image from 'next/image'

const SkillTags = ({ skill }) => {
  return (
    <div className='p-6 shadow-xl rounded-xl hover:scale-105 ease-in duration-100'>
      <div className='grid grid-cols-2 gap-4 justify-center items-center'>
        <div className='m-auto'>
          <Image src={`/../public/assets/skills/${skill}.png`} width={64} height={64} alt='/' />
        </div>
        <div className='flex fexl-col items-center justify-center'>
          <h3>{skill.toUpperCase()}</h3>
        </div>
      </div>
    </div>
  )
}

export default SkillTags