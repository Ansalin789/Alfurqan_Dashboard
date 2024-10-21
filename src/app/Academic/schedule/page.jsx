import Image from 'next/image';
import { RiDashboardFill } from 'react-icons/ri';
import { IoIosCellular } from 'react-icons/io';
import { GrSchedules } from 'react-icons/gr';
import { MdAssignment, MdAnalytics, MdContactSupport } from 'react-icons/md';
import { LuMessagesSquare } from 'react-icons/lu';
import BaseLayout1 from '@/components/BaseLayout1';
import Sidebar from '@/components/Sidebar';

const SidebarItems = [
  { name: 'Dashboard', href: '/Academic', icon: RiDashboardFill },
  { name: 'Trail Management', href: '/Academic/trailManagement', icon: IoIosCellular },
  { name: 'Manage Students', href: '/Academic/manageStudents', icon: GrSchedules },
  { name: 'Manage Teachers', href: '/Academic/manageTeachers', icon: MdAssignment },
  { name: 'Messages', href: '/Academic/messages', icon: LuMessagesSquare },
  { name: 'Analytics', href: '/Academic/analytics', icon: MdAnalytics },
  { name: 'Support', href: '/Academic/support', icon: MdContactSupport },
];

export default function Schedule() {
  return (<>
    <BaseLayout1>
    <div className="flex h-screen">
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">January 2024</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Meeting</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add ToDoList</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Schedule</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-7 text-center mb-4">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Generate calendar days here */}
              {/* This is just a placeholder example */}
              {Array.from({ length: 31 }, (_, i) => (
                <div key={i} className="p-2 border">{i + 1}</div>
              ))}
            </div>
          </div>

          {/* List Schedule */}
          <div className="col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">List Schedule</h2>
            <ul className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="border-b pb-4">
                  <h3 className="font-bold">Activity Name</h3>
                  <p className="text-gray-600">Location - Meeting Room</p>
                  <p className="text-gray-600">10:00 AM</p>
                  <p className="text-gray-500 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum vehicula commodo.</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout1>
  </>
    
  );
}
