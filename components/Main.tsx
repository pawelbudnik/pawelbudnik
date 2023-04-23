import LinkedinIcon from "./media_icons/LinkedinIcon";
import GithubIcon from "./media_icons/GithubIcon";
import EmailIcon from "./media_icons/EmailIcon";
import ResumeIcon from "./media_icons/ResumeIcon";

const Main = () => {
  return (
    <div id="home" className="w-full h-screen text-center"> 
      <div className="max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <p className="uppercase text-sm tracking-widest text-gray-600 dark:text-gray-400">What you might want to know about me</p>
            <h1 className="py-4 text-gray-700 dark:text-gray-300">
              Hi there, I&#39;m <span className="text-[#0071C5]">Paweł</span>
            </h1>
            <h1 className="py-4 text-gray-700 dark:text-gray-300">
              A Full-Stack Software Developer.
            </h1>
            <p className="py-4 text-gray-600 dark:text-gray-400 max-w-[70%] m-auto">
              I&#39;m a Developer with a passion for creating elegant and user-friendly applications. With <span className="text-[#0071C5] text-lg">8</span> years of experience under my belt, I specialize in building scalable solutions that deliver value to my clients and users alike.
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