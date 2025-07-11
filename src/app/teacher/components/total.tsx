"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { getSocket } from "@/app/utils/socket"

interface TeacherDashboardStats {
  totalclasses: number
  totalstudents: number
  totalhours: number
  totalearnings: number
}

const Total = () => {
  const [stats, setStats] = useState<TeacherDashboardStats>({
    totalclasses: 0,
    totalstudents: 0,
    totalhours: 0,
    totalearnings: 0,
  })



  const safeNumber = (value: unknown): number => {
    if (typeof value === "string") {
      const cleaned = value.replace(/[$,]/g, "")
      const num = Number.parseFloat(cleaned)
      return isNaN(num) ? 0 : num
    }
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  

  const fetchData = async () => {
    const teacherId = localStorage.getItem("TeacherPortalId")
    const token = localStorage.getItem("TeacherAuthToken")

    console.log("Teacher ID:", teacherId) // Debug log
    console.log("Token exists:", !!token) // Debug log (don't log actual token)

    if (!teacherId || !token) {
      return
    }

    try {
      console.log("Making API call...") 

const response = await axios.get("https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts", {
  params: { teacherId },
  headers: {
    Authorization: `Bearer ${token}`,
  },
})


      console.log("API Response:", response.data) // Debug log

      const data = response.data

      // Validate response structure
      if (typeof data !== "object" || data === null) {
        throw new Error("Invalid response format")
      }

      setStats({
        totalclasses: safeNumber(data.totalclasses),
        totalstudents: safeNumber(data.totalstudents),
        totalhours: safeNumber(data.totalhours),
        totalearnings: safeNumber(data.totalearnings),
      })


    } catch (err: any) {
      console.error("API Error:", err)
      let errorMessage;
      if (err.response) {
        // Server responded with error status
        console.error("Error response:", err.response.data)
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection."
      } else {
        // Something else happened
        errorMessage = err.message || "Unknown error occurred"
      }
      console.log(errorMessage);
    } 
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const teacherId = typeof window !== "undefined" ? localStorage.getItem("TeacherPortalId") : null;
    if (!teacherId) return
    const socket = getSocket(teacherId)
    const handleLiveStats = (data: TeacherDashboardStats) => {
      console.log("Received live stats:", data) 
      setStats({
        totalclasses: safeNumber(data.totalclasses),
        totalstudents: safeNumber(data.totalstudents),
        totalhours: safeNumber(data.totalhours),
        totalearnings: safeNumber(data.totalearnings),
      })
    }
    socket.on("teacherDashboardCardCount", handleLiveStats)
    return () => {
      socket.off("teacherDashboardCardCount", handleLiveStats)
    }
  }, [])

  const cards = [
    {
      title: "Total Classes",
      count: stats.totalclasses ?? 0,
      icon: "/assets/images/tc1.svg",
      bg: "bg-[#e3efff] dark:bg-[#3e4e50]",
    },
    {
      title: "Total Students",
      count: stats.totalstudents ?? 0,
      icon: "/assets/images/tc2.svg",
      bg: "bg-[#ede5ff] dark:bg-[#3f3e50]",
    },
    {
      title: "Total Hours",
      count: stats.totalhours ?? 0,
      icon: "/assets/images/tc3.svg",
      bg: "bg-[#ffe9e9] dark:bg-[#503e3e]",
    },
    {
      title: "Total Earnings",
      count: `$${stats.totalearnings}`,
      icon: "/assets/images/tc4.svg",
      bg: "bg-[#fff5d4] dark:bg-[#504d3e]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex items-center justify-between p-5 rounded-2xl shadow-sm bg-white dark:bg-[#343434] dark:text-[#fff]"
        >
          <div>
            <p className="text-[14px] font-medium text-black dark:text-white">{card.title}</p>
            <p className="text-[28px] font-semibold text-black dark:text-white">{card.count}</p>
          </div>
          <div className={`${card.bg} p-3 rounded-full flex items-center justify-center`}>
            <Image
              src={card.icon || "/placeholder.svg"}
              alt={card.title}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Total
