import React from 'react';
import ProfileCard from '@/components/Academic/ViewTeachersList/ProfileCard ';
import Stats from '@/components/Academic/ViewTeachersList/Stats';
import StudentList from '@/components/Academic/ViewTeachersList/StudentList';
import ScheduledClasses from '@/components/Academic/ViewTeachersList/ScheduledClasses';
import BaseLayout1 from '@/components/BaseLayout1';

const ViewTeachersList = () => {
  return (
    <BaseLayout1>
    <div className="p-6 min-h-screen w-[100%] flex flex-col">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <ProfileCard />
        <div className="flex flex-1 space-y-4 w-full">
          <Stats />
          <StudentList />
        </div>
      </div>
      <div className="mt-4">
        <ScheduledClasses />
      </div>
    </div>
    </BaseLayout1>
  );
};

export default ViewTeachersList;
