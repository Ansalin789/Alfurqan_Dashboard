import BaseLayout4 from "@/components/BaseLayout4";
import { FaStar } from "react-icons/fa";
import TabbedTable from "../../components/studenttab";

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
      <div className="p-4 w-[1180px] overflow-hidden">
        {students.map((student) => {
          const percentageNumber = parseInt(student.percentage.replace("%", ""));

          return (
            <div
              key={student.id}
              className="bg-white shadow-md rounded-lg p-4 flex border border-gray-300 w-[1150px] h-[200px] mb-4"
            >
              {/* Left Section */}
              <div className="w-1/4 flex flex-col items-center border-r pr-4">
                {/* Circle Image with Thick Border */}
                <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-full"
                  />
                </div>

                <h3 className="mt-1 text-sm font-semibold text-center">
                  {student.name}
                </h3>

                {/* Star Ratings */}
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < student.rating
                          ? "text-yellow-500 text-xs"
                          : "text-gray-300 text-xs"
                      }
                    />
                  ))}
                </div>

                {/* Course Completion Bar */}
                <div className="w-full max-w-[120px] mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${percentageNumber}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-center">
                    Completion: {student.percentage}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="w-3/4 pl-4">
                <h4 className="text-gray-500 font-semibold mb-1 text-sm">
                  Contact & Details
                </h4>
                <div className="grid grid-cols-3 gap-x-7 gap-y-1 text-xs">
                  <div className="mt-2">
                    <p className="text-gray-500">Student ID</p>
                    <p className="font-semibold">{student.studentID}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-blue-600 truncate">
                      {student.email}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-500">Gender</p>
                    <p className="font-semibold">{student.gender}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">Courses</p>
                    <p className="font-semibold">
                      {student.courses.join(" / ")}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">Country</p>
                    <p className="font-semibold">{student.country}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">City</p>
                    <p className="font-semibold">{student.city}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">Phone</p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500">Packages</p>
                    <p className="font-semibold">{student.package}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Tabbed Table Section */}
        <div className="w-[1150px] overflow-hidden">
          <TabbedTable />
        </div>
      </div>
    </BaseLayout4>
  );
}
