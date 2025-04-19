"use client";

import Image from "next/image";
import Link from 'next/link';
import React, { useState } from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdBookmarks, MdAnalytics } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { GiGraduateCap } from "react-icons/gi";
import { PiBookOpenFill } from "react-icons/pi";
import { IoMdSettings, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";

import "@/styles/globals.css";

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
            {
                name: 'Trail Class',
                href: '/admin-main/ui/evaluations',
                icon: MdBookmarks,
            },
            {
                name: 'Scheduled Trail class',
                href: '/admin-main/ui/trailmanagement',
                icon: MdBookmarks,
            },
        ]
    },
    {
        name: 'Students',
        href: '/admin-main/ui/student',
        icon: GiGraduateCap,
    },
    {
        name: 'Employees',
        href: '/admin-main/ui/employees',
        icon: IoPeopleSharp,
    },
    {
        name: 'Meetings',
        href: '/admin-main/ui/meeting',
        icon: MdAnalytics,
    },
    {
        name: 'Courses',
        href: '/admin-main/ui/courses',
        icon: PiBookOpenFill,
    },  
    {
        name: 'Classes',
        href: '/admin-main/ui/classes',
        icon: '/assets/images/clssss.png',
    },
    {
        name: 'Finance',
        href: '#',
        icon: '/assets/images/invoicee.jpeg',
        subItems: [
            {
                name: 'Invoice',
                href: '/admin-main/ui/Invoice',
                icon: MdBookmarks,
            },
            {
                name: 'Salary and Wages',
                href: '/admin-main/ui/salaryandwages',
                icon: MdBookmarks,
            },
            {
                name: 'Expenses',
                href: '/admin-main/ui/expenses',
                icon: MdBookmarks,
            }
        ]
    },

    {
        name: 'Analytics',
        href: '/admin-main/ui/analytics',
        icon: MdAnalytics,
    },
    {
        name: 'Messages',
        href: '/admin-main/ui/messagess',
        icon: LuMessagesSquare,
    },
    {
        name: 'Settings',
        href: '/admin-main/ui/settings',
        icon: IoMdSettings,
    }
];

export default function Sidebar4() {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const currentPath = usePathname();

    // Check if any sub-item is active
    const isSubItemActive = (subItems: any[]) => {
        return subItems.some(subItem => currentPath === subItem.href);
    };

    // Set the expanded item based on the current path
    React.useEffect(() => {
        SidebarItems.forEach(item => {
            if (item.subItems && isSubItemActive(item.subItems)) {
                setExpandedItem(item.name);
            }
        });
    }, [currentPath]);

    const toggleSubItems = (name: string) => {
        if (expandedItem === name) {
            setExpandedItem(null);
        } else {
            setExpandedItem(name);
        }
    };

    return (
        <div className="sidebar__wrapper bg-[#0e2231] h-full overflow-y-auto">
  <aside className="sidebar bg-[#0e2536] p-4 h-full flex flex-col">
    {/* Logo Section */}
    <div className='flex items-center gap-3 mt-5 mb-6 px-2'>
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
  
    {/* Menu List - fills remaining space */}
    <ul className="space-y-1.5 flex-1">
      {SidebarItems.map(({ name, href, icon: Icon, subItems }) => (
        <li key={name}>
          <Link href={href} className="block no-underline">
            <button
              onClick={() => subItems && toggleSubItems(name)}
              className={`
                w-full flex items-center gap-3 px-3 py-3
                text-[13px] cursor-pointer rounded
                ${currentPath === href || (subItems && isSubItemActive(subItems))
                  ? 'text-[#a0c4ff] font-medium'
                  : 'text-white hover:text-[#a0c4ff]'}
                transition-colors duration-200
              `}
            >
              {/* Icon with consistent sizing */}
              <span className="text-[18px] w-5 flex justify-center">
                {typeof Icon === 'string' ? (
                  <Image src={Icon} width={20} height={20} alt={name} />
                ) : (
                  <Icon size={20} />
                )}
              </span>

              {/* Label with consistent spacing */}
              <span className="flex-1 text-left">{name}</span>

              {/* Arrow if subitems */}
              {subItems && (
                <span className="text-sm">
                  {expandedItem === name ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </span>
              )}
            </button>
          </Link>

          {/* Submenu */}
          {subItems && expandedItem === name && (
            <ul className="ml-10 mt-1 space-y-1.5">
              {subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.href}
                    className={`
                      block text-[13px] no-underline py-1.5 px-3
                      ${currentPath === subItem.href 
                        ? 'text-[#a0c4ff] font-medium' 
                        : 'text-white hover:text-[#a0c4ff]'}
                      transition-colors duration-150
                    `}
                  >
                    {subItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </aside>
</div>
      

    );
}