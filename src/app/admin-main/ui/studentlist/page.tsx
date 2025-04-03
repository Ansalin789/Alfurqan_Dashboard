import BaseLayout4 from "@/components/BaseLayout4";
import { FaStar } from "react-icons/fa";

const students = [
  {
    id: 1,
    name: "Abdullah Sulaiman",
    avatar: "/student-avatar.png",
    rating: 4,
    percentage: "75%",
    studentID: "Islamic History",
    email: "asulaiman403@gmail.com",
    phone: "+880 1234 567891",
    gender: "Male",
    country: "UAE",
    city: "Egyptian",
    courses: ["Arabic", "Quran"],
    package: "Elite / Premium",
  },
];

export default function StudentList() {
  return (
    <BaseLayout4>
      <div className="p-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white shadow-md rounded-lg p-6 flex border border-gray-300 w-[1200px]">
            {/* Left Section - Profile */}
            <div className="w-1/4 flex flex-col items-center border-r pr-4">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-20 h-20 rounded-full"
              />
              <h3 className="mt-2 text-lg font-semibold">{student.name}</h3>
<br/>
              {/* Star Ratings */}
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < student.rating ? "text-yellow-500" : "text-gray-300"} />
                ))}
              </div>
<br/>
              {/* Course Completion */}
              <p className="mt-1 text-xs text-gray-500">Course completion: {student.percentage}</p>
            </div>

            {/* Right Section - Details */}
            <div className="w-3/4 pl-6">
              <h4 className="text-gray-500 font-semibold mb-2">Contact & Details</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Student ID</p>
                  <p className="font-semibold">{student.studentID}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold text-blue-600">{student.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="font-semibold">{student.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Courses Enrolled</p>
                  <p className="font-semibold">{student.courses.join(" / ")}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Country</p>
                  <p className="font-semibold">{student.country}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">City</p>
                  <p className="font-semibold">{student.city}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-semibold">{student.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Packages</p>
                  <p className="font-semibold">{student.package}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseLayout4>
  );
}
