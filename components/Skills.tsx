import React from 'react'
import SkillTags from './SkillTags'

const Skills = () => {
  return (
    <div className='w-full lg:h-screen p-2'>
      <div className='max-w-[1240px] mx-auto flex flex-col justify-center h-full'>
        <p className='text-xl tracking-widest uppercase text-[#5651e5]'>Skills</p>
        <h2 className='py-4'>What I Can Do</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>

          <SkillTags skill={'html'}/>
          <SkillTags skill={'css'}/>
          <SkillTags skill={'javascript'}/>
          <SkillTags skill={'react'}/>
          <SkillTags skill={'tailwind'}/>
          <SkillTags skill={'github'}/>
          <SkillTags skill={'shopify'}/>
          <SkillTags skill={'nextjs'}/>
          <SkillTags skill={'node'}/>
          

        </div>
      </div>
    </div>
  )
}

export default Skills