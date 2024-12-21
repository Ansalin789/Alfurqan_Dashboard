// // import React, { useState, useEffect } from "react";
// // import Calendar from "react-calendar";
// // import "react-calendar/dist/Calendar.css";
// // import "./Calendar.css";
// // import axios from "axios";

// // const Academic = () => {
// //   const [value, setValue] = useState<Date | null>(new Date());
// //   const [meetingDates, setMeetingDates] = useState<string[]>([]);

// //   // Fetch meeting schedule dates from the API
// //   useEffect(() => {
// //     const fetchMeetingDates = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:5001/meetingSchedulelist");
// //         const dates = response.data.map((item: { date: string }) => item.date); // Assuming the API returns a list of dates
// //         setMeetingDates(dates);
// //       } catch (error) {
// //         console.error("Error fetching meeting dates:", error);
// //       }
// //     };

// //     fetchMeetingDates();
// //   }, []);

// //   // Check if the date is a meeting date
// //   const isMeetingDate = (date: Date) => {
// //     const dateString = date.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
// //     return meetingDates.includes(dateString);
// //   };

// //   return (
// //     <div className="flex items-center justify-center mt-12">
// //       <a href="/Academic/schedule">
// //         <div className="calendar-container rounded-[50px] -ml-28">
// //           <Calendar
// //             onChange={(newValue) => setValue(newValue as Date)}
// //             value={value}
// //             className="custom-calendar"
// //             navigationLabel={({ date }) => {
// //               return `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`;
// //             }}
// //             nextLabel="›"
// //             prevLabel="‹"
// //             next2Label={null}
// //             prev2Label={null}
// //             showNeighboringMonth={false}
// //             tileClassName={({ date }) => {
// //               // Highlight meeting dates with a custom class
// //               return isMeetingDate(date) ? "highlighted" : "";
// //             }}
// //           />
// //         </div>
// //       </a>
// //     </div>
// //   );
// // };

// // export default Academic;

// 'use client'
// import React, { useEffect, useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import "react-calendar/dist/Calendar.css";


// const localizer = momentLocalizer(moment);

// const Academic: React.FC = () => {
//   const [events, setEvents] = useState<any[]>([]);

//   useEffect(() => {
//     fetch('http://localhost:5001/meetingSchedulelist')
//       .then((response) => response.json())
//       .then((data) => {
//         const mappedEvents = data.academicCoach.map((item: any) => {
//           return {
//             title: item.subject,
//             start: new Date(item.scheduledStartDate), // Start Date
//             end: new Date(item.scheduledEndDate), // End Date
//             allDay: false,
//             description: item.description,
//             meetingLink: item.meetingLink,
//             studentName: item.student.name,
//             teacherName: item.academicCoach.name,
//             course: item.course.courseName,
//             meetingLocation: item.meetingLocation,
//             scheduledFrom: item.scheduledFrom,
//             scheduledTo: item.scheduledTo,
//           };
//         });
//         setEvents(mappedEvents);
//       })
//       .catch((error) => console.error('Error fetching data: ', error));
//   }, []);
//   const eventStyleGetter = (event: any) => {
//     return {
//       style: {
//         backgroundColor:'#B0E0E6',
//         color: '#0000CD',
//         borderRadius: '4px',
//         padding: '3px',
//         fontSize: '12px', 
//       },
//     };
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow-lg">
//       {/* <Calendar
//       localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 600, fontSize: '12px' }}
//         views={['month', 'week', 'day']}
//         defaultView="month"
//         toolbar
//         eventPropGetter={eventStyleGetter}
//       /> */}
//         <Calendar
//             onChange={(newValue) => setValue(newValue as Date)}
//             value={value}
//             className="custom-calendar"
//             navigationLabel={({ date }) => {
//               return `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`;
//             }}
//             nextLabel="›"
//             prevLabel="‹"
//             next2Label={null}
//             prev2Label={null}
//             showNeighboringMonth={false}
//             tileClassName={({ date }) => {
//               // Highlight meeting dates with a custom class
//               return isMeetingDate(date) ? "highlighted" : "";
//             }}
//           />
//     </div>
//   );
// };
// export default Academic;


'use client';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const Academic: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    fetch('http://localhost:5001/meetingSchedulelist')
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => ({
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
        }));
        setEvents(mappedEvents);
        console.log("Fetched Events: ", mappedEvents);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const isMeetingDate = (date: Date) => {
    return events.some((event) => {
      const eventStart = new Date(event.start);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <a href="/Academic/schedule">
        <Calendar
          onChange={(newValue) => setValue(newValue as Date)}
          value={value}
          className="custom-calendar"
          navigationLabel={({ date }) =>
            `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`
          }
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
          tileContent={({ date, view }) =>
            view === 'month' && isMeetingDate(date) ? (
              <div
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '50%',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {date.getDate()}
              </div>
            ) : null
          }
        />
      </a>
    </div>
  );
};

export default Academic;

