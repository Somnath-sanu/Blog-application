import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import blog from "../assests/blog5.jpg";
import {
 
  BsInstagram,
  BsTwitter,
  BsGithub,
  
} from "react-icons/bs";

function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="flex gap-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-serif text-xl drop-shadow-lg">
                BL
                <img src={blog} alt="" className="w-8 rounded-full" />GGY
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Somnath-sanu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://discord.gg/jPbRqzeF"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Somnath's blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.instagram.com/_sanu110/"
              icon={BsInstagram}
            />
            <Footer.Icon
              href="https://twitter.com/sanu7326_mishra"
              icon={BsTwitter}
            />
            <Footer.Icon
              href="https://github.com/Somnath-sanu"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterCom;
