'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddScheduleModal from '@/components/Academic/ViewTeachersList/AddScheduleModel';
import { FaCheck } from 'react-icons/fa';
import BaseLayout from '@/components/BaseLayout';

const localizer = momentLocalizer(moment);

const Teachereschedule = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // Fetch events data
  useEffect(() => {
    const auth=localStorage.getItem('authToken');
    fetch('http://localhost:5001/meetingSchedulelist',{
      headers: {
         'Authorization': `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => ({
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
          allDay: false,
          description: item.description,
        }));
        setEvents(mappedEvents);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleSuccessMessage = () => {
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 3000); // Hide message after 3 seconds
  };

  const userRole = "academicCoach";

  return (
    <BaseLayout role={userRole}>
      <div className="flex flex-col h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[25px] text-[#012A4A] font-bold">Reschedule Class</h1>
          <button
            className="bg-[#012A4A] text-white text-[14px] px-4 py-2 rounded-md"
            onClick={() => setIsModalOpen(true)} // Open the modal
          >
            + Add Reschedule
          </button>
        </div>

        {/* Calendar */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow ml-20">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className='w-[900px] h-[600px]'
            views={['month']}
            defaultView="month"
            toolbar={false}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#E9EBFF',
                color: '#012A4A',
                borderRadius: '4px',
                padding: '4px 6px',
                fontSize: '12px',
              },
            })}
          />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-green-500 p-4 rounded-lg shadow-lg text-center flex items-center">
              <div className="flex items-center justify-center mr-2">
                <span className="text-white p-2 bg-green-600 rounded-full text-2xl"><FaCheck /></span>
              </div>
              <p className="text-white font-semibold">Class Rescheduled successfully</p>
            </div>
          </div>
        )}

      </div>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessMessage}
      />
    </BaseLayout>
  );
};

export default Teachereschedule;
