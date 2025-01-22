import React, { useEffect, useState } from 'react';
import BaseLayout from '@/components/BaseLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import API_URL from '@/app/acendpoints/page';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type?: string;
  date: string;
}

interface AcademicCoachItem {
  subject: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  description: string;
}

const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const today = moment().format('YYYY-MM-DD');

  // Fetch events data
  useEffect(() => {
    const auth = localStorage.getItem('authToken');
    fetch(`${API_URL}/meetingSchedulelist`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: AcademicCoachItem) => ({
          id: item.scheduledStartDate,
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

  // Handle date selection
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const filteredEvents = events.filter((event) => event.date === date);
    setEventsForSelectedDate(filteredEvents);
  };

  // Handle navigation
  const handleNavigate = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleDateClick(formattedDate);
  };

  // Today's schedules
  const todaysEvents = events.filter((event) => event.date === today);

  return (
    <BaseLayout>
      <div className="flex flex-col h-screen p-6">
        <h1 className="text-[25px] font-bold mb-6">Class Schedule</h1>
        <div className="flex gap-6">
          {/* Calendar Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={['month']}
              defaultView="month"
              toolbar={false}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Sidebar Section */}
          <div className="w-72 bg-white rounded-lg shadow p-4">
            <h2 className="text-[18px] font-semibold mb-4">Today's Schedules</h2>
            <div className="space-y-4 overflow-y-scroll h-[450px]">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gray-100 rounded-md shadow-sm border-l-4 border-blue-500"
                  >
                    <h3 className="font-medium text-[14px]">{event.title}</h3>
                    <p className="text-[12px] text-gray-500">
                      {moment(event.start).format('h:mm A')} -{' '}
                      {moment(event.end).format('h:mm A')}
                    </p>
                    <p className="text-[13px] text-gray-600 mt-1">
                      {event.description || 'No description available.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No schedules for today.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Schedules;
