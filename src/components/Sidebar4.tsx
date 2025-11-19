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
  { name: 'Manage Students', href: '/admin-main/ui/student', icon: '/assets/images/local-library.png' },
  { name: 'Manage Employees', href: '/admin-main/ui/employees', icon: '/assets/images/business-center.png' },
  { name: 'Learning management', href: '/admin-main/ui/courses', icon: PiBookOpenFill },
  {
    name: 'Schedules',
    href: '#',
    icon: '/assets/images/ChalkboardTeacher.png',
    subItems: [
      { name: 'Classes', href: '/admin-main/ui/classes' },
      { name: 'Meeting', href: '/admin-main/ui/meeting' },
    ],
  },
  {
    name: 'Finance',
    href: '#',
    icon: '/assets/images/ChartLineUp.png',
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

  // Define filter styles
  const iconFilters = {
    active: 'brightness(0) invert(1)',
    inactive: 'brightness(0) saturate(100%) invert(67%) sepia(6%) saturate(422%) hue-rotate(185deg) brightness(89%) contrast(86%)',
    hover: 'brightness(0) saturate(100%) invert(83%) sepia(12%) saturate(1032%) hue-rotate(185deg) brightness(105%) contrast(96%)'
  };

  return (
    <div className="sidebar__wrapper h-full overflow-y-auto" style={{ width: "240px" }}>
      <aside className="sidebar !bg-[#012A4A] dark:!bg-[#1D1D1D] p-4 h-full flex flex-col" style={{ width: "240px", backgroundColor: "#012A4A !important" }}>
        
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
                className={`group w-full flex items-center gap-3 px-3 py-3 text-[16px] font-normal rounded-md transition-all duration-200
                  ${isActive 
                    ? 'bg-[#576CBC] text-white hover:bg-[#6b80d6]' 
                    : 'text-[#818790] hover:text-[#a0c4ff]'}`}
              >
                {/* Icon - Consistent handling for both PNG and React Icons */}
                <span className={`text-[18px] w-5 flex justify-center items-center 
                  ${isActive ? 'text-white' : 'text-[#818790] group-hover:text-[#a0c4ff]'}`}>
                  {typeof Icon === 'string' ? (
                    <div className="relative w-5 h-5">
                      <Image
                        src={Icon}
                        fill
                        alt={name}
                        className="object-contain"
                        style={{
                          filter: isActive 
                            ? iconFilters.active
                            : iconFilters.inactive,
                          transition: 'filter 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => !isActive && (e.currentTarget.style.filter = iconFilters.hover)}
                        onMouseLeave={(e) => !isActive && (e.currentTarget.style.filter = iconFilters.inactive)}
                      />
                    </div>
                  ) : (
                    <Icon size={20} />
                  )}
                </span>

                <span className="flex-1 text-left">{name}</span>

                {subItems && (
                  <span className={`${isActive ? 'text-white' : 'text-[#818790] group-hover:text-[#a0c4ff]'}`}>
                    {expandedItem === name ? <IoIosArrowDown /> : <IoIosArrowForward />}
                  </span>
                )}
              </div>
            );

            return (
              <li key={name}>
                {subItems ? (
                  <button onClick={() => toggleSubItems(name)} className="w-full text-left">
                    {ItemContent}
                  </button>
                ) : (
                  <Link href={href}>
                    {ItemContent}
                  </Link>
                )}

                {subItems && expandedItem === name && (
                  <ul className="ml-10 mt-1 space-y-1.5">
                    {subItems.map((subItem) => {
                      const isSubActive = currentPath === subItem.href;
                      return (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`block text-[15px] font-normal py-1.5 px-2 rounded-md
                              ${isSubActive 
                                ? 'text-[#576CBC]' 
                                : 'text-[#818790] hover:text-[#576CBC]'}`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      );
                    })}
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