"use client"

import BaseLayout2 from "@/components/BaseLayout2"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaCalendarAlt, FaSort } from "react-icons/fa"
import { BsThreeDots } from "react-icons/bs"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import MyClass from "./MyClass"
import axios from "axios"

interface Student {
  studentId: string
  studentFirstName: string
  studentLastName: string
  studentEmail: string
}

interface Teacher {
  teacherId: string
  teacherName: string
  teacherEmail: string
}

interface ClassData {
  _id: string
  student: Student
  teacher: Teacher
  classDay: string[]
  package: string
  preferedTeacher: string
  totalHourse: number
  startDate: string
  endDate: string
  startTime: string[]
  endTime: string[]
  scheduleStatus: string
  classLink: string
  status: string
  classStatus: string
  createdBy: string
  createdDate: string
  lastUpdatedDate: string
}

interface ApiResponse {
  totalCount: number
  classSchedule: ClassData[]
}

type SortableKeys = "classID" | "teacherName" | "package" | "startDate" | "status"

const Classes = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed">("Upcoming")
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([])
  const [completedClasses, setCompletedClasses] = useState<ClassData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [popupVisible, setPopupVisible] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortKey, setSortKey] = useState<SortableKeys>("classID")
  const [isPremiumUser] = useState(true) // Replace with actual role determination logic
  const itemsPerPage = 5

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const studentId = localStorage.getItem("StudentPortalId")
        const authToken = localStorage.getItem("StudentAuthToken")
        if (!studentId || !authToken) {
          console.log("Missing studentId or authToken")
          return
        }

        const response = await axios.get<ApiResponse>("https://alfurqanacademy.tech/classShedule/students", {
          params: { studentId },
          headers: { Authorization: `Bearer ${authToken}` },
        })
        const classes = response.data.classSchedule

        const now = new Date()
        const upcoming = classes.filter((cls) => {
          const classDate = new Date(cls.startDate)
          const [startHours, startMinutes] = cls.startTime[0].split(":").map(Number)
          classDate.setHours(startHours, startMinutes, 0, 0)
          return now < classDate
        })

        const completed = classes.filter((cls) => new Date(cls.startDate) <= now)

        setUpcomingClasses(upcoming)
        setCompletedClasses(completed)
      } catch (error) {
        console.error("Error fetching class data:", error)
      }
    }
    fetchClasses()
  }, [])

  const sortClasses = (classes: ClassData[]) => {
    return classes.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortKey as keyof ClassData] > b[sortKey as keyof ClassData] ? 1 : -1
      }
      return a[sortKey as keyof ClassData] < b[sortKey as keyof ClassData] ? 1 : -1
    })
  }

  const filteredClasses = activeTab === "Upcoming" ? sortClasses(upcomingClasses) : sortClasses(completedClasses)
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const displayedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleTabChange = (tab: "Upcoming" | "Completed") => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePopupToggle = (classId: string) => {
    setPopupVisible(popupVisible === classId ? null : classId)
  }

  const handleReschedule = (classId: string) => {
    router.push(`/student/ui/Reschedule?classId=${classId}`)
  }

  const handleCancel = (classId: string) => {
    console.log(`Cancel clicked for classId: ${classId}`)
    setPopupVisible(null)
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const handleSort = (key: SortableKeys): void => {
    const order = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(order)
    setSortKey(key)
  }

  const handleUpgradePlan = () => {
    setPopupVisible(null)
    console.log("User prompted to switch to a higher plan.")
  }

  return (
    <BaseLayout2>
      <style>
        {`
          .custom-datepicker {
            width: 80px;
            text-align: center;
            border: 2px solid #1C3557;
            border-radius: 8px;
            padding: 5px;
            background-color: #f0f8ff;
          }

          .react-datepicker {
            border-radius: 8px;
            background-color: white;
          }

          .react-datepicker__header {
            background-color: #1C3557;
            color: white !important;
          }
          .react-datepicker__header .react-datepicker__current-month,
          .react-datepicker__header .react-datepicker__day-name {
            color: white !important;
          }

          .react-datepicker__day {
            color: #1C3557 !important;
          }
        `}
      </style>

      <div className="p-4 mx-auto w-[1250px] pr-12 pl-4">
        <MyClass />
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800 p-2">Scheduled Classes</h2>

          <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] flex flex-col justify-between">
            <div>
              <div className="flex">
                <button
                  onClick={() => handleTabChange("Upcoming")}
                  className={`py-3 px-2 ml-5 ${
                    activeTab === "Upcoming"
                      ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                      : "text-gray-500"
                  } focus:outline-none text-[13px]`}
                >
                  Upcoming ({upcomingClasses.length})
                </button>
                <button
                  onClick={() => handleTabChange("Completed")}
                  className={`py-3 px-6 ${
                    activeTab === "Completed"
                      ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                      : "text-gray-500"
                  } focus:outline-none text-[13px]`}
                >
                  Completed ({completedClasses.length})
                </button>
              </div>
              <div className="flex justify-end px-[50px] h-6">
                <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden">
                  <div className="px-3 py-2 flex items-center">
                    <FaCalendarAlt className="text-[#1C3557] text-sm" />
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-20 text-[10px] text-gray-600 focus:outline-none"
                    placeholderText="ddmmyy"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-center">
                        Class ID <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort("classID")} />
                      </th>
                      <th className="px-6 py-3 text-center">
                        Teacher Name{" "}
                        <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort("teacherName")} />
                      </th>
                      <th className="px-6 py-3 text-center">
                        time <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort("startDate")} />
                      </th>
                      <th className="px-6 py-3 text-center">
                        Start Date{" "}
                        <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort("startDate")} />
                      </th>
                      <th className="px-6 py-3 text-center">Scheduled</th>

                      {activeTab === "Completed" && <th className="px-6 py-3 text-center">Status</th>}
                      {activeTab === "Upcoming" && <th className="px-6 py-3 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedClasses.map((item) => (
                      <tr
                        key={item._id}
                        className="text-[12px] font-medium mt-2"
                        style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}
                      >
                        <td className="px-6 py-3 text-center">{item._id}</td>
                        <td className="px-6 py-3 text-center">{item.teacher.teacherName}</td>
                        <td className="px-6 py-3 text-center">{`${item.startTime[0]} - ${item.endTime[0]}`}</td>
                        <td className="px-6 py-3 text-center">{new Date(item.startDate).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-center">{item.classStatus}</td>
                        
                        {activeTab === "Completed" && (
                          <td className="px-6 py-2 text-center">
                            <div className="px-2 py-2 text-[#223857] rounded-lg border-[1px] border-[#95b690] bg-[#D0FECA] text-[10px]">
                              {item.status}
                            </div>
                          </td>
                        )}
                        {activeTab === "Upcoming" && (
                          <td className="relative px-6 py-3 text-center">
                            <BsThreeDots className="cursor-pointer" onClick={() => handlePopupToggle(item._id)} />
                            {popupVisible === item._id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                {isPremiumUser ? (
                                  <>
                                    <button
                                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => handleReschedule(item._id)}
                                    >
                                      Reschedule
                                    </button>
                                    <button
                                      className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-100"
                                      onClick={() => handleCancel(item._id)}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-[#fff5f3] p-10 rounded shadow border border-[#F4B0A1] flex">
                                      <p className="text-[#27303A] text-lg font">
                                        Switch to a higher plan for extended benefits...
                                      </p>
                                      <button
                                        className="bg-[#1C3557] text-white px-4 py-2 rounded text-center ml-10"
                                        onClick={handleUpgradePlan}
                                      >
                                        OK
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex justify-end items-center px-6 py-3">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-5 h-5 text-[13px] flex items-center justify-center rounded ${
                          page === currentPage ? "bg-[#1C3557] text-white" : "text-[#1C3557] border border-[#1C3557]"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout2>
  )
}

export default Classes

