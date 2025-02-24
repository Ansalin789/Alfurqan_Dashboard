"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { MdContactSupport } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaFolderOpen } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { MdAssignment } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
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
        icon: LuMessagesSquare,
    },
    {
        name: 'Support',
        href: '/student/ui/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar2() {
    return (

        <div className="sidebar__wrapper">
            <aside className='sidebar'>
                <div className='sidebar__top'>
                    <Image src="/assets/images/alfwhite.png" width={100} height={100} className='sidebar__logo text-center bg-cover bg-center' alt='logo'/>
                    <p className='sidebar__logo-name'>
                        <Image src="/assets/images/alf2.png" width={130} height={50} alt='logo'/>
                    </p>
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
            </aside>
        </div>
    );
}
