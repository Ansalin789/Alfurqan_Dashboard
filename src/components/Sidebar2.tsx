"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { MdContactSupport, MdOutlinePayment, MdAssignment } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaFolderOpen } from "react-icons/fa";


import "@/styles/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/student/ui/dashboard',
        icon: TbLayoutDashboardFilled,    
    },
    {
        name: 'Classes',
        href: '/student/ui/classes',
        icon: IoPeopleSharp,
    },
    {
        name: 'Assignment',
        href: '/student/ui/assignment',
        icon: MdAssignment,
    },
    {
        name: 'Payments',
        href: '/student/ui/payment',
        icon: MdOutlinePayment,
    },
    {
        name: 'Knowledge',
        href: '/student/ui/knowledge',
        icon: FaFolderOpen,
    },
    {
        name: 'Message',
        href: '/student/ui/message',
        icon: FaFolderOpen,
    },
    {
        name: 'Support',
        href: '/student/ui/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar2() {
    return (
        <div className="sidebar__wrapper bg-[#012A4A] h-full">
            <aside className='sidebar bg-[#012A4A]'>
                <div className='sidebar__top'>
                    <Image src="/assets/images/whitelogo.png" width={100} height={100} className='sidebar__logo text-center bg-cover bg-center' alt='logo'/>
                </div>
                <ul className="">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="text-center justify-center ml-6 hover:no-underline hover:flex hover:bg-[#476a9b] hover:text-[#fff] hover:align-middle hover:justify-center] hover:pl-2 pl-2 hover:rounded-lg" key={name}>
                            <Link href={href} className='no-underline flex align-middle justify-start w-[100%] text-[#fff] pt-[15px] pb-[15px] text-[15px]'>
                                <span className="text-[20px] inline-block mr-[10px]">
                                    <Icon />
                                </span>
                                <span className="sidebar__name">{name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 border-[1px] border-b-[#9882BB]"></div>

                <Image src="/assets/images/refer.png" width={180} height={180} className='text-center bg-cover bg-center w-28 justify-center ml-8' alt='logo'/>

                <button className="relative ml-6 mt-3 flex items-center justify-center px-8 py-3 bg-gradient-to-b from-[#E63C48] via-[#EE693A] to-[#F9A826] text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400">
                <span className="pr-2 text-[13px]">Upgrade</span>&nbsp;
                <span className="absolute ml-2 right-3 flex items-center justify-center">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="red"
                    stroke="yellow"
                    strokeWidth="2"
                    >
                    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                    </svg>
                </span>
                </button>

            </aside>
        </div>
    );
}
