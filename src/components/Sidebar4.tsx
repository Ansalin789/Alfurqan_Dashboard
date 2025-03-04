"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdBookmarks, MdAnalytics } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { LuMessagesSquare } from "react-icons/lu";
import { GiGraduateCap } from "react-icons/gi";
import { PiBookOpenFill } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";





import "@/styles/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/admin-main/ui/dashboard',
        icon: RiDashboardFill,    
    },
    {
        name: 'Evaluation',
        href: '/admin-main/ui/evaluation',
        icon: MdBookmarks,
    },
    {
        name: 'Students',
        href: '/admin-main/ui/students',
        icon: GiGraduateCap,
    },
    {
        name: 'Employees',
        href: '/admin-main/ui/employees',
        icon: IoPeopleSharp,
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
        name: 'Invoice',
        href: '/admin-main/ui/invoice',
        icon: '/assets/images/invoicee.jpeg',
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
        href: '/admin-main/ui/settingss',
        icon: IoMdSettings,
    }
];

export default function Sidebar4() {
    return (
        <div className="sidebar__wrapper bg-[#012A4A] h-[100vh]">
            <aside className='sidebar bg-[#012A4A] shadow-lg'>
                <div className='justify-center align-middle mt-2 p-4'>
                <Image src="/assets/images/whitelogo.png" width={150} height={150} className='bg-cover bg-center' alt='logo'/>
                </div>
                <ul className="ml-6">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="text-center justify-center hover:no-underline hover:flex hover:bg-[#476a9b] hover:text-[#fff] hover:align-middle hover:justify-center] hover:pl-2 pl-2 py-2 hover:rounded-lg" key={name}>
                            <Link href={href} className='no-underline flex align-middle justify-start w-[100%] text-[#fff] pt-[10px] pb-[10px] text-[14px]'>
                                <span className="text-[20px] inline-block mr-[10px]">
                                    {typeof Icon === 'string' ? (
                                        <Image src={Icon} width={20} height={20} alt={name} />
                                    ) : (
                                        <Icon />
                                    )}
                                </span>
                                <span className="sidebar__name">{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}