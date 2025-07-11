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

  const formatNumber = (num: number, isCurrency = false): string => {
    if (isCurrency) {
      return num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
    return num.toLocaleString()
  }

  const fetchData = async () => {
    const teacherId = localStorage.getItem("TeacherPortalId")
    const token = localStorage.getItem("TeacherAuthToken")

    if (!teacherId || !token) return

    try {
      const response = await axios.get("https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts", {
        params: { teacherId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response.data

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
        errorMessage = err.response.data?.error || `Server error: ${err.response.status}`
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection."
      } else {
        errorMessage = err.message || "Unknown error occurred"
      }
      console.log(errorMessage);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const teacherId = typeof window !== "undefined" ? localStorage.getItem("TeacherPortalId") : null
    if (!teacherId) return

    const socket = getSocket(teacherId)
    const handleLiveStats = (data: TeacherDashboardStats) => {
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
      count: formatNumber(stats.totalclasses),
      icon: "/assets/images/tc1.svg",
      bg: "bg-[#e3efff] dark:bg-[#3e4e50]",
    },
    {
      title: "Total Students",
      count: formatNumber(stats.totalstudents),
      icon: "/assets/images/tc2.svg",
      bg: "bg-[#ede5ff] dark:bg-[#3f3e50]",
    },
    {
      title: "Total Hours",
      count: formatNumber(stats.totalhours),
      icon: "/assets/images/tc3.svg",
      bg: "bg-[#ffe9e9] dark:bg-[#503e3e]",
    },
    {
      title: "Total Earnings",
      count: formatNumber(stats.totalearnings, true),
      icon: "/assets/images/tc4.svg",
      bg: "bg-[#fff5d4] dark:bg-[#504d3e]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
  {cards.map((card) => (
    <div
      key={card.title}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#343434] rounded-2xl shadow-sm px-5 py-5 w-full min-h-[120px]"
    >
      {/* Text Section */}
      <div className="flex-1 text-center sm:text-left overflow-hidden">
        <p className="text-black dark:text-white font-medium text-[clamp(14px,1.2vw,18px)] leading-tight">
          {card.title}
        </p>
        <p className="text-black dark:text-white font-semibold text-[clamp(22px,2.2vw,32px)] leading-tight break-words">
          {card.count}
        </p>
      </div>

      {/* Icon Section */}
      <div
        className={`${card.bg} rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden`}
        style={{
          width: "clamp(48px, 4vw, 60px)",
          height: "clamp(48px, 4vw, 60px)",
        }}
      >
        <Image
          src={card.icon}
          alt={card.title}
          width={40}
          height={40}
          className="object-contain"
          style={{
            width: "80%",
            height: "80%",
            maxWidth: "40px",
            maxHeight: "40px",
          }}
        />
      </div>
    </div>
  ))}
</div>

  )
}

export default Total
