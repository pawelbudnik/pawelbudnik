import React, { useContext } from 'react'
import cageminder from '../public/assets/projects/cageminder_logo.jpg';
import treasurydelta from '../public/assets/projects/td_logo.png';
import vast from '../public/assets/projects/vast_logo.png';
import vast_tr from '../public/assets/projects/vast_logo_tr.png';
import pbimg from '../public/assets/apple-touch-icon.png';
import ProjectItem from './ProjectItem';
import DarkModeContext from '../hooks/DarkModeContext';

const Projects = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div id='projects' className='w-full'>
      <div className='max-w-[1240px] mx-auto px-2 py-16'>
        <p className='text-xl tracking-widest uppercase text-[#0071C5]'>Projects</p>
        <h2 className='py-4 dark:text-gray-300'>What I&apos;ve Built</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <ProjectItem title='Cageminder' backgroundImg={cageminder} tech='React JS' projectUrl='/Cageminder'/>
          <ProjectItem title='Treasury Delta' backgroundImg={treasurydelta} tech='Laravel' projectUrl='/TreasuryDelta'/>
          <ProjectItem title='Vast' backgroundImg={darkMode ? vast_tr : vast} tech='Next.js' projectUrl='/Vast'/>
          <ProjectItem title='This Website' backgroundImg={pbimg} tech='Next.js' projectUrl='/PB'/>
        </div>
      </div>
    </div>
  );
}

export default Projects;