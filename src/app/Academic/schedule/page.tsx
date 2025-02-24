'use client';

import React, { useEffect, useState } from 'react';
import BaseLayout1 from '@/components/BaseLayout1';
import { Calendar, momentLocalizer, View, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  date: string; // Used for filtering
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>('month');

  useEffect(() => {
    const auth = localStorage.getItem('authToken');
    fetch(`https://alfurqanacademy.tech/meetingSchedulelist`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => ({
          id: item._id,
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
          description: item.description,
          date: moment(item.scheduledStartDate).format('YYYY-MM-DD'),
        }));
        setEvents(mappedEvents);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);

    const filteredEvents = events.filter((event) => event.date === formattedDate);
    setEventsForSelectedDate(filteredEvents);
  };

  return (
    <BaseLayout1>
      <div className="flex flex-col">
        <div className="flex-1 p-6 h-16">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{moment(selectedDate).format('MMMM YYYY')}</h1>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Calendar Component */}
            <div className="col-span-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 700, width: 1050 }}
                  views={['month', 'week', 'day']}
                  view={view}
                  onView={(newView) => setView(newView)}
                  onNavigate={handleDateClick}
                  onSelectSlot={({ start }) => handleDateClick(start)}
                  selectable
                  popup
                  components={{
                    toolbar: CustomToolbar, // Custom toolbar to remove next/back/today
                  }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.title.includes('Meeting') ? '#fcd4d4' : '#e8fcd8',
                      color: '#000',
                    },
                  })}
                />
              </div>
            </div>

            {/* List Schedule */}
            <div className="col-span-1">
              <div className="bg-white p-6 w-72 rounded-lg shadow overflow-y-scroll h-[747px] scrollbar-thin">
                <h2 className="text-[18px] font-semibold mb-6">
                 List Schedule for {moment(selectedDate).format('DD MMM YYYY')}
                </h2>
                <div className="space-y-6">
                  {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((item) => (
                      <div key={item.id} className="border-b pb-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-[14px]">{item.title}</h3>
                          <span className="text-[11px] text-gray-500 text-end">
                            {moment(item.start).format('DD MMM YYYY')}
                          </span>
                        </div>
                        <div className="text-[12px] text-gray-500">
                          {moment(item.start).format('h:mm A')} - {moment(item.end).format('h:mm A')}
                        </div>
                        <p className="text-[13px] text-gray-600 mt-2">{item.description || ''}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No events scheduled</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default SchedulePage;

const CustomToolbar: React.FC<ToolbarProps<Event, object>> = ({ label, onView, view }) => {
  return (
    <div className="flex justify-center items-center p-3 gap-3">
      <h2 className="text-lg font-semibold">{label}</h2>
      <div className="flex gap-2 ml-[650px]">
        <button
          onClick={() => onView('month')}
          className={`px-3 py-1 rounded ${view === 'month' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
        >
          Month
        </button>
        <button
          onClick={() => onView('week')}
          className={`px-3 py-1 rounded ${view === 'week' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
        >
          Week
        </button>
        <button
          onClick={() => onView('day')}
          className={`px-3 py-1 rounded ${view === 'day' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
        >
          Day
        </button>
      </div>
    </div>
  );
};
