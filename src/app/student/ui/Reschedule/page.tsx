'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BaseLayout2 from '@/components/BaseLayout2';

const localizer = momentLocalizer(moment);

const TeacherReschedule = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // For success modal


  // Fetch events data
  useEffect(() => {
    const auth = localStorage.getItem('authToken');
    fetch('http://localhost:5001/meetingSchedulelist', {
      headers: {
        Authorization: `Bearer ${auth}`,
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

  // Helper function to generate 24-hour time slots
  const generateTimeSlots = () => {
    const timeSlots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(0, 0, 0, hour, minute);
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        timeSlots.push(formattedTime);
      }
    }
    return timeSlots;
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSlot(e.target.value);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedSlot && reason) {
      setShowPopup(true); // Show confirmation popup
    } else {
      alert('Please fill all required fields.');
    }
  };

  const handlePopupAction = (action: string) => {
    setShowPopup(false); // Hide popup
    if (action === "yes") {
      setShowSuccessModal(true); // Show success modal
      // Add API call or other functionality here if needed
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Close the success modal
  };

  return (
    <BaseLayout2>
      <div className="flex flex-wrap h-screen p-6 gap-6">
        {/* Calendar Section */}
        <div className="w-[510px] mb-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">ReSchedule</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="w-[650px] h-[550px]"
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

        {/* Reschedule Form Section */}
        <div className="w-[350px] ml-64 mt-36">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select your Preferred Time Slot</h2>
          <div className="mb-4 flex">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSlot}
              onChange={handleSlotChange}
              className="block w-[40%] text-[11px] bg-[#DFE4F8] border-black opacity-[19%] border text-black py-1 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">Select</option>
              {generateTimeSlots().map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">Reason for Re-Schedule</label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={handleReasonChange}
              placeholder="Type here..."
              rows={4}
              className="block w-full bg-[#DFE4F8] border border-gray-300 text-gray-800 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            className="w-[200px] ml-16 text-center justify-center bg-[#1C3557] hover:bg-[#142741] text-white font-semibold py-2 px-4 rounded-full shadow-sm shadow-[#1C3557] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request Re-Schedule
          </button>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-[#F6F3FF] p-6 rounded-lg shadow-lg w-[300px] text-center">
            <p className="text-gray-800 font-semibold mb-4">Are you sure that you want to reschedule the Class?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePopupAction("yes")}
                className="bg-white border border-gray-800 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-100"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-[#223857] text-white py-2 px-4 rounded-full opacity-65 hover:bg-gray-800"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <p className="text-center text-[14px] font-semibold text-gray-800">
              Reschedule Request Submitted Successfully
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeSuccessModal}
                className="px-6 py-2 text-[13px] border border-t-black border-b-black bg-[#25A105] text-white rounded-lg hover:bg-[#237d0d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseLayout2>
  );
};

export default TeacherReschedule;
