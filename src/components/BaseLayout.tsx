'use client';

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDashboardFill } from 'react-icons/ri';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaBookOpenReader } from 'react-icons/fa6';
import { LuMessagesSquare } from 'react-icons/lu';
import { SiGoogleclassroom } from "react-icons/si";
import { Users, CircleHelp } from 'lucide-react';
import { PermissionsContext } from "./contexts/PermissionsContext";
import { BsFileBarGraphFill } from "react-icons/bs";


interface Props {
  readonly children: ReactNode | ReactNode[];
}

const SidebarItems = [
  { name: 'Dashboard', href: '/teacher/ui/dashboard', icon: RiDashboardFill },
  { name: 'Meeting', href: '/teacher/ui/meeting', icon: SiGoogleclassroom },
  { name: 'Schedule', href: '/teacher/ui/schedule', icon: FaRegCalendarAlt },
  {
    name: 'Live Class',
    href: '/teacher/ui/liveclass',
    icon: () => (
      <Image
        src="/assets/images/group-add.svg"
        width={20}
        height={20}
        alt="Live Class Icon"
      />
    ),
  },
  { name: 'Assignment', href: '/teacher/ui/assignment', icon: FaBookOpenReader },
  { name: 'Message', href: '/teacher/ui/message', icon: LuMessagesSquare },

  { name: 'Analytics', href: '/teacher/ui/analytics', icon: BsFileBarGraphFill },
  
  { name: 'Support', href: '/teacher/ui/support', icon: CircleHelp }
];

function Sidebar() {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<any>({});

  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("TeacherRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.academicmodules || roleAccess;
        setPermissions(modules);
      } catch (error) {
        console.error("❌ Invalid TeacherRolePermission JSON", error);
      }
    }
  }, []);

  return (
    <div className="sidebar__wrapper bg-[#012A4A] dark:bg-[#1D1D1D] p-4 h-full w-full max-w-full overflow-y-auto flex flex-col">

      {/* Logo Section */}
      <div className='flex items-center gap-2 mt-5 mb-6 px-2'>
        <Image
          src="/assets/images/alfwhite.png"
          width={40}
          height={40}
          className='w-10 h-10 object-contain'
          alt='logo'
        />
        <div className="text-white leading-tight">
          <h3 className="font-bold text-[18px] sm:text-[20px] xl:text-[22px]">AL FURQAN</h3>
          <h4 className="font-light text-[14px] sm:text-[15px] xl:text-[16px] font-sans">academy</h4>
        </div>
      </div>

      {/* Menu List */}
      <ul className="space-y-2 flex-1">
        {SidebarItems.map(({ name, href, icon: Icon }) => {
          const key = name.toLowerCase().replace(/\s+/g, '');
          const modulePermission = permissions?.[key] || {};
          const hasReadAccess = modulePermission.read ?? true;

          return (
            <li key={name}>
              <Link href={hasReadAccess ? href : "#"} className="block no-underline">
                <button
                  className={`w-full flex items-center gap-3 px-3 py-3
                    text-[13px] sm:text-[14px] xl:text-[15px]
                    cursor-${hasReadAccess ? 'pointer' : 'not-allowed'} rounded transition-colors duration-200
                    ${pathname === href
                      ? 'text-white font-medium bg-[#576CBC]'
                      : hasReadAccess
                        ? 'text-[#818790] hover:text-[#a0c4ff]'
                        : 'text-[#818790] hover:text-[#a0c4ff] opacity-70'}
                  `}
                  disabled={!hasReadAccess}
                >
                  <span className="text-[18px] w-5 flex justify-center">
                    <Icon size={20} />
                  </span>
                  <span className="flex-1 text-left">{name}</span>
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function BaseLayout({ children }: Props) {
  const [permissions, setPermissions] = useState<any>({});
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("TeacherRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.teachermodules || roleAccess;
        setPermissions(modules);
      } catch (error) {
        console.error("❌ Invalid TeacherRolePermission JSON", error);
      }
    }

    const dpi = window.devicePixelRatio;
    if (dpi === 1.25) setScale(0.99);
    else if (dpi === 1.5) setScale(0.985);
    else if (dpi === 1.75) setScale(0.96);
    else if (dpi === 2) setScale(0.94);
    else setScale(1);
  }, []);

  const inverseScale = 1 / scale;

  return (
    <PermissionsContext.Provider value={permissions}>
      <div
        style={{ width: `100vw`, height: `100vh`, overflow: "hidden" }}
        className="bg-[#E4E7F4] dark:bg-[#252525] text-black dark:text-white"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${100 * inverseScale}vw`,
            height: `${100 * inverseScale}vh`,
          }}
          className="grid grid-cols-1 md:grid-cols-[240px_1fr] transition-all"
        >
          <div className="hidden md:block min-h-screen bg-[#012A4A] dark:bg-[#001E34] overflow-y-auto">
            <Sidebar />
          </div>

          <div className="overflow-y-auto py-2 px-4 scrollbar-none h-screen">
            {children}
          </div>
        </div>
      </div>
    </PermissionsContext.Provider>
  );
}

