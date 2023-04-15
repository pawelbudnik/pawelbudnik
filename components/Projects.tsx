import React from 'react'
import propertyImg from '../public/assets/projects/property.jpg'
import cryptoImg from '../public/assets/projects/crypto.jpg'
import netflixImg from '../public/assets/projects/netflix.jpg'
import twitchImg from '../public/assets/projects/twitch.jpg'
import ProjectItem from './ProjectItem'

const Projects = () => {
  return (
    <div id='projects' className='w-full'>
      <div className='max-w-[1240px] mx-auto px-2 py-16'>
        <p className='text-xl tracking-widest uppercase text-[#0071C5]'>Projects</p>
        <h2 className='py-4'>What I&apos;ve Built</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <ProjectItem title='Cageminder' backgroundImg={propertyImg} projectUrl='/cageminder'/>
          <ProjectItem title='Treasury Delta' backgroundImg={cryptoImg} projectUrl='/treasurydelta'/>
          <ProjectItem title='Next Project' backgroundImg={netflixImg} projectUrl='/property'/>
          <ProjectItem title='Nexter Project' backgroundImg={twitchImg} projectUrl='/property'/>
        </div>
      </div>
    </div>
  )
}

export default Projects