"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { RiDashboardFill } from "react-icons/ri";
import {
  MdContactSupport,
  MdLocalLibrary,
  MdDateRange,
  MdQuestionAnswer,
} from "react-icons/md";
import { IoBookmarks, IoPeopleSharp } from "react-icons/io5";
import "@/styles/globals.css";
const SidebarItems = [
  {
    name: "Dashboard",
    href: "/Academic",
    icon: RiDashboardFill,
  },
  {
    name: "Trail Management",
    href: "/Academic/trailManagement",
    icon: IoBookmarks,
  },
  {
    name: "Manage Students",
    href: "/Academic/manageStudents",
    icon: IoPeopleSharp,
  },
  {
    name: "Manage Teachers",
    href: "/Academic/manageTeachers",
    icon: MdLocalLibrary,
  },
  {
    name: "Schedule",
    href: "/Academic/schedule",
    icon: MdDateRange,
  },
  {
    name: "Messages",
    href: "/Academic/messages",
    icon: MdQuestionAnswer,
  },
  {
    name: "Support",
    href: "/Academic/support",
    icon: MdContactSupport,
  },
];

export default function Sidebar1() {
  const currentPath = usePathname(); // Get the current path
  return (
    <div className="sidebar__wrapper">
      <aside className="sidebar shadow-lg">
        <div className="sidebar__top">
          <Image
            src="/assets/images/whitelogo.png"
            width={150}
            height={150}
            className="bg-cover bg-center"
            alt="logo"
          />
        </div>
        <ul className="sidebar__list text-center align-middle justify-center">
          {SidebarItems.map(({ name, href, icon: Icon }) => (
            <Link href={href} className="sidebar__item" key={name}>
              <li
                className={`sidebar__link ${
                  currentPath === href
                    ? "flex bg-[#476a9b] text-[#fff] align-middle w-full p-2"
                    : ""
                }`}
                key={name}
              >
                <span className="sidebar__icon ml-2">
                  <Icon />
                </span>
                <span className="sidebar__name text-center">{name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </aside>
    </div>
  );
}
