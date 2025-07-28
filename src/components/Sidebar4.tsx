'use client';

import Image from "next/image";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdBookmarks, MdAnalytics } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { PiBookOpenFill } from "react-icons/pi";
import { IoMdSettings, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";

const SidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin-main/ui/dashboard',
    icon: RiDashboardFill,
  },
  {
    name: 'Evaluation',
    href: '#',
    icon: MdBookmarks,
    subItems: [
      { name: 'Trail Class', href: '/admin-main/ui/evaluations' },
      { name: 'Scheduled Trail class', href: '/admin-main/ui/trailmanagement' },
    ],
  },
  { name: 'Manage Students', href: '/admin-main/ui/student', icon: '/assets/images/ll.svg' },
  { name: 'Manage Employees', href: '/admin-main/ui/employees', icon: '/assets/images/bc.svg' },
  { name: 'Courses', href: '/admin-main/ui/courses', icon: PiBookOpenFill },
  {
    name: 'Schedule',
    href: '#',
    icon: '/assets/images/ChalkboardTeacher.svg',
    subItems: [
      { name: 'Meeting', href: '/admin-main/ui/meeting' },
      { name: 'Classes', href: '/admin-main/ui/classes' },
    ],
  },
  {
    name: 'Finance',
    href: '#',
    icon: '/assets/images/ChartLineUp.svg',
    subItems: [
      { name: 'Invoice', href: '/admin-main/ui/Invoice' },
      { name: 'Salary and Wages', href: '/admin-main/ui/salaryandwages' },
      { name: 'Expenses', href: '/admin-main/ui/expenses' },
    ],
  },
  { name: 'Analytics', href: '/admin-main/ui/analytics', icon: MdAnalytics },
  { name: 'Messages', href: '/admin-main/ui/messagess', icon: LuMessagesSquare },
  { name: 'Settings', href: '/admin-main/ui/settings', icon: IoMdSettings },
];

export default function Sidebar4() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const currentPath = usePathname();

  useEffect(() => {
    SidebarItems.forEach((item) => {
      if (item.subItems && item.subItems.some((sub) => currentPath === sub.href)) {
        setExpandedItem(item.name);
      }
    });
  }, [currentPath]);

  const toggleSubItems = (name: string) => {
    setExpandedItem((prev) => (prev === name ? null : name));
  };

  return (
    <div className="sidebar__wrapper bg-[#012A4A]  h-full overflow-y-auto" style={{ width: "240px" }}>
      <aside className="sidebar bg-[#012A4A] dark:bg-[#1D1D1D] p-4 h-full flex flex-col" style={{ width: "240px" }}>
        
        {/* Logo */}
        <div className='flex items-center gap-3 mt-5 mb-6 px-2'>
          <Image src="/assets/images/alfwhite.png" width={40} height={40} alt='logo' />
          <div className="text-white">
            <h3 className="font-bold text-[18px]">AL FURQAN</h3>
            <h4 className="text-[14px] font-light">academy</h4>
          </div>
        </div>

        <ul className="space-y-1.5 flex-1">
          {SidebarItems.map(({ name, href, icon: Icon, subItems }) => {
            const isParentActive = currentPath === href;
            const isChildActive = subItems?.some((sub) => currentPath === sub.href);
            const isActive = isParentActive || isChildActive;

            const ItemContent = (
              <div
                className={`w-full flex items-center gap-3 px-3 py-3 text-[16px] font-normal rounded-md transition-all duration-200
                  ${isActive ? 'bg-[#576CBC] text-white' : 'text-[#818790]'}`}
              >
                {/* Icon */}
                <span className="text-[18px] w-5 flex justify-center items-center">
                  {typeof Icon === 'string' ? (
                    <Image
                      src={Icon}
                      width={20}
                      height={20}
                      alt={name}
                      className={`dark:invert ${isActive ? 'brightness-0 invert' : ''}`}
                    />
                  ) : (
                    <Icon size={20} className={`${isActive ? 'text-white' : 'text-[#818790]'}`} />
                  )}
                </span>

                <span className="flex-1 text-left">{name}</span>

                {subItems && (
                  <span className={`${isActive ? 'text-white' : 'text-[#818790]'}`}>
                    {expandedItem === name ? <IoIosArrowDown /> : <IoIosArrowForward />}
                  </span>
                )}
              </div>
            );

            return (
              <li key={name}>
                {/* Wrap in Link if no subItems */}
                {subItems ? (
                  <button onClick={() => toggleSubItems(name)} className="w-full text-left">
                    {ItemContent}
                  </button>
                ) : (
                  <Link href={href}>
                    {ItemContent}
                  </Link>
                )}

                {/* Sub Items */}
                {subItems && expandedItem === name && (
                  <ul className="ml-10 mt-1 space-y-1.5">
                    {subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`block text-[15px] font-normal py-1.5 px-2 rounded-md
                            text-[#576CBC] hover:text-[#576CBC]`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
