'use client'

import { ReactNode } from "react";
import Sidebar1 from "@/components/Sidebar1";




interface Props {
    children: ReactNode | ReactNode [];
}
export default function BaseLayout1({ children }: Readonly<Props>) {

    return (
    <div className={`layout bg-[#EDEDED]`}>
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