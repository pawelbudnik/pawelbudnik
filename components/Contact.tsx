import Link from 'next/link';
import React, { useRef } from 'react';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';
import LinkedinIcon from './media_icons/LinkedinIcon';
import GithubIcon from './media_icons/GithubIcon';
import EmailIcon from './media_icons/EmailIcon';
import ResumeIcon from './media_icons/ResumeIcon';
import emailjs from 'emailjs-com';
import Image from 'next/image';

const Contact = (): JSX.Element => {
  const form = useRef();
  const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_KEY;

  const sendEmail = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then((result) => {
          alert('Message sent Successfully!');
          console.log(result.text);
      }, (error) => {
          alert('Message could not be sent :(');
          console.log(error.text);
      });
  };
  
  return (
    // contact div used to have "lg:h-screen" parameter instead of "h-full" but it was introducing a grey break point on laptop screen.
    <div id='contact' className='w-full h-full'> 
      <div className='dark:bg-gray-900'>

        <div className='max-w-[1240px] m-auto px-2 py-16 w-full'>
          <p className='text-xl tracking-widest uppercase text-[#0071C5]'>
            Contact
          </p>
          <h2 className='py-4 dark:text-gray-300'>Get in touch</h2>
          <div className='grid lg:grid-cols-5 gap-8'>

            {/* left */}
            <div className='col-span-3 lg:col-span-2 w-full h-full shadow-xl shadow-gray-400 dark:shadow-gray-700 rounded-xl p-4'>
              <div className='lg:p-4 h-full'>
                <div>
                  
                  <Image className='rounded-xl hover:scale-105 easie-in duration-100' src='/assets/img/contact_img.avif' alt='' width={420} height={250}/>
                </div>
                <div>
                  <h2 className='py-6 dark:text-gray-300'>Paweł Budnik</h2>
                  <p className='text-[#0071C5]'>Full-Stack Developer</p>
                  <p className='pt-6 dark:text-gray-300'>I am available for freelance projects or full-time positions. Contact me and let&#39;s have a chat.</p>
                </div>
                <div>
                  <p className='uppercase py-10 text-[#0071C5]'>Connect With Me</p>
                  <div className='flex items-center justify-between py-4'>
                    <LinkedinIcon />
                    <GithubIcon />
                    <EmailIcon />
                    <ResumeIcon />
                  </div>
                </div>
              </div>
            </div>
            
            {/* right */}
            <div className='col-span-3 w-full h-auto shadow-xl shadow-gray-400 dark:shadow-gray-700 roudned-xl lg:p-4'>
              <div className='p-4'>
                <form ref={form} onSubmit={sendEmail}>
                  <div className='grid md:grid-cols-2 gap-4 w-full py-2'>
                    <div className='flex flex-col'>
                      <label className='uppercase text-sm py-2 dark:text-gray-300'>Name</label>
                      <input className='border-2 rounded-lg p-3 flex border-gray-300' type='text' name='user_name' />
                    </div>
                    <div className='flex flex-col'>
                      <label className='uppercase text-sm py-2 dark:text-gray-300'>Phone Number</label>
                      <input className='border-2 rounded-lg p-3 flex border-gray-300' type='text' name='user_phone' />
                    </div>
                  </div>
                  <div className='flex flex-col py-2'>
                    <label className='uppercase text-sm py-2 dark:text-gray-300'>Email</label>
                    <input className='border-2 rounded-lg p-3 flex border-gray-300' type='email' name='user_email' />
                  </div>
                  <div className='flex flex-col py-2'>
                    <label className='uppercase text-sm py-2 dark:text-gray-300'>Subject</label>
                    <input className='border-2 rounded-lg p-3 flex border-gray-300' type='text' name='subject' />
                  </div>
                  <div className='flex flex-col py-2'>
                    <label className='uppercase text-sm py-2 dark:text-gray-300'>Message</label>
                    <textarea className='border-2 rounded-lg p-3 border-gray-300' rows={10} name='message'></textarea>
                  </div>
                  <button type='submit' className='w-full p-4 text-gray-100 mt-4 dark:shadow-gray-700 bg-blue-500 hover:bg-blue-600 transition-colors duration-100 ease-in-out'>Send Message</button>
                </form>
              </div>
            </div>
          </div>
          <div className='flex justify-center py-12'>
            <Link href='/'>
              <div className='rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-700 p-4 cursor-pointer hover:scale-110 ease-in duration-100'>
                <HiOutlineChevronDoubleUp className='text-[#0071C5]' size={30}/>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;