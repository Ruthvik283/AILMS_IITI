
import { Footer } from 'flowbite-react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';

export default function Footer2() {  
    return (
    <Footer bgDark>
      <div className="w-full">
        
        <div className=" w-full bg-gray-700 px-[3%] py-6 sm:flex sm:items-center sm:justify-between">
          {/* <Footer.Copyright href="#" by=" SportsLeague™" year={2023} /> */}
          <strong className="text-white">Tickets Booking</strong>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <a href="#">< BsFacebook  className='text-white h-8 w-8'/></a>
            <a href="#">< BsInstagram  className='text-white h-8 w-8'/></a>
            <a href="#">< BsTwitter  className='text-white h-8 w-8'/></a>
            <a href="https://github.com/Naren-Sai-17/stadium_booking" target='_blank'>< BsGithub  className='text-white h-8 w-8'/></a>
            {/* <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} /> 
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} /> */}
          </div>
        </div>
      </div>
    </Footer>
  );
}
