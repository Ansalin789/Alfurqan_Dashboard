"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdContactSupport, MdAssignment } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FaBookOpenReader } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";



import "@/styles/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/supervisor',
        icon: RiDashboardFill,    
    },
    {
        name: 'Recruitment',
        href: '/supervisor/recruitment',
        icon: IoPeopleSharp,
    },
    {
        name: 'Meeting & Training',
        href: '/supervisor/meeting&training',
        icon: MdAssignment,
    },
    {
        name: 'Teachers',
        href: '/supervisor/teachers',
        icon: FaBookOpenReader,
    },
    {
        name: 'Messages',
        href: '/supervisor/messages',
        icon: LuMessagesSquare,
    },
    {
        name: 'Support',
        href: '/supervisor/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar3() {
    return (
        <div className="sidebar__wrapper bg-[#012A4A] h-[100vh]">
            <aside className='sidebar bg-[#012A4A] shadow-lg'>
                <div className='sidebar__top'>
                <Image src="/assets/images/whitelogo.png" width={150} height={150} className='bg-cover bg-center' alt='logo'/>
                </div>
                <ul className="mt-10">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="text-center justify-center hover:no-underline hover:flex hover:bg-[#476a9b] hover:text-[#fff] hover:align-middle hover:justify-center] hover:pl-2 pl-2 py-2 hover:rounded-lg" key={name}>
                            <Link href={href} className='no-underline flex align-middle justify-start w-[100%] text-[#fff] pt-[15px] pb-[15px] text-[15px]'>
                                <span className="text-[20px] inline-block mr-[10px]">
                                    <Icon />
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
