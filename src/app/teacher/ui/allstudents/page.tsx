'use client';
import { useEffect, useState } from "react";
import TeacherHeader from "../../components/TeacherHeader";
import { useRouter } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

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
  sessionClassType: string;
  student: EvaluationStudentInfo;
  teacher: EvaluationTeacherInfo;
  subscription: EvaluationSubscriptionInfo;
  _id: string;
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
  assignment: AssignmentItem[];
}

const StudentList = () => {
  const [regularStudents, setRegularStudents] = useState<
    StudentWithAssignments[]
  >([]);
  const [groupStudents, setGroupStudents] = useState<StudentWithAssignments[]>(
    []
  );
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [sessionClassType, setSessionClassType] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");

  const [regularCount, setRegularCount] = useState<number>(0);
  const [groupCount, setGroupCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"Regular" | "Group">("Regular");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");

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
          "http://localhost:5001/classShedule/teacher/list/",

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: { teacherId },
          }
        );

        const allAssignments = res.data;
        console.log("API Response:", allAssignments);

        const uniqueMap = new Map<string, StudentWithAssignments>();
        for (const assign of allAssignments) {
          if (!uniqueMap.has(assign.studentId)) {
            uniqueMap.set(assign.studentId, assign);
          } else {
            console.log("Duplicate student skipped:", assign.studentId);
          }
        }

        const uniqueList = Array.from(uniqueMap.values());

        const regular = uniqueList.filter(
          (student) =>
            student.studentDetails?.classType?.toUpperCase() === "REGULARCLASS"
        );

        const group = uniqueList.filter(
          (student) =>
            student.studentDetails?.classType?.toUpperCase() === "GROUPCLASS"
        );

        setRegularStudents(regular);
        setGroupStudents(group);
        setRegularCount(regular.length);
        setGroupCount(group.length);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, []);

  const studentsToDisplay =
    activeTab === "Regular" ? regularStudents : groupStudents;

  // const toggleDropdown = (id: string) => {
  //   setOpenDropdownId((prev: string) => (prev === id ? null : id));
  // };
  const router = useRouter(); // Add this

  const handleViewProfile = (studentId: string) => {
    router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
  };

  const handleClick = () => {
    console.log("Create Assignment clicked");

    const assignmentMeta = {
      title,
      assignedDate,
      dueDate,
      comment,
      studentId,
      studentName,
      sessionClassType,
      assignedTeacher,
      assignedTeacherId,
    };

    localStorage.setItem("assignmentMeta", JSON.stringify(assignmentMeta));
    router.push(`/teacher/ui/addingnewassignment`);
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
  return (
    <BaseLayout>
      <TeacherHeader currentSection="Assignments" />

       <div className="md:p-0 mx-auto w-full">
          <div className="flex flex-col h-full w-full justify-between">
            <div className="flex flex-col">
              {/* Tabs */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-4 font-semibold">
                  {[
                    { type: "Regular", count: regularCount },
                    { type: "Group", count: groupCount },
                  ].map(({ type, count }) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type as "Regular" | "Group")}
                      className={
                        activeTab === type
                          ? "text-[#576CBC] border-b-2 text-[16px] border-[#576CBC]"
                          : "text-[#010E30] dark:text-white text-[16px]"
                      }
                    >
                      {type} Students ({count})
                    </button>
                  ))}
                </div>
              </div>
    
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
                      Showing {studentsToDisplay.length} of{" "}
                      {studentsToDisplay.length}
                    </span>
                  </div>
                </div>
    
                {/* Table */}
                <table className="table-fixed w-full">
                  <thead className="text-[12px] bg-[#4C6993] text-white">
                    <tr>
                      {[
                        "Student ID",
                        "Student Name",
                        "Assignment ID",
                        "Level",
                        "Course",
                        "Assignment Name",
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
                    {studentsToDisplay.map((student, studentIndex) => {
                      const studentInfo = student.studentDetails?.student;
                      const studentDetails = student.studentDetails;
    
                      const uniqueAssignmentsMap = new Map<
                        string,
                        AssignmentItem
                      >();
                      student.assignment.forEach((item) => {
                        const id =
                          item.assignmentId ||
                          `${item.assignmentName}-${item.title}`;
                        if (!uniqueAssignmentsMap.has(id)) {
                          uniqueAssignmentsMap.set(id, item);
                        }
                      });
                      const uniqueAssignments = Array.from(
                        uniqueAssignmentsMap.values()
                      );
    
                      return uniqueAssignments.map(
                        (assignmentItem, assignIndex) => {
                          const dropdownId = `${student.studentId}-${assignmentItem.assignmentName}-${assignIndex}`;
    
                          return (
                            <tr
                              key={`${student.studentId}-${assignIndex}`}
                              className={`text-[10px] ${
                                studentIndex % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="px-3 py-3 break-words">
                                {student?.studentId}
                              </td>
                              <td className="px-3 py-3 text-[#3D8FDE] font-medium break-words">
                                {studentInfo?.studentFirstName}{" "}
                                {studentInfo?.studentLastName}
                              </td>
                              <td className="px-3 py-3 break-words">
                                {assignmentItem.assignmentId || "-"}
                              </td>
                              <td className="px-3 py-3 break-words">
                                {studentDetails?.languageLevel || "-"}
                              </td>
                              <td className="px-3 py-3 break-words">
                                {studentDetails?.student?.learningInterest}
                              </td>
                              <td className="px-3 py-3 break-words">
                                {assignmentItem.title}
                              </td>
    
                              <td className="px-3 py-3 break-words">
                                {new Date(
                                  studentDetails?.classStartDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-3 break-words">
                                {new Date(
                                  studentDetails?.classEndDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-3 break-words">
                                <span
                                  className={`py-1 px-2 rounded-md text-[8px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
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
                                      openDropdownId === dropdownId
                                        ? null
                                        : dropdownId
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
                  onClick={() => handleViewProfile(student.studentId)}
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
                    setStudentId(student.studentId);
                    setStudentName(
                      `${studentInfo?.studentFirstName ?? ""} ${studentInfo?.studentLastName ?? ""}`
                    );
                    setSessionClassType(studentDetails?.sessionClassType ?? "REGULARCLASS");
                    setAssignedTeacher(studentDetails?.assignedTeacher ?? "");
                    setAssignedTeacherId(studentDetails?.assignedTeacherId ?? "");
                    setOpenModalId(dropdownId); // open the modal
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
                                            onChange={(e) =>
                                              setTitle(e.target.value)
                                            }
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
                                              onChange={(e) =>
                                                setAssignedDate(e.target.value)
                                              }
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
                                              onChange={(e) =>
                                                setDueDate(e.target.value)
                                              }
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
                                            onChange={(e) =>
                                              setComment(e.target.value)
                                            }
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
                                          onClick={handleClick}
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
                        }
                      );
                    })}
                  </tbody>
                </table>
              </div>
            
            </div>
          </div>
        </div>
    </BaseLayout>
  );
};

export default StudentList;
