"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune, MdFormatListBulleted } from "react-icons/md";
import { Search } from "lucide-react";
import { IoMdList } from "react-icons/io";
import { useRouter } from "next/navigation";

export interface AssignmentItem {
  assignmentId?: string;
  assignmentType: string;
  status: string;
  assignmentName: string;
  title: string;
}

export interface StudentCoreInfo {
  studentId: string;
  name: string;
}

export interface EvaluationStudentInfo {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentGender: string;
  studentPhone: number;
  studentCity: string;
  studentCountry: string;
  studentCountryCode: string;
  learningInterest: string;
  numberOfStudents: number;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  timeZone: string;
  referralSource: string;
  preferredDate: string;
  evaluationStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
}

export interface EvaluationTeacherInfo {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

export interface EvaluationSubscriptionInfo {
  subscriptionName: string;
}

export interface StudentEvaluationDetails {
  student: EvaluationStudentInfo;
  teacher: EvaluationTeacherInfo;
  subscription: EvaluationSubscriptionInfo;
  id: string;
  academicCoachId: string;
  classType: string;
  classDay: string[];
  startTime: string[];
  endTime: string[];
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  planTotalPrice: number;
  classStartDate: string;
  classEndDate: string;
  classStartTime: string;
  classEndTime: string;
  accomplishmentTime: string;
  studentRate: number;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  teacherStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  expectedFinishingDate: number;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  __v: number;
}

export interface StudentWithAssignments extends StudentCoreInfo {
  studentDetails: StudentEvaluationDetails;
  classType: string;
  groupClassId: string;
  assignment: AssignmentItem[];
}

const GroupStudents = () => {
  const [groupStudents, setGroupStudents] = useState<StudentWithAssignments[]>([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [sessionClassType, setSessionClassType] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");

        if (!token || !teacherId) {
          console.warn("Missing teacherId or token");
          return;
        }

        console.log("Fetching data for teacherId:", teacherId);

        const res = await axios.get<StudentWithAssignments[]>(
          "http://localhost:5001/classShedule/teacher/list",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: { teacherId },
          }
        );

        const allStudents = res.data;
        console.log("API Response:", allStudents);

        // Filter for group students only
        const group = allStudents.filter(
          (student) => student.classType?.toUpperCase() === "GROUPCLASS"
        );

        console.log("Group students filtered:", group);
        setGroupStudents(group);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, []);

  // Group students by groupClassId
  const groupedStudents = groupStudents.reduce((acc, student) => {
    const groupId = student.groupClassId || 'no-group';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(student);
    return acc;
  }, {} as Record<string, StudentWithAssignments[]>);

  const handleViewProfile = (studentId: string) => {
    router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
  };

  const handleClick = () => {
    const query = new URLSearchParams({
      title,
      assignedDate,
      dueDate,
      comment,
      studentId,
      studentName,
      sessionClassType,
      assignedTeacher,
      assignedTeacherId,
    }).toString();

    router.push(`/teacher/ui/addingnewassignment?${query}`);
  };

  useEffect(() => {
    const metaData = localStorage.getItem("assignmentMeta");
    if (metaData) {
      const { title, assignedDate, dueDate, comment } = JSON.parse(metaData);
      setTitle(title);
      setAssignedDate(assignedDate);
      setDueDate(dueDate);
      setComment(comment);
    }
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "NOT COMPLETED":
        return "bg-yellow-100 text-yellow-700";
      case "NOT ASSIGNED":
        return "bg-red-100 text-red-700";
      case "ASSIGNED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const toggleStudentList = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className="md:p-0 mx-auto w-full">
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-col">

          {/* Search + Filter */}
          <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60">
                  Showing {Object.keys(groupedStudents).length} of {Object.keys(groupedStudents).length}
                </span>
              </div>
            </div>

            {/* Table */}
            <table className="table-fixed w-full border border-gray-300 dark:border-gray-600">
              <thead className="text-[12px] bg-[#4C6993] text-white">
                <tr>
                  {[
                    "Assignment ID",
                    "Student List",
                    "Group ID",
                    "Assignment Name",
                    "Course",
                    "Level",
                    "Assigned Date",
                    "Due Date",
                    "Status",
                    "Action",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-2 py-1 border border-[#4C6993] text-left text-wrap break-words"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedStudents).map(([groupId, students], groupIndex) => {
                  // Get the first student's details for the group row
                  const firstStudent = students[0];
                  const studentInfo = firstStudent.studentDetails?.student;
                  const studentDetails = firstStudent.studentDetails;

                  // If no assignments, show one row with empty assignment data
                  if (firstStudent.assignment.length === 0) {
                    return (
                      <tr
                        key={`${groupId}-no-assignment`}
                        className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                          groupIndex % 2 === 0
                            ? "bg-white dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words relative">
                          <button
                            onClick={() => toggleStudentList(groupId)}
                            className="text-[#3D8FDE] font-medium hover:underline flex items-center gap-1"
                          >
                            <MdFormatListBulleted className="w-5 h-5 text-[#3D8FDE]" />
                            View List ({students.length} students)
                          </button>
                          {expandedGroupId === groupId && (
                            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10 min-w-[100px]">
                              {students.map((student, idx) => {
                                const studentData = student.studentDetails?.student;
                                return (
                                  <div key={student.studentId} className="text-[9px] py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                    {studentData?.studentFirstName} {studentData?.studentLastName}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {groupId === 'no-group' ? '-' : groupId}
                        </td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">
                          {studentDetails?.student?.learningInterest}
                        </td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">
                          <span className="py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px] bg-gray-100 text-gray-600">
                            No Assignment
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center relative">
                          <button
                            className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === `${groupId}-no-assignment` ? null : `${groupId}-no-assignment`
                              )
                            }
                          >
                            <BsThreeDotsVertical />
                          </button>

                          {openDropdownId === `${groupId}-no-assignment` && (
                            <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                              <button
                                className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                onClick={() =>
                                  handleViewProfile(firstStudent.studentId)
                                }
                              >
                                View Profile
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                onClick={() => {
                                  setStudentId(firstStudent.studentId);
                                  setStudentName(
                                    `${studentInfo?.studentFirstName ?? ""} ${
                                      studentInfo?.studentLastName ?? ""
                                    }`
                                  );
                                  setSessionClassType(
                                    studentDetails?.classType ?? "GROUPCLASS"
                                  );
                                  setAssignedTeacher(
                                    studentDetails?.assignedTeacherEmail ?? ""
                                  );
                                  setAssignedTeacherId(
                                    studentDetails?.teacher?.teacherId ?? ""
                                  );
                                  setOpenModalId(`${groupId}-no-assignment`);
                                }}
                              >
                                New Assignment
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }

                  // Ensure unique assignments per group
                  const uniqueAssignmentsMap = new Map<string, AssignmentItem>();
                  students.forEach(student => {
                    student.assignment.forEach((item) => {
                      const id =
                        item.assignmentId ||
                        `${item.assignmentName}-${item.title}`;
                      if (!uniqueAssignmentsMap.has(id)) {
                        uniqueAssignmentsMap.set(id, item);
                      }
                    });
                  });
                  const uniqueAssignments = Array.from(
                    uniqueAssignmentsMap.values()
                  );

                  return uniqueAssignments.map((assignmentItem, assignIndex) => {
                    const dropdownId = `${groupId}-${assignmentItem.assignmentName}-${assignIndex}`;

                    return (
                      <tr
                        key={`${groupId}-${assignIndex}`}
                        className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                          groupIndex % 2 === 0
                            ? "bg-white dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="px-3 py-2 break-words">
                          {assignmentItem.assignmentId || "-"}
                        </td>
                        <td className="px-3 py-2 break-words relative">
                          <button
                            onClick={() => toggleStudentList(groupId)}
                            className="text-[#3D8FDE] font-medium hover:underline flex items-center gap-1"
                          >
                            <MdFormatListBulleted className="w-5 h-5 text-[#3D8FDE]" />
                            View List <span className="text-[8px]">({students.length} students)</span> 
                          </button>
                          {expandedGroupId === groupId && (
                            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10 min-w-[150px]">
                              {students.map((student, idx) => {
                                const studentData = student.studentDetails?.student;
                                return (
                                  <div key={student.studentId} className="text-[11px] py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                    {studentData?.studentFirstName} {studentData?.studentLastName}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {groupId === 'no-group' ? '-' : groupId}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {assignmentItem.title}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {studentDetails?.student?.learningInterest}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {studentDetails?.student?.learningInterest || "-"}
                        </td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">
                          <span
                            className={`py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                              assignmentItem.status
                            )}`}
                          >
                            {assignmentItem.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center relative">
                          <button
                            className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === dropdownId ? null : dropdownId
                              )
                            }
                          >
                            <BsThreeDotsVertical />
                          </button>

                          {openDropdownId === dropdownId && (
                            <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                              {(() => {
                                const status = assignmentItem.status?.toUpperCase();
                                if (
                                  ["COMPLETED", "NOT COMPLETED", "ASSIGNED"].includes(status)
                                ) {
                                  return (
                                    <>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                        onClick={() => handleViewProfile(firstStudent.studentId)}
                                      >
                                        View Profile
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() => setOpenDropdownId(null)}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  );
                                } else if (status === "NOT ASSIGNED") {
                                  return (
                                    <>
                                      <button className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]">
                                        Assign
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() => {
                                          setStudentId(firstStudent.studentId);
                                          setStudentName(
                                            `${studentInfo?.studentFirstName ?? ""} ${studentInfo?.studentLastName ?? ""}`
                                          );
                                          setSessionClassType(studentDetails?.classType ?? "GROUPCLASS");
                                          setAssignedTeacher(studentDetails?.assignedTeacherEmail ?? "");
                                          setAssignedTeacherId(studentDetails?.teacher?.teacherId ?? "");
                                          setOpenModalId(dropdownId);
                                        }}
                                      >
                                        New Assignment
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() => setOpenDropdownId(null)}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  );
                                } else {
                                  return (
                                    <button
                                      className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      Cancel
                                    </button>
                                  );
                                }
                              })()}
                            </div>
                          )}

                          {/* Assignment Modal */}
                          {openModalId === dropdownId && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg w-[400px] h-[500px] p-6 border flex flex-col justify-between text-left dark:bg-[#343434]">
                                <div>
                                  <h2 className="text-lg font-semibold mb-4 dark:text-[#fff]">
                                    Assign
                                  </h2>
                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter title"
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                    />
                                  </div>
                                  <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Assigned Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                        value={assignedDate}
                                        onChange={(e) => setAssignedDate(e.target.value)}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Due Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Comment
                                    </label>
                                    <textarea
                                      placeholder="Write your comment here..."
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      className="w-full border rounded-md px-2 py-2 h-28 resize-none dark:bg-[#5C5C5C] dark:text-[#fff]"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                  <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 bg-[#576CBC/10] rounded-md dark:text-[#576CBC] dark:bg-[#576CBC] dark:bg-opacity-10 dark:border-[#576CBC] border border-[#576CBC]"
                                    onClick={() => setOpenModalId(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="bg-[#576CBC] text-white px-4 py-2 rounded-md dark:text-[#fff]"
                                    onClick={() => handleClick()}
                                  >
                                    Create Assignment
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Assignment Modal for students with no assignments */}
                          {openModalId === `${groupId}-no-assignment` && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg w-[400px] h-[500px] p-6 border flex flex-col justify-between text-left dark:bg-[#343434]">
                                <div>
                                  <h2 className="text-lg font-semibold mb-4 dark:text-[#fff]">
                                    Assign
                                  </h2>
                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter title"
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                    />
                                  </div>
                                  <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Assigned Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                        value={assignedDate}
                                        onChange={(e) => setAssignedDate(e.target.value)}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Due Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Comment
                                    </label>
                                    <textarea
                                      placeholder="Write your comment here..."
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      className="w-full border rounded-md px-2 py-2 h-28 resize-none dark:bg-[#5C5C5C] dark:text-[#fff]"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                  <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 bg-[#576CBC/10] rounded-md dark:text-[#576CBC] dark:bg-[#576CBC] dark:bg-opacity-10 dark:border-[#576CBC] border border-[#576CBC]"
                                    onClick={() => setOpenModalId(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="bg-[#576CBC] text-white px-4 py-2 rounded-md dark:text-[#fff]"
                                    onClick={() => handleClick()}
                                  >
                                    Create Assignment
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupStudents;
