import LinkedinIcon from "./media_icons/LinkedinIcon";
import GithubIcon from "./media_icons/GithubIcon";
import EmailIcon from "./media_icons/EmailIcon";
import ResumeIcon from "./media_icons/ResumeIcon";

const Main = () => {
  return (
    <div id="home" className="w-full h-screen text-center"> 
      <div className="max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">

        {/* Dark mode example */}
        {/* <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
          <div>
           
          </div>
          <h3 className="text-slate-900 dark:text-white mt-5 text-base font-medium tracking-tight">Writes Upside-Down</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
          </p>
        </div> */}
        {/* Dark mode example */}

        <div>
          <p className="uppercase text-sm tracking-widest text-gray-600 dark:text-gray-400">All you need to know about me</p>
            <h1 className="py-4 text-gray-700 dark:text-gray-300">
              Hi, I&#39;m <span className="text-[#0071C5]">Paweł</span>
            </h1>
            <h1 className="py-4 text-gray-700 dark:text-gray-300">
              A Full-Stack Software Developer
            </h1>
            <p className="py-4 text-gray-600 dark:text-gray-400 max-w-[70%] m-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nostrum fugit quidem, enim, sunt sequi illum animi reiciendis quaerat totam assumenda ex numquam. Temporibus explicabo mollitia eius saepe omnis tempore.
            </p>
            <div className="flex items-center justify-between max-w-[330px] m-auto py-4">
              <LinkedinIcon />
              <GithubIcon />
              <EmailIcon />
              <ResumeIcon />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Main;