'use state';

import React from 'react'
import BaseLayout1 from "../../../../components/BaseLayout1";
import SupervisorHeader from '@/app/supervisor/components/supervisorHeader';
import TotalList from "../../components/TotalList";
import NextEvaluationClass from '../../components/NextEvaluationClass';
import TeachersStudents from '../../components/TeachersStudent';
import Countries from '../../components/Countries';
import Teachers from '../../components/Teachers';



export default function Dashboard() {
  return (
    <BaseLayout1>
    <SupervisorHeader currentSection="Dashboard" />
    <div className="flex flex-row gap-4 p-0 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <TotalList />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <NextEvaluationClass />
        </div>

        {/* Charts Row */}
        <div className="flex gap-4">
          <div className="w-[33%] bg-white rounded-xl h-[270px] flex flex-col">
            <div className="flex-1 flex items-center justify-center">
            <TeachersStudents />
            </div>
          </div>
          <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[270px] flex flex-col">
          <Countries />
          </div>
          <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[270px] flex flex-col">
          <Teachers />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-lg dark:bg-[#343434]">
          <div className="overflow-x-auto scrollbar-none h-full">
            <div className="overflow-y-auto h-[428px] rounded-xl scrollbar-none">
              {/* <table className="min-w-full text-xs border-collapse table-fixed px-4">
                <thead className=" text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d]">
                  <tr>
                    {[
                      "Name",
                      "Contact",
                      "Country",
                      "Course",
                      "Gender",
                      "Date",
                      "Time",
                      "Resume",
                      "Status",
                    ].map((col) => (
                      <th
                        key={col}
                        className="py-4 px-2 font-semibold text-left border border-[#466993] dark:border-[#466993]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {applicants.map((applicant, index) => {
                    const resumeUrl = getResumeBlobUrl(
                      applicant.uploadResume
                    );

                    return (
                      <tr
                        key={applicant._id}
                        className={`text-[10px] px-2 py-4 border-none outline-none ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2c2c2c]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="py-4 px-2 text-left">
                          {applicant.candidateFirstName}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.candidatePhoneNumber}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.candidateCountry}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.positionApplied}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.gender}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {formatDate(applicant.applicationDate)}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {applicant.preferedWorkingHours}
                        </td>
                        <td className="py-2 px-2 text-left">
                          {resumeUrl ? (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#38619A] hover:underline flex items-center gap-1"
                            >
                              <ImAttachment className="w-3 h-3" />
                              Resume
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">
                              No Resume
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-left">
                          <span className="text-gray-800 rounded-full dark:text-[#fff]">
                            {applicant.applicationStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
            <span className="text-left -ml-60 ">
              {/* Showing {applicants.length} of {totalApplications} */}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[310px] flex flex-col gap-4">
        {/* Calendar */}
        <div className="rounded-xl shadow-lg">
          <div className="h-[350px] bg-white rounded-xl flex items-center justify-center text-gray-400 dark:bg-[#343434]">
            {/* <Calendar /> */}
          </div>
        </div>
        {/* Teachers */}
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-[#343434] h-[200px]">
          <h3 className="text-[16px] font-semibold text-gray-800 mb-1 dark:text-[#fff]">
            Teachers
          </h3>

          <div className="flex items-center justify-between mt-3">
            {/* Circular Chart */}
            <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-5 -ml-0">
              {/* <PieChart width={120} height={120}>
                <Pie
                  data={[{ value: 100 }]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={38}
                  startAngle={90}
                  endAngle={-270}
                  fill="#f0f0f0"
                />
                {filteredPositions.map((item, index) => (
                  <Pie
                    key={index}
                    data={[
                      { value: item.count },
                      { value: total - item.count },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={30 + index * (ringThickness + ringGap)}
                    outerRadius={
                      30 + index * (ringThickness + ringGap) + ringThickness
                    }
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={5}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.color} stroke="none" />
                    <Cell fill="transparent" stroke="none" />
                  </Pie>
                ))}
              </PieChart>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[16px] font-bold text-[#010E30] dark:text-[#fff]">
                  {totals}
                </span>
                <p className="text-[8px] text-[#010E30] dark:text-[#fff] text-center">
                  Number of Teachers
                </p>
              </div> */}
            </div>

            {/* Teacher Stats */}
            <div className="space-y-3 mr-1">
              {/* {filteredPositions.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between w-32 dark:text-[#fff]"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-[11px] text-[#010E30CC] font-semibold dark:text-[#fff]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[#010E30CC] text-[10px] font-medium dark:text-[#fff]">
                    {item.count}
                  </span>
                </div>
              ))} */}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-[#343434] h-[332px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[16px] font-semibold text-gray-700 dark:text-[#ffff]">
              Schedule
            </h3>
            <button className="px-2 py-1 bg-[#efefef] rounded flex items-center gap-1 text-[10px] dark:bg-[#747474]">
              Today <span className="text-[#747474]">▼</span>
            </button>
          </div>

          {/* Timeline */}
          <div className="relative pl-4 space-y-4 h-[260px] overflow-y-auto scrollbar-none">
            {/* Vertical dotted line */}

            {/* {todayMeetings.map((item, index) => {
              const colors = colorMap[index % colorMap.length];

              return (
                <div
                  key={item.title + index}
                  className="flex items-start gap-3 relative"
                >
                  <span className="text-[10px] text-gray-500 w-[50px] mt-[22px] dark:text-[#ffff]">
                    {item.time}
                  </span>

                  <div className="absolute left-[65px] top-0 bottom-0 border-l-2 border-dotted border-gray-300 z-0"></div>

                  <div
                    className="w-[8px] h-[8px] rounded-full mt-[25px] z-10"
                    style={{ backgroundColor: colors.dot }}
                  ></div>

                  <div
                    className="flex items-center px-3 py-2 rounded-lg flex-1 text-[10px] font-medium gap-2 "
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    <img
                      src={colors.icon}
                      alt="icon"
                      className="w-4 h-4 object-contain"
                    />
                    {item.title}
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
      </div>
    </div>
  </BaseLayout1>
  )
}
