// "use client";

// import Image from "next/image";
// import Link from 'next/link';
// import React from 'react';
// import { RiDashboardFill } from "react-icons/ri";
// import { IoIosCellular } from "react-icons/io";
// import { GrSchedules } from "react-icons/gr";
// import { MdAssignment, MdAnalytics, MdContactSupport } from "react-icons/md";
// import { LuMessagesSquare } from "react-icons/lu";

// import "../styles/globals.css";

// const SidebarItems = [
//     {
//         name: 'Dashboard',
//         href: '/Teacher',
//         icon: RiDashboardFill,    
//     },
//     {
//         name: 'Live Classes',
//         href: '/Teacher/class',
//         icon: IoIosCellular,
//     },
//     {
//         name: 'Schedule',
//         href: '/Teacher/schedule',
//         icon: GrSchedules,
//     },
//     {
//         name: 'Assignments',
//         href: '/Teacher/assignment',
//         icon: MdAssignment,
//     },
//     {
//         name: 'Messages',
//         href: '/Teacher/messages',
//         icon: LuMessagesSquare,
//     },
//     {
//         name: 'Analytics',
//         href: '/Teacher/analytics',
//         icon: MdAnalytics,
//     },
//     {
//         name: 'Support',
//         href: '/Teacher/support',
//         icon: MdContactSupport,
//     }
// ];

// export default function Sidebar() {
//     return (
//         <div className="sidebar__wrapper">
//             <aside className='sidebar'>
//                 <div className='sidebar__top'>
//                     <Image src="/assets/images/alfwhite.png" width={100} height={100} className='sidebar__logo text-center bg-cover bg-center' alt='logo'/>
//                     <p className='sidebar__logo-name'>
//                         <Image src="/assets/images/alf2.png" width={130} height={50} alt='logo'/>
//                     </p>
//                 </div>
//                 <ul className="sidebar__list">
//                     {SidebarItems.map(({ name, href, icon: Icon }) => (
//                         <li className="sidebar__item" key={name}>
//                             <Link href={href} className='sidebar__link'>
//                                 <span className="sidebar__icon">
//                                     <Icon />
//                                 </span>
//                                 <span className="sidebar__name">{name}</span>
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </aside>
//         </div>
//     );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiDashboardFill } from "react-icons/ri";
import { IoIosCellular } from "react-icons/io";
import { GrSchedules } from "react-icons/gr";
import { MdAssignment, MdAnalytics, MdContactSupport, MdLocalLibrary, MdDateRange, MdQuestionAnswer, MdOutlinePayment } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";
import { IoBookmarks, IoPeopleSharp } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaFolderOpen } from "react-icons/fa";


import "@/styles/globals.css";

const SidebarItemsByRole = {
    teacher: [
        { name: "Dashboard", href: "/Teacher", icon: RiDashboardFill },
        { name: "Live Classes", href: "/Teacher/class", icon: IoIosCellular },
        { name: "Schedule", href: "/Teacher/schedule", icon: GrSchedules },
        { name: "Assignments", href: "/Teacher/assignment", icon: MdAssignment },
        { name: "Messages", href: "/Teacher/messages", icon: LuMessagesSquare },
        { name: "Analytics", href: "/Teacher/analytics", icon: MdAnalytics },
        { name: "Support", href: "/Teacher/support", icon: MdContactSupport },
    ],
    academicCoach: [
        { name: "Dashboard", href: "/Academic", icon: RiDashboardFill },
        { name: "Trail Management", href: "/Academic/trailManagement", icon: IoBookmarks },
        { name: "Manage Students", href: "/Academic/manageStudents", icon: IoPeopleSharp },
        { name: "Manage Teachers", href: "/Academic/manageTeachers", icon: MdLocalLibrary },
        { name: "Schedule", href: "/Academic/schedule", icon: MdDateRange },
        { name: "Messages", href: "/Academic/messages", icon: MdQuestionAnswer },
        { name: "Support", href: "#", icon: MdContactSupport },
    ],
    Student: [
        { name: "Dashboard", href: "/Student", icon: TbLayoutDashboardFilled },
        { name: "Classes", href: "/Student/classes", icon: IoPeopleSharp },
        { name: "Assignment", href: "/Student/assignment", icon: MdAssignment },
        { name: "Payments", href: "/Student/payments", icon: MdOutlinePayment },
        { name: "Knowledge", href: "/Student/knowledge", icon: FaFolderOpen },
        { name: "Support", href: "/Student/support", icon: MdContactSupport },
    ],
};

interface SidebarProps {
    role: "teacher" | "academicCoach" | "Student";
}

export default function Sidebar({ role }: SidebarProps) {
    const SidebarItems = SidebarItemsByRole[role];

    return (
        <div className="sidebar__wrapper">
      <aside className="sidebar shadow-xl bg-[#012A4A]">
        <div className="sidebar__top">
          <Image src="/assets/images/whitelogo.png" width={100} height={100} className="sidebar__logo text-center bg-cover bg-center" alt="logo" />
          <p className="sidebar__logo-name">
            <Image src="/assets/images/alf2.png" width={130} height={50} alt="logo" />
          </p>
        </div>
        <ul className="sidebar__list">
          {SidebarItems.map(({ name, href, icon: Icon }) => (
            <li className="sidebar__item" key={name}>
              <Link href={href} className="sidebar__link">
                <span className="sidebar__icon">
                  <Icon />
                </span>
                <span className="sidebar__name">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {role === "Student" && (
          <>
            <div className="mt-4 border-[1px] border-b-[#9882BB]"></div>
            <Image src="/assets/images/refer.png" width={180} height={180} className="text-center bg-cover bg-center w-28 justify-center ml-8" alt="refer" />
            <button className="relative ml-6 mt-3 flex items-center justify-center px-8 py-3 bg-gradient-to-b from-[#E63C48] via-[#EE693A] to-[#F9A826] text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400">
              <span className="pr-2 text-[13px]">Upgrade</span>
              <span className="absolute ml-2 right-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="red" stroke="yellow" strokeWidth="2">
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </span>
            </button>
          </>
        )}
      </aside>
    </div>
    );
}
