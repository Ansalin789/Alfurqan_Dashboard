'use client'
import { useState, useEffect } from "react"
import { Check, Clock, X } from "lucide-react"


interface TrialRequestData {
  totalTrialRequest: number
  pendingRequest: number
  pendingRequestPercentage: number
  joinedStudents: number
  joinedStudentsPercentage: number
  notJoinedStudents: number
  notJoinedrequestPercentage: number
}

export default function TrialRequests() {

  const [data, setData] = useState<TrialRequestData | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchData(token); // pass token into the function
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);
    const fetchData = async (token: string) => {
      try {
        const response = await fetch("https://api.blackstoneinfomaticstech.com/dashboard/admin/totaltrialrequest",{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch trial request data:", error)
      }
    }


  const requests = data
  ? [
    {
      status: "Trails Request",
      icon: Clock,
      percentage: data.pendingRequestPercentage,
      total: data.pendingRequest,
      color: "bg-[#9EABD3]",
    },
      {
        status: "Joined" ,
        icon: Check,
        percentage: data.joinedStudentsPercentage,
        total: data.joinedStudents,
        color: "bg-[#9EABD3]",
      },
      {
        status: "Not joined",
        icon: X,
        percentage: data.notJoinedrequestPercentage,
        total: data.notJoinedStudents,
        color: "bg-[#9EABD3]",
      },
    ]
  : []

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-[227px]">
      <div className="mb-3">
        <h2 className="text-[15px] ml-1.5 font-semibold text-gray-800"> Trial Class Status</h2>
      </div>
      <div className="space-y-6 mx-2 ">
        {requests.map((request) => (
          <div key={request.status} className="flex items-center space-x-4 h-42">
            {/* <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
              <request.icon className="h-4 w-4 text-white" />
            </div> */}
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{request.status}</span>
                <span className="text-xs text-gray-500">
                {request?.percentage ? `${request.percentage.toFixed(0)}/100%` : '0/100%'}
                </span>
              </div>
              <div className="h-2 w-full bg-[#E4EAF0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${request.color} rounded-full`}
                  style={{ width: `${request.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

