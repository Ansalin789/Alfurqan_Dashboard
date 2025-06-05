'use client';

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

import { RiDashboardFill } from "react-icons/ri";
import { MdContactSupport, MdAssignment } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaBookOpenReader } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";

import "@/styles/globals.css";

const SidebarItems = [
  {
    name: 'Dashboard',
    href: '/supervisor/ui/dashboard',
    icon: RiDashboardFill,
  },
  {
    name: 'Recruitment',
    href: '/supervisor/ui/recruitment',
    icon: IoPeopleSharp,
  },
  {
    name: 'Meeting & Training',
    href: '/supervisor/ui/meetingandtraining',
    icon: MdAssignment,
  },
  {
    name: 'Teachers',
    href: '/supervisor/ui/teachers',
    icon: FaBookOpenReader,
  },
  {
    name: 'Messages',
    href: '/supervisor/ui/message',
    icon: LuMessagesSquare,
  },
  {
    name: 'Support',
    href: '/supervisor/ui/support',
    icon: MdContactSupport,
  }
];

export default function Sidebar3() {
  const currentPath = usePathname();

  return (
    <div className="sidebar__wrapper bg-[#012A4A] dark:bg-[#1D1D1D] h-full overflow-y-auto">
      <aside className="sidebar bg-[#012A4A] dark:bg-[#1D1D1D] p-4 h-full flex flex-col">
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
            <h3 className="font-bold text-[18px]">AL FURQAN</h3>
            <h4 className="font-light text-[14px] font-sans">academy</h4>
          </div>
        </div>

        {/* Menu List */}
        <ul className="space-y-1.5 flex-1">
          {SidebarItems.map(({ name, href, icon: Icon }) => (
            <li key={name}>
              <Link href={href} className="block no-underline">
                <button
                  className={`
                    w-full flex items-center gap-3 px-3 py-3
                    text-[13px] cursor-pointer rounded
                    ${currentPath === href
                      ? 'text-white font-medium bg-[#576CBC]'
                      : 'text-[#818790] hover:text-[#a0c4ff]'}
                    transition-colors duration-200
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
      </aside>
    </div>
  );
}
