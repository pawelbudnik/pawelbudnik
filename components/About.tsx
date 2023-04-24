import Link from 'next/link';
import React from 'react';

const About = (): JSX.Element => {
  return (
    <div id='about' className='w-full md:h-screen p-2 flex items-center py-16'>
      <div className='max-w-[1240px] m-auto md:grid grid-cols-3 gap-8'>
        <div className='col-span-2'>
          <h2 className='py-4 tracking-widest uppercase text-[#0071C5]'>About Me</h2>
          <p className='py-2 text-gray-600 dark:text-gray-400'>
            Hi there! My name is Paweł Budnik, and Im a full-stack software developer with 8 years of experience in developing large applications and proprietary software. Throughout my career, I&#39;ve had the opportunity to work on a variety of projects, including tech support, creating Shopify stores, and collaborating on open-source projects.
          </p>

          <p className='py-2 text-gray-600 dark:text-gray-400'>
            My primary focus is on building high-quality applications that meet the needs of my clients and end-users. I specialize in working with JavaScript, React, TypeScript, Node.js, Laravel, PHP, and MySQL, but I&#39;m always eager to learn new technologies and expand my skillset.
          </p>

          <p className='py-2 text-gray-600 dark:text-gray-400'>
            Whether you&#39;re looking for a reliable developer to build your next application or you just want to chat about technology, I&#39;m always up for a conversation. Let&#39;s connect and see how I can help bring your ideas to life!
          </p>
          <div className='py-2'>
            <Link href='/#projects' className='text-gray-600 dark:text-gray-400 underline cursor-pointer'>Check out some of my latest projects.</Link>
          </div>
        </div>
        <div className='w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-100'>
          <img className='rounded-xl' src="https://images.unsplash.com/photo-1624996752380-8ec242e0f85d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVsbCUyMHN0YWNrJTIwZGV2ZWxvcGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="stock photo" />
        </div>
      </div>
    </div>
  );
}

export default About;