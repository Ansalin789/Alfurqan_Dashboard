"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader"
import axios from "axios"
import BaseLayout1 from "@/components/BaseLayout1"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { View } from 'react-big-calendar'
import { ToolbarProps } from "react-big-calendar"
import { view } from "framer-motion"

interface ClassScheduleResponse {
  totalCount: number;
  classSchedule: ClassSchedule[];
}

interface ClassSchedule {
  student: Student;
  teacher: Teacher;
  course: Course;
  _id: string;
  classDay: string[];
  package: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  gender: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Course {
  courseId: string;
  courseName: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  date: string;
}

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<"monthly" | "weekly" | "daily">("monthly")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [meetings, setMeetings] = useState<ClassSchedule[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<ClassSchedule[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([])

  const localizer = momentLocalizer(moment)
  const [calendarView, setCalendarView] = useState<View>("month")

  const [formData, setFormData] = useState({
    date: moment().format("DD MMMM, YYYY"),
    fromTime: moment().format("HH:mm"),
    toTime: moment().add(1, 'hour').format("HH:mm"),
    comment: "",
  })

  const tabs = ["monthly", "weekly", "daily"] as const

  const meetingTypeColors = {
    "quran class": {
      text: "text-[#21BAFF]",
      border: "border-[#21BAFF]",
      bg: "bg-[#21BAFF]/10",
    },
    "arabic class": {
      text: "text-[#ce4b49]",
      border: "border-[#ce4b49]",
      bg: "bg-[#ce4b49]/10",
    },
    "islamic class": {
      text: "text-[#5362e4]",
      border: "border-[#5362e4]",
      bg: "bg-[#5362e4]/10",
    },
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null
        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found")
          return
        }
        const teacherId = "67c16e29d1515a575ceafbea"
        const response = await axios.get(`https://api.blackstoneinfomaticstech.com/classShedule?teacherId=${teacherId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.data?.classSchedule) {
          const sortedMeetings = response.data.classSchedule.sort(
            (a: ClassSchedule, b: ClassSchedule) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          setMeetings(sortedMeetings)
        }
      } catch (error) {
        console.error("Error fetching meetings:", error)
      }
    }

    fetchMeetings()
  }, [])

  const getMeetingTypeColor = (meetingName: string) => {
    const lowerName = meetingName.toLowerCase()
    if (lowerName.includes("quran")) return meetingTypeColors["quran class"]
    if (lowerName.includes("arabic")) return meetingTypeColors["arabic class"]
    if (lowerName.includes("islamic")) return meetingTypeColors["islamic class"]
    return meetingTypeColors["quran class"]
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    return firstDay.getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" }).toUpperCase()
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startDate)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = moment(date).format("DD MMMM, YYYY")
    
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }))
    
    const dayMeetings = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startDate)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
    
    setFilteredMeetings(dayMeetings)
    
    if (dayMeetings.length > 0) {
      const firstMeeting = dayMeetings[0]
      setFormData(prev => ({
        ...prev,
        fromTime: firstMeeting.startTime[0] || moment().format("HH:mm"),
        toTime: firstMeeting.endTime[0] || moment().add(1, 'hour').format("HH:mm")
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        fromTime: moment().format("HH:mm"),
        toTime: moment().add(1, 'hour').format("HH:mm")
      }))
    }
  }

  const handleClearFilter = () => {
    setSelectedDate(null)
    setFilteredMeetings(meetings)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateClicker = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = moment(date).format("YYYY-MM-DD")
    const filteredEvents = events.filter((event) => event.date === formattedDate)
    setEventsForSelectedDate(filteredEvents)
  }

  const WeeklyView = () => {
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const startOfWeek = moment().startOf("week").toDate()
    const endOfWeek = moment().endOf("week").toDate()

    const weekMeetings = meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startDate)
      return meetingDate >= startOfWeek && meetingDate <= endOfWeek
    })

    const meetingsByDay = weekMeetings.reduce(
      (acc, meeting) => {
        const day = moment(meeting.startDate).format("dddd")
        if (!acc[day]) {
          acc[day] = []
        }
        acc[day].push(meeting)
        return acc
      },
      {} as Record<string, ClassSchedule[]>,
    )

    const handleDayClick = (day: string) => {
      setSelectedDay(selectedDay === day ? null : day)
      
      const dayMeeting = weekMeetings.find((m) => moment(m.startDate).format("dddd") === day)
      if (dayMeeting) {
        const date = new Date(dayMeeting.startDate)
        handleDateClick(date)
      } else {
        const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day)
        const date = moment().startOf("week").add(dayIndex, 'days').toDate()
        handleDateClick(date)
      }
    }

    return (
      <div className="space-y-4 h-[540px] md:h-[540px] sm:h-[400px] overflow-y-scroll scrollbar-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-[16px] font-semibold">
            {moment(startOfWeek).format("MMM D")} - {moment(endOfWeek).format("MMM D, YYYY")}
          </h3>
        </div>

        <div className="space-y-2">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
            const dayMeetings = meetingsByDay[day] || []
            const isSelected = selectedDay === day
            const date = moment(weekMeetings.find((m) => moment(m.startDate).format("dddd") === day)?.startDate)

            return (
              <div key={day} className="flex flex-col">
                <button
                  onClick={() => handleDayClick(day)}
                  className={`w-full p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "dark:bg-[#414141] bg-[#f7f7f7] dark:text-white text-black"
                      : dayMeetings.length > 0
                        ? " dark:bg-[#414141] bg-[#f7f7f7] shadow-md hover:shadow-lg text-black"
                        : "bg-[#f7f7f7] dark:bg-[#414141] text-black"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div
                          className={`text-sm md:text-base font-semibold ${
                            isSelected ? "dark:text-white text-black" : "text-gray-800 dark:text-white"
                          }`}
                        >
                          {day}
                        </div>
                        <div
                          className={`text-[9px] md:text-[10px] ${
                            isSelected ? "bg:text-white/80" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {date.format("MMMM D, YYYY")}
                        </div>
                      </div>
                    </div>
                    {dayMeetings.length > 0 && (
                      <div
                        className={`text-[9px] md:text-[10px] px-2 md:px-3 py-1 rounded-lg ${
                          isSelected
                            ? "dark:bg-[#555555] dark:text-white text-black  bg-[#eae9e9]"
                            : "dark:bg-[#555555] dark:text-white text-black bg-[#eae9e9]"
                        }`}
                      >
                        {dayMeetings.length} {dayMeetings.length === 1 ? "Meeting" : "Meetings"}
                      </div>
                    )}
                  </div>
                </button>

                {isSelected && dayMeetings.length > 0 && (
                  <div className="w-full mt-2 space-y-2 pl-4">
                    {dayMeetings.map((meeting, idx) => {
                      const colors = getMeetingTypeColor(meeting.course.courseName)
                      return (
                        <div
                          key={idx}
                          className={`p-2 md:p-3 rounded-lg ${colors.bg} dark:bg-[#414141] bg-[#f7f7f7] relative`}
                        >
                          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 md:h-8 rounded-lg dark:bg-[#555555] bg-[#f7f7f7]"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`text-xs md:text-sm font-semibold ${colors.text}`}>
                                {meeting.course.courseName} Class
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-600 dark:text-gray-300">
                                <Clock size={10} className="md:w-3 md:h-3" />
                                {meeting.startTime} - {meeting.endTime}
                              </div>
                            </div>
                          </div>
                          <div className="text-[9px] md:text-[10px] text-gray-600 dark:text-gray-300 mt-1">
                            {meeting.student.studentFirstName}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const DailyView = () => {
    useEffect(() => {
      handleDateClick(currentDate)
    }, [currentDate])

    const dayMeetings = getMeetingsForDate(currentDate)

    return (
      <div className="space-y-4 h-[500px] md:h-[600px] overflow-y-scroll scrollbar-none">
        {dayMeetings.map((meeting, idx) => {
          const colors = getMeetingTypeColor(meeting.course.courseName)
          return (
            <div
              key={idx}
              className={`p-3 md:p-4 text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff]`}
            >
              <div className="flex justify-between items-start">
                <div className={`text-xs md:text-sm font-semibold ${colors.text}`}>{meeting.course.courseName}</div>
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-600 dark:text-gray-300">
                  <Clock size={10} className="md:w-3 md:h-3" />
                  {meeting.startTime} - {meeting.endTime}
                </div>
              </div>

              <div className="text-[9px] md:text-[10px] text-gray-400 mt-1">{meeting.student.studentFirstName}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const MonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null)
    const totalDays = [...emptyCells, ...days]

    return (
      <>
        <div className="flex items-end justify-end mb-4 -mt-6 md:-mt-10 gap-2">
          <button
            onClick={handlePrevMonth}
            className="py-[1px] px-2 rounded-lg bg-gray-100 dark:bg-[#414141] hover:bg-gray-200 dark:hover:bg-[#505050] transition-colors text-sm"
          >
            &lt;
          </button>
          <h2 className="text-sm md:text-[16px] font-semibold">{formatMonthYear(currentDate)}</h2>
          <button
            onClick={handleNextMonth}
            className="py-[1px] px-2 rounded-lg bg-gray-100 dark:bg-[#414141] hover:bg-gray-200 dark:hover:bg-[#505050] transition-colors text-sm"
          >
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 mt-8 md:mt-12 gap-1 md:gap-2 text-center text-xs md:text-sm font-medium text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl p-2 md:p-3 dark:text-[#fff]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 text-xs md:text-sm h-[350px] md:h-[455px] overflow-scroll scrollbar-none">
          {totalDays.map((day, i) => {
            if (day === null) {
              return <div key={i} className="min-h-[50px] md:min-h-[80px] bg-transparent" />
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const dayMeetings = getMeetingsForDate(date)
            const hasMeetings = dayMeetings.length > 0
            const colors = hasMeetings ? getMeetingTypeColor(dayMeetings[0].course.courseName) : null
            const isSelected =
              selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear()

            return (
              <button
                key={i}
                onClick={() => handleDateClick(date)}
                className={`min-h-[50px] md:min-h-[80px] rounded-xl flex flex-col items-center justify-start mt-1 p-1 cursor-pointer ${
                  hasMeetings
                    ? `${colors?.border} ${colors?.text} ${colors?.bg} border text-[9px] md:text-[10px]`
                    : isToday(day)
                      ? "bg-[#27176518] text-white"
                      : "bg-gray-100 dark:bg-[#414141] dark:text-[#fff] text-gray-500"
                } ${isSelected ? "ring-1 md:ring-2 ring-[#576cbc]" : ""}`}
              >
                <div
                  className={`font-semibold text-xs md:text-sm ${isToday(day) ? "dark:text-[#4b8cc9] text-[#4b8cc9]" : ""}`}
                >
                  {day}
                </div>
                {hasMeetings && (
                  <div className="w-full overflow-hidden">
                    <div className="text-[8px] md:text-[9px] truncate px-1">{dayMeetings[0].course.courseName}</div>
                    <div className="text-[7px] md:text-[8px] truncate px-1">
                      {dayMeetings[0].startTime} - {dayMeetings[0].endTime}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <BaseLayout1>
      <SupervisorHeader currentSection="Calendar" showBackButton={true} showBackPath="/supervisor/ui/dashboard" />
      <div className="p-2">
        <div className="mx-auto gap-4 flex flex-col lg:flex-row overflow-hidden min-h-[630px]">
          <div className="w-full lg:w-2/3 p-4 md:p-6 bg-white dark:bg-[#343434] shadow-md rounded-xl">
            <div className="flex space-x-4 text-xs md:text-sm font-medium mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`capitalize ${
                    activeView === tab ? "text-[#576cbc] border-b-2 border-[#576cbc]" : "text-gray-400"
                  } pb-1`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeView === "monthly" && <MonthlyView />}
            {activeView === "weekly" && <WeeklyView />}
            {activeView === "daily" && <DailyView />}
          </div>

          <div className="w-full lg:w-1/3 bg-white dark:bg-[#343434] shadow-md rounded-xl flex flex-col min-h-[500px] lg:h-[700px]">
            <div className="p-4 md:p-6">
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">Add New Schedule</h3>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full h-[38px] md:h-[42px] px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2b2b2b] text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Select date"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      From Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.fromTime}
                        onChange={(e) => handleInputChange("fromTime", e.target.value)}
                        className="w-full h-[38px] md:h-[42px] px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2b2b2b] text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div> */}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      To Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.toTime}
                        onChange={(e) => handleInputChange("toTime", e.target.value)}
                        className="w-full h-[38px] md:h-[42px] px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2b2b2b] text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div> */}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => handleInputChange("comment", e.target.value)}
                    rows={4}
                    className="w-full h-[90px] md:h-[110px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2b2b2b] text-xs md:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your comment here..."
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[50px] lg:min-h-[150px]"></div>

            <div className="p-4 md:p-6">
              <hr className="w-full border-t-[1px] border-gray-300 dark:border-gray-600 mb-4" />
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleFormSubmit}
                  className="px-6 md:px-8 py-2 md:py-2.5 bg-[#576cbc] hover:bg-[#4a5ba3] text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  )
}

export default SchedulePage