import LinkedinIcon from "./media_icons/LinkedinIcon";
import GithubIcon from "./media_icons/GithubIcon";
import EmailIcon from "./media_icons/EmailIcon";
import ResumeIcon from "./media_icons/ResumeIcon";

const Main = () => {
  return (
    <div id="home" className="w-full h-screen text-center"> 
      <div className="max-w-[1240px] w-full h-full mx-auto p-2 flex justify-center items-center">
        <div>
          <p className="uppercase text-sm tracking-widest text-gray-600">All you need to know about me</p>
            <h1 className="py-4 text-gray-700">
              Hi, I&#39;m <span className="text-[#0071C5]">Paweł</span>
            </h1>
            <h1 className="py-4 text-gray-700">
              A Full-Stack Software Developer
            </h1>
            <p className="py-4 text-gray-600 max-w-[70%] m-auto">
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
  )
}

export default Main;