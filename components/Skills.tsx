import React from 'react';
import SkillTags from './SkillTags';

const Skills = () => {
  const skillArray = ['html', 'css', 'javascript', 'react', 'tailwind', 'github', 'shopify', 'nextjs', 'node', 'php', 'laravel', 'sql'];
  const skillComponents = skillArray.map(( skill, index ) => (
    <SkillTags key={index} skill={skill} />
  ));

  return (
    <div id='skills' className='w-full lg:h-screen p-2 dark:text-gray-300'>
      <div className='max-w-[1240px] mx-auto flex flex-col justify-center h-full'>
        <p className='text-xl tracking-widest uppercase text-[#0071C5]'>Experience</p>
        <h2 className='py-4'>What Are Some of My Skills</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {skillComponents}
        </div>
      </div>
    </div>
  );
}

export default Skills;