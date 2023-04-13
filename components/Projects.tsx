import React from 'react'
import propertyImg from '../public/assets/projects/property.jpg'
import cryptoImg from '../public/assets/projects/crypto.jpg'
import netflixImg from '../public/assets/projects/netflix.jpg'
import twitchImg from '../public/assets/projects/twitch.jpg'
import ProjectItem from './ProjectItem'

const Projects = () => {
  return (
    <div className='w-full'>
      <div className='max-w-[1240px] mx-auto px-2 py-16'>
        <p className='text-xl tracking-widest uppercase text-[#5651e5]'>Projects</p>
        <h2 py-4>What I&apos;ve Built</h2>
        <div className='grid md:grid-cols-2 gap-8'>

          <ProjectItem title='Treasury Delta' backgroundImg={propertyImg} projectUrl='/property' />
          <ProjectItem title='Cageminder' backgroundImg={cryptoImg} projectUrl='/property' />
          <ProjectItem title='Treasury Delta' backgroundImg={netflixImg} projectUrl='/property' />
          <ProjectItem title='Treasury Delta' backgroundImg={twitchImg} projectUrl='/property' />

        </div>
      </div>
    </div>
  )
}

export default Projects