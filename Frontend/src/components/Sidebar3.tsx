"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdContactSupport } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { GiGiftOfKnowledge } from "react-icons/gi";





import "/public/assets/css/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/Supervisor',
        icon: RiDashboardFill,    
    },
    {
        name: 'Classes',
        href: '/Supervisor/recruitment',
        icon: IoPeopleSharp,
    },
    {
        name: 'Assignment',
        href: '/Supervisor/meeting&training',
        icon: MdAssignment,
    },
    {
        name: 'Payments',
        href: '/Supervisor/teachers',
        icon: MdOutlinePayment,
    },
    {
        name: 'Knowledge',
        href: '/Supervisor/messages',
        icon: GiGiftOfKnowledge,
    },
    {
        name: 'Support',
        href: '/Supervisor/support',
        icon: MdContactSupport,
    }
];

export default function Sidebar3() {
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
