import React from 'react';
import SkillTags from './SkillTags';

const Skills = () => {
  const skillsObject = [
    {name: 'HTML', url: 'html.png', url_dark: 'html.png'},
    {name: 'CSS', url: 'css.png', url_dark: 'css.png'},
    {name: 'JavaScript', url: 'javascript.png', url_dark: 'javascript.png'},
    {name: 'React', url: 'react.png', url_dark: 'react.png'},
    {name: 'Tailwind CSS', url: 'tailwind.png', url_dark: 'tailwind.png'},
    {name: 'GitHub', url: 'github.png', url_dark: 'github_dark.png'},
    {name: 'Shopify', url: 'shopify.png', url_dark: 'shopify.png'},
    {name: 'Next.js', url: 'nextjs.png', url_dark: 'nextjs_dark.png'},
    {name: 'Node.js', url: 'node.png', url_dark: 'node.png'},
    {name: 'PHP', url: 'php.png', url_dark: 'php.png'},
    {name: 'Laravel', url: 'laravel.png', url_dark: 'laravel.png'},
    {name: 'MySQL', url: 'mysql.png', url_dark: 'mysql.png'},
  ]
   
  const skillComponents = skillsObject.map(( skill, index ) => (
    <SkillTags key={index} skill={skill} />
  ));

  return (
    <div id='skills' className='w-full lg:h-screen p-2 dark:text-gray-300'>
      <div className='max-w-[1240px] mx-auto flex flex-col justify-center h-full'>
        <p className='text-xl tracking-widest uppercase text-[#0071C5]'>Experience</p>
        <h2 className='py-4'>What are some of my skills</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {skillComponents}
        </div>
      </div>
    </div>
  );
}

export default Skills;