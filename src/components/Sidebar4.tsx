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
                name: 'Salery and Wages',
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
        <div className="sidebar__wrapper bg-[#012A4A] h-full md:h-[100vh] overflow-y-auto">
            <aside className="sidebar bg-[#012A4A] shadow-lg">
                <div className='flex justify-center align-middle p-4 gap-2'>
                    <Image src="/assets/images/alfwhite.png" width={150} height={150} className='bg-cover bg-center w-8 h-12' alt='logo' />
                    <div className="text-white">
                        <h3 className="font-bold text-[19px]">AL FURQAN</h3>
                        <h4 className="font-light text-[17px] justify-end ml-8 -mt-3 font-sans">academy</h4>
                    </div>
                </div>
                <ul className="ml-6">
                    {SidebarItems.map(({ name, href, icon: Icon, subItems }) => (
                        <li key={name}>
                            <button
                                className={`text-center justify-center hover:no-underline hover:flex hover:text-[#476a9b] hover:align-middle hover:justify-center hover:pl-2 pl-2 pr-2 py-2 hover:rounded-lg rounded-lg ${subItems ? 'cursor-pointer' : ''} ${currentPath === href || (subItems && isSubItemActive(subItems)) ? 'bg-[#476a9b] text-[#fff]' : ''}`}
                                onClick={() => subItems && toggleSubItems(name)}
                            >
                                <Link href={href} className='no-underline hover:text-[#a0c4ff] flex align-middle justify-start w-[100%] text-[#fff] pt-[10px] pb-[10px] text-[14px]'>
                                    <span className="text-[20px] inline-block mr-[10px]">
                                        {typeof Icon === 'string' ? (
                                            <Image src={Icon} width={20} height={20} alt={name} />
                                        ) : (
                                            <Icon />
                                        )}
                                    </span>
                                    <span className="sidebar__name">{name}</span>
                                    {subItems && (
                                        <span className="ml-1 mr-2 mt-[6px]">
                                            {expandedItem === name ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                        </span>
                                    )}
                                </Link>
                            </button>

                            {subItems && expandedItem === name && (
                                <ul className="ml-8 mt-1 mb-1">
                                    {subItems.map((subItem) => (
                                        <li key={subItem.name} className="py-1">
                                            <Link
                                                href={subItem.href}
                                                className={`text-[#fff] text-[10px] hover:text-[#a0c4ff] no-underline ${currentPath === subItem.href ? 'text-[#a0c4ff] font-semibold' : ''}`}
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