"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { IoIosCellular } from "react-icons/io";
import { GrSchedules } from "react-icons/gr";
import { MdAssignment, MdAnalytics, MdContactSupport } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";

import "../styles/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/teacher/ui/dashboard',
        icon: RiDashboardFill,    
    },
    {
        name: 'Live Classes',
        href: '/teacher/ui/liveclass',
        icon: IoIosCellular,
    },
    {
        name: 'Schedule',
        href: '/teacher/ui/schedule',
        icon: GrSchedules,
    },
    {
        name: 'Assignments',
        href: '/teacher/ui/assignment',
        icon: MdAssignment,
    },
    {
        name: 'Messages',
        href: '/teacher/ui/message',
        icon: LuMessagesSquare,
    },
    {
        name: 'Analytics',
        href: '/teacher/ui/analytics',
        icon: MdAnalytics,
    },
    {
        name: 'Support',
        href: '/teacher/ui/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar() {
    return (
        <div className="sidebar__wrapper h-[100vh] bg-[#223857]">
            <aside className='sidebar'>
                <div className='sidebar__top'>
                    <Image src="/assets/images/whitelogo.png" width={130} height={130} className='bg-cover bg-center' alt='logo'/>
                </div>
                <ul className="sidebar__list">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="text-center justify-center ml-6 hover:no-underline hover:flex hover:bg-[#476a9b] hover:text-[#fff] hover:align-middle hover:justify-center] hover:pl-2 pl-2 hover:rounded-lg" key={name}>
                            <Link href={href} className='no-underline flex align-middle justify-start w-[100%] text-[#fff] pt-[15px] pb-[15px] text-[14px]'>
                                <span className="text-[20px] inline-block mr-[10px]">
                                    <Icon />
                                </span>
                                <span className="sidebar__name">{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-10">
                    <Image src="/assets/images/refer.png" width={180} height={180} className='text-center bg-cover bg-center w-28 justify-center ml-8' alt='logo'/>
                </div>
               
            </aside>
        </div>
    );
}
