'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ReactNode } from "react";
import Sidebar1 from "./Sidebar1";
import {FaBell, FaUserCircle, FaChevronDown} from 'react-icons/fa';
import ToggleSwitch from '@/components/ToggleSwitch';
import { useTheme } from '@/context/ThemeContext';
import { FaSignOutAlt } from "react-icons/fa";




interface Props {
    children: ReactNode | ReactNode [];
}
export default function BaseLayout1({ children }: Props) {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSignOut = async () => {
    try {
      // Call the signout API
      await fetch('http://localhost:5001/signout', {
        method: 'POST',
        credentials: 'include', // If you're using cookies
      });

      // Clear all auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userInfo');
      
      // Redirect to login page
      router.push('/');
    } catch (error) {
      console.error('Signout failed:', error);
      // Optionally handle the error (show message to user, etc.)
    }
  };

    return (
    <div className={`layout bg-[#EDEDED] ${darkMode ? 'bg-[#1f222a] text-white' : 'bg-white text-gray-800'}`}>
        <Sidebar1 />
        
        {children}
        {/* <div className="flex items-center justify-end -mt-[800px]">
            <ToggleSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button className={`bg-gray-200 p-2 rounded-full shadow ${darkMode ? 'bg-[#1f222a] text-white' : 'bg-white text-gray-800'}`}>
              <FaBell />
            </button>
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-2xl" />
              <span>Harsh</span>
              <button className={`bg-gray-200 p-2 rounded-full shadow ${darkMode ? 'bg-[#1f222a] text-white' : 'bg-white text-gray-800'}`}>
                <FaChevronDown />
              </button>
              <button
              type="submit"
              className="w-full py-3"
              onClick={handleSignOut}
            >
              <FaSignOutAlt />
            </button>
            </div>
        </div> */}
    </div>
    ) ;
}