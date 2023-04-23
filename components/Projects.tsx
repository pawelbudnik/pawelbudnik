import React from 'react'
import cageminder from '../public/assets/projects/cageminder_logo.jpg';
import treasurydelta from '../public/assets/projects/td_logo.png';
import vast from '../public/assets/projects/vast_logo.png';
import twitchImg from '../public/assets/projects/twitch.jpg';
import ProjectItem from './ProjectItem';

const Projects = () => {
  return (
    <div id='projects' className='w-full'>
      <div className='max-w-[1240px] mx-auto px-2 py-16'>
        <p className='text-xl tracking-widest uppercase text-[#0071C5]'>Projects</p>
        <h2 className='py-4 dark:text-gray-300'>What I&apos;ve Built</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <ProjectItem title='Cageminder' backgroundImg={cageminder} tech='React JS' projectUrl='/Cageminder'/>
          <ProjectItem title='Treasury Delta' backgroundImg={treasurydelta} tech='Laravel' projectUrl='/TreasuryDelta'/>
          <ProjectItem title='Vast' backgroundImg={vast} tech='Next.js' projectUrl='/Vast'/>
          <ProjectItem title='Nexter Project' backgroundImg={twitchImg} tech='some tech here' projectUrl='/Cageminder'/>
        </div>
      </div>
    </div>
  );
}

export default Projects;