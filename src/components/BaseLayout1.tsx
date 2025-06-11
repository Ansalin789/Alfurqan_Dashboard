'use client';

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname} from "next/navigation";
import { RiDashboardFill } from 'react-icons/ri';
import {  MdOutlineCalendarToday } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { FaBookOpenReader } from 'react-icons/fa6';
import { LuMessagesSquare } from 'react-icons/lu';
import { Users, CircleHelp } from 'lucide-react';

interface Props {
  readonly children: ReactNode | ReactNode[];
}

const SidebarItems = [
  {
    name: 'Dashboard',
    href: '/academic-coach/ui/dashboard',
    icon: RiDashboardFill,
  },
  {
    name: 'Trail Management',
    href: '/academic-coach/ui/trail',
    icon: Users, 
  },
  {
    name: 'Manage Students',
    href: '/academic-coach/ui/students',
    icon: PiStudent,
  },
  {
    name: 'Manage Teachers',
    href: '/academic-coach/ui/teachers',
    icon: FaBookOpenReader,
  },
  {
    name: 'Schedule',
    href: '/academic-coach/ui/schedule',
    icon: MdOutlineCalendarToday,
  },
  {
    name: 'Messages',
    href: '/academic-coach/ui/messages',
    icon: LuMessagesSquare,
  },
  {
    name: 'Support',
    href: '/academic-coach/ui/support',
    icon: CircleHelp,
  }
];

function Sidebar3() {
  const pathname = usePathname();

  return (
   <div className="sidebar__wrapper bg-[#012A4A] dark:bg-[#1D1D1D] p-4 h-full w-full max-w-full overflow-y-auto flex flex-col">
  
  {/* Logo Section */}
  <div className='flex items-center gap-2 mt-5 mb-6 px-2'>
    <Image
      src="/assets/images/alfwhite.png"
      width={40}
      height={40}
      className='w-10 h-10 object-contain'
      alt='logo'
    />
    <div className="text-white leading-tight">
      <h3 className="font-bold text-[18px] sm:text-[20px] xl:text-[22px]">AL FURQAN</h3>
      <h4 className="font-light text-[14px] sm:text-[15px] xl:text-[16px] font-sans">academy</h4>
    </div>
  </div>

  {/* Menu List */}
  <ul className="space-y-2 flex-1">
    {SidebarItems.map(({ name, href, icon: Icon }) => (
      <li key={name}>
        <Link href={href} className="block no-underline">
          <button
            className={`w-full flex items-center gap-3 px-3 py-3
              text-[13px] sm:text-[14px] xl:text-[15px]
              cursor-pointer rounded transition-colors duration-200
              ${pathname === href
                ? 'text-white font-medium bg-[#576CBC]'
                : 'text-[#818790] hover:text-[#a0c4ff]'}
            `}
          >
            <span className="text-[18px] w-5 flex justify-center">
              <Icon size={20} />
            </span>
            <span className="flex-1 text-left">{name}</span>
          </button>
        </Link>
      </li>
    ))}
  </ul>
</div>
  );
}

export default function BaseLayout3({ children }: Props) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const dpi = window.devicePixelRatio;
    if (dpi === 1.25) setScale(0.99);
    else if (dpi === 1.5) setScale(0.985);
    else if (dpi === 1.75) setScale(0.96);
    else if (dpi === 2) setScale(0.94);
    else setScale(1);
  }, []);
 
  const inverseScale = 1 / scale;
  

 return (
  <div
    style={{
      width: `100vw`,
      height: `100vh`,
      overflow: "hidden",
    }}
    className="bg-[#E4E7F4] dark:bg-[#252525] text-black dark:text-white"
  >
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${100 * inverseScale}vw`,
        height: `${100 * inverseScale}vh`,
      }}
      className="grid grid-cols-1 md:grid-cols-[240px_1fr] transition-all"
    >
      {/* Sidebar */}
      <div className="hidden md:block min-h-screen bg-[#012A4A] dark:bg-[#001E34] overflow-y-auto">
        <Sidebar3 />
      </div>

      {/* Main Content */}
      <div className="overflow-y-auto py-2 px-4 scrollbar-none h-screen">
        {children}
      </div>
    </div>
  </div>
);

}
