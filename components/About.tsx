import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <div className='w-full md:h-screen p-2 flex items-center py-16'>
      <div className='max-w-[1240px] m-auto md:grid grid-cols-3 gap-8'>
        <div className='col-span-2'>
          <p className='uppercase tex-xl tracking-widest text-[#5651e5'>About</p>
          <h2 className='py-4'>Who I Am</h2>
          <p className='py-2 text-gray-600'>I am not your normal developer</p>
          <p className='py-2 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus fuga suscipit est quo! Earum officiis voluptate incidunt, nesciunt animi nam accusantium. Tempora inventore beatae nobis laudantium natus? Voluptatibus, error sequi!
          </p>
          <p className='py-2 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus fuga suscipit est quo! Earum officiis voluptate incidunt, nesciunt animi nam accusantium. Tempora inventore beatae nobis laudantium natus? Voluptatibus, error sequi!
          </p>
          <p className='py-2 text-gray-600 underline cursor-pointer'>Check out some of my latest projects.</p>
        </div>
        <div className='w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-200'>
          <img className='rounded-xl' src="https://images.unsplash.com/photo-1661956600684-97d3a4320e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="stock photo" />
        </div>
      </div>
    </div>
  )
}

export default About