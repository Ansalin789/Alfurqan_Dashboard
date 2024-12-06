"use client";

import Image from "next/image";
import Link from 'next/link';
import React from 'react';
import { RiDashboardFill } from "react-icons/ri";
import { MdContactSupport } from "react-icons/md";
import { IoBookmarks } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";
import { MdLocalLibrary } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { MdQuestionAnswer } from "react-icons/md";
import "/public/assets/css/globals.css";

const SidebarItems = [
    {
        name: 'Dashboard',
        href: '/Academic',
        icon: RiDashboardFill,    
    },
    {
        name: 'Trail Management',
        href: '/Academic/trailManagement',
        icon: IoBookmarks,
    },
    {
        name: 'Manage Students',
        href: '/Academic/manageStudents',
        icon: IoPeopleSharp,
    },
    {
        name: 'Manage Teachers',
        href: '/Academic/manageTeachers',
        icon: MdLocalLibrary,
    },
    {
        name: 'Schedule',
        href: '/Academic/schedule',
        icon: MdDateRange,
    },
    {
        name: 'Messages',
        href: '/Academic/messages',
        icon: MdQuestionAnswer,
    },
    {
        name: 'Support',
        href: '#',
        icon: MdContactSupport,
    }
];

export default function Sidebar1() {
    return (
        <div className="sidebar__wrapper">
            <aside className='sidebar shadow-xl'>
                <div className='sidebar__top'>
                    <Image src="/assets/images/whitelogo.png" width={100} height={100} className='sidebar__logo text-center bg-cover bg-center' alt='logo'/>
                    {/* <p className='sidebar__logo-name'>
                        <Image src="/assets/images/whitelogo.png" className="w-[300px]" width={150} height={150} alt='logo'/>
                    </p> */}
                </div>
                <ul className="sidebar__list">
                    {SidebarItems.map(({ name, href, icon: Icon }) => (
                        <Link href={href} className="sidebar__item" key={name}>
                            <li  className='sidebar__link'>
                                <span className="sidebar__icon">
                                    <Icon />
                                </span>
                                <span className="sidebar__name">{name}</span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
