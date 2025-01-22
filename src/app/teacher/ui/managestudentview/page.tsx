import React from 'react';
import ManageStudentView from '../../components/managestudentview';
import AssignmentList from '../../components/assignmentlist';
import Total from '../../components/Total';

const Page = () => {
  return (
   
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Section - Student Info */}
        <div className="md:col-span-1">
          <ManageStudentView />
        </div>

        {/* Right Section - Statistics and Assignment List */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-0 mt-20 ml-40">
            <Total />
          </div>
          {/* Assignment List */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-0 -mt-40">
            <AssignmentList />
          </div>
        </div>
    </div>
  );
};

export default Page;
