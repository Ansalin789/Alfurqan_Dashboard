'use client';

import { useTheme } from '@/context/ThemeContext';
import { CalendarDays, Bell, Sun, Moon, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import LeaveForm from "@/app/supervisor/components/leaveForm";
import AddMeeting from "@/app/supervisor/components/addMeeting";
import AddApplicants from "@/app/supervisor/components/addApplicants";
type Props = {
    readonly currentSection : string;
}

export default function SupervisorHeader( {currentSection}: Props) {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleDarkMode = theme?.toggleDarkMode ?? (() => {});

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showAddMeeting,setAddMeetings]=useState(false);
  const [showAddApplicant,setAddApplicant]=useState(false);
  const router = useRouter();

  const renderButton = () => {
    if (currentSection.startsWith("Dashboard")) {
      return (
        <button
          onClick={() => setShowLeaveForm(true)}
          className="bg-[#6C78F5] hover:bg-[#5a65d1] text-white text-sm px-4 py-2 rounded-lg"
        >
          Request for Leave
        </button>
      );
    }
    if ( currentSection.startsWith("Applicants") ) {
      return (
        <button 
        onClick={()=>setAddApplicant(true)}
        className="bg-[#6C78F5] hover:bg-[#5a65d1] text-white text-sm px-4 py-2 rounded-lg">
          Add Applicant
        </button>
      );
    }
    if (currentSection.startsWith("Scheduled Meetings") || currentSection.startsWith("Calendar")) {
      return (
        <button 
        onClick={()=>setAddMeetings(true)}
        className="bg-[#6C78F5] hover:bg-[#5a65d1] text-white text-sm px-4 py-2 rounded-lg">
          Add Meeting
        </button>
      );
    }
    if (currentSection.startsWith("Teacher's List")) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/supervisor/ui/feedback")}
            className="text-[#5a65d1] border border-[#5a65d1] text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Feedback
          </button>
          <button
            onClick={() => router.push("/supervisor/ui/viewschedule")}
            className="bg-[#6C78F5] hover:bg-[#5a65d1] text-white text-sm px-4 py-2 rounded-lg"
          >
            Scheduled Classes
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 pl-1 mb-1">
        <h1 className="text-xl font-semibold text-[#000836] dark:text-white">
          {currentSection}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {renderButton()}
          <button className="p-2.5 bg-white dark:bg-gray-700 rounded-lg">
            <CalendarDays className="w-4 h-4 text-gray-800 dark:text-white" />
          </button>
          <button className="p-2.5 bg-white dark:bg-gray-700 rounded-lg">
            <Bell className="w-4 h-4 text-gray-800 dark:text-white" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-lg"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-gray-800 dark:text-white" />
            ) : (
              <Moon className="w-4 h-4 text-gray-800 dark:text-white" />
            )}
          </button>
          <div className="p-2.5 bg-white dark:bg-gray-700 rounded-full">
            <User className="w-4 h-4 text-gray-800 dark:text-white" />
          </div>
        </div>
      </div>
        {showLeaveForm && <LeaveForm onClose={() => setShowLeaveForm(false)} />}
        {showAddMeeting && <AddMeeting onClose={()=>setAddMeetings(false)} />}
            {showAddApplicant && <AddApplicants onClose={()=>setAddApplicant(false)} />}
    </div>
  );
}
