import { Footer } from "flowbite-react";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

export default function Footer2() {
  return (
    <Footer>
      <div className="w-full">
        <div className="w-full bg-white px-[3%] py-4 sm:flex sm:items-center sm:justify-between">
          <div className="text-center text-black md:text-left lg:text-lg sm:w-full">
            © 2021 SomeCompany, Inc. All rights reserved.
          </div>
          <div className="mt-4 flex justify-center space-x-6 sm:mt-0 sm:justify-center">
            <a href="#">
              <BsFacebook className="text-black h-8 w-8" />
            </a>
            <a href="#">
              <BsInstagram className="text-black h-8 w-8" />
            </a>
            <a href="#">
              <BsTwitter className="text-black h-8 w-8" />
            </a>
            <a href="#">
              <BsGithub className="text-black h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
}
