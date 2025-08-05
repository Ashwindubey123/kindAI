 import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-600 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-300 pb-10">
        <div className="md:max-w-96">
          <img
             className='h-9' src={assets.logo} alt='logo'
          />
          <p className="mt-6 text-sm">
            Experience the power of AI <br/>
        Transform your conetent creation woth pur suit of premium AI tools
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://www.shutterstock.com/image-vector/smiling-emoji-enjoy-sign-vector-260nw-2227696901.jpg"
              alt="google play"
              className="h-20 w-auto border border-gray-400 rounded"
            />
            
          </div>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p> knight@420@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm text-gray-500 pb-5">
        © {new Date().getFullYear()} <a href="https://prebuiltui.com" className="underline">PrebuiltUI</a>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
