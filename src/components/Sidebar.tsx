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
        href: '/Teacher',
        icon: RiDashboardFill,    
    },
    {
        name: 'Live Classes',
        href: '/Teacher/class',
        icon: IoIosCellular,
    },
    {
        name: 'Schedule',
        href: '/Teacher/schedule',
        icon: GrSchedules,
    },
    {
        name: 'Assignments',
        href: '/Teacher/assignment',
        icon: MdAssignment,
    },
    {
        name: 'Messages',
        href: '/Teacher/messages',
        icon: LuMessagesSquare,
    },
    {
        name: 'Analytics',
        href: '/Teacher/analytics',
        icon: MdAnalytics,
    },
    {
        name: 'Support',
        href: '/Teacher/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar() {
    return (
        <div className="sidebar__wrapper">
            <aside className='sidebar'>
                <div className='sidebar__top'>
                    <Image src="/assets/images/alfwhite.png" width={100} height={100} className='sidebar__logo text-center bg-cover bg-center' alt='logo'/>
                    <p className='sidebar__logo-name'>
                        <Image src="/assets/images/alf2.png" width={130} height={50} alt='logo'/>
                    </p>
                </div>
                <ul className="sidebar__list">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <li className="sidebar__item" key={name}>
                            <Link href={href} className='sidebar__link'>
                                <span className="sidebar__icon">
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
