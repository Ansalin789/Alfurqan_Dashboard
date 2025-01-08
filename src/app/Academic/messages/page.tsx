import BaseLayout1 from '@/components/BaseLayout1';
import React from 'react';

export default function Messages() {
  const contacts = [
    { no:1,name: 'Dr. Lila Ramirez', message: 'Please ensure the monthly attendance report', time: '9:00 AM' },
    { no:2,name: 'Ms. Heather Morris', message: 'Don\'t forget the staff training on digital tools scheduled for May 5th at 3 PM in the...', time: '10:15 AM' },
    { no:3,name: 'Staff Coordination', message: 'Ms. Patel: All staff performance reviews are due by the end of this month. Please submit your report...', time: '2:00 PM' },
    { no:4,name: 'Officer Dan Brooks', message: 'Review the updated security protocols effective May 1st. Familiarize yourself with...', time: '4:00 PM' },
    { no:5,name: 'Ms. Tina Goldberg', message: 'Reminder: Major IT system upgrade on May 8th from 1 PM to 4 PM.', time: '5:00 PM' },
    { no:6,name: 'Mr. Roberto Gracias', message: 'Reminder: Major IT system upgrade on May 8th from 1 PM to 4 PM.', time: '7:00 PM' },
  ];

  const chatMessages = [
    { no:1,name: 'Mr. Franklin', role: 'School Secretary', message: 'Good morning, everyone! Please remember to update your calendars. The school board meeting has been rescheduled to April 27th at 10 AM.', time: '8:00 AM', type: 'received' },
    { no:2,name: 'Mrs. Thompson', role: 'Vice Principal', message: 'Thanks for the heads-up, Mr. Franklin. I\'ll make sure the agenda items from each department are ready by next Monday. Can someone confirm it next Monday with Mr. Reed?', time: '8:05 AM', type: 'received' },
    { no:3,name: 'Mr. Harris', role: 'Health Services Coordinator', message: 'Can someone confirm if the nurse\'s office will receive additional flu vaccines before the health fair next week?', time: '8:10 AM', type: 'received' },
    { no:4,name: 'Linda Adora', role: 'Admin', message: 'Maintenance update: The gym\'s air conditioning system will be repaired this Wednesday. Gym classes need to be relocated for the day.', time: '8:15 AM', type: 'received' },
    { no:15,name: 'Ms. Patel', role: 'HR Manager', message: 'All staff performance reviews are due by the end of this month. Please submit your reports to HR as soon as possible. Thank you.', time: '8:20 AM', type: 'sent' },
  ];

  return (
    <BaseLayout1>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-4 border-r">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Staff Coordination</h1>
            <div className="flex items-center">
              <button className="p-2 rounded-full bg-gray-100">
                <i className="fas fa-search"></i>
              </button>
              <button className="p-2 rounded-full bg-blue-500 text-white ml-2">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto">
            {contacts.map((contact) => (
              <div key={contact.no} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-2 cursor-pointer hover:bg-gray-200">
                <div>
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-gray-500 font-normal text-[12px]">{contact.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">{contact.time}</p>
                  <div className="bg-[#223857] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-2/4 p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow mb-4">
            {chatMessages.map((chat) => (
              <div key={chat.no} className={`mb-4 ${chat.type === 'sent' ? 'text-right' : ''}`}>
                <p className={`inline-block p-4 rounded-lg ${chat.type === 'sent' ? 'bg-[#223857] text-white' : 'bg-gray-100'}`}>
                  <span className="block font-semibold text-[15px]">{chat.name} <span className="text-xs text-gray-500">{chat.role}</span></span>
                  <span className='font-normal text-[12px]'>{chat.message}</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">{chat.time}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <input type="text" placeholder="Type your message" className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none" />
            <button className="bg-[#223857] text-white p-4 rounded-r-lg">Send</button>
          </div>
        </div>

        {/* Group Info */}
        <div className="w-1/4 bg-white p-6 border-l">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <h2 className="text-base font-semibold">Group Info</h2>
              <p className="text-gray-500 text-sm">Staff Coordination</p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium pb-2">Description</h3>
            <p className="text-gray-500 text-[13px]">This is your go to hub for seamless communication&apos; collaboration&apos; and coordination among our team members. Whether you are working on a project</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium pb-2">Members</h3>
            <div className="overflow-y-auto max-h-48">
              {contacts.slice(0, 4).map((contact) => (
                <div key={contact.no} className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-2"></div>
                  <div>
                    <h4 className="font-semibold text-[13px]">{contact.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Attachments</h3>
            <div className="flex space-x-2">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">Media</div>
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">Files</div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}
