import React from 'react';
import ManageStudentView from '../../components/managestudentview';
import AssignmentList from '../../components/assignmentlist';

const Page = () => {

  const cards = [
    {
      id: "card1",
      name: "Total Assignment Assigned",
      value: 80,
      count: 25,
      icon: "📋",
      color: "#FEC64F",
    },
    {
      id: "card2",
      name: "Total Assignment Completed",
      value: 62,
      count: 10,
      icon: "📄",
      color: "#00D9B0",
    },
  ];
  return (
   
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto">
        {/* Left Section - Student Info */}
        <div className="md:col-span-1 md:mx-auto">
          <ManageStudentView />
        </div>

        {/* Right Section - Statistics and Assignment List */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 mx-auto w-[1100px]">
              <h1 className="text-2xl font-semibold text-gray-800 p-2 -ml-32">Assignment</h1>
              <div className="flex justify-center gap-6 p-2 ml-[230px] mt-[50px]">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="w-[500px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4"
                  >
                    {/* Circular Progress */}
                    <div className="mr-6 flex justify-center items-center relative">
                      <svg
                        className="w-[90px] h-[80px] transform rotate-[-90deg]"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-gray-300"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4" /* Background circle thickness */
                        ></path>
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={c.color}
                          strokeWidth="4" /* Progress circle thickness */
                          strokeDasharray={`${c.value}, 100`}
                        >
                        </path>
                      </svg>
                      {/* Percentage Value */}  
                      <div className="absolute text-[14px] font-bold text-gray-800">
                        {c.value}%
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 text-[14px] font-semibold mb-2">
                        {c.name}
                      </p>
                      <p className="text-gray-600 text-[12px] font-medium flex items-center gap-2">
                        {c.count} <span className="text-2xl">{c.icon}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
          </div>

          {/* Assignment List */}
          
          <div className="mt-8 mx-auto">
            <AssignmentList />
          </div>
        </div>
    </div>
  );
};

export default Page;
