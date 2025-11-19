'use client';
import { MdTune } from "react-icons/md";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import BaseLayout2 from "@/components/BaseLayout2";
import BaseLayout4 from "@/components/BaseLayout4";
import AdminHeader from "../../components/AdminHeader";
// Interfaces
interface Assignment {
  _id?: string;
  assignmentId: string;
  assignedTeacher: string;
  course: string;
  level: string;
  title: string;
  sessionClassType: string;
  assignedDate?: string;
  dueDate?: string;
  assignmentStatus: string;
  questions?: any[]; // Added questions property based on linter error
}

type AssignmentType = Assignment; // Alias for Assignment interface

interface AssignmentFilters {
  assignmentName: string;
  course: string;
  level: string;
  classType: string;
  assignedDateFrom: string;
  assignedDateTo: string;
  dueDateFrom: string;
  dueDateTo: string;
  status: string; // Added status property
}

const mapStatus = (status: string) => {
  // This function would map backend status to display status
  return status; // For now, just return the status as is
};

const StudentClassAssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filters, setFilters] = useState<AssignmentFilters>({
    assignmentName: "",
    course: "",
    level: "",
    classType: "",
    assignedDateFrom: "",
    assignedDateTo: "",
    dueDateFrom: "",
    dueDateTo: "",
    status: "", // Initialize status
  });
  const [studentId, setStudentId] = useState<string>("");
  const [searchAssignment, setSearchAssignment] = useState(""); 
  const [isAssignmentFilterModalOpen, setIsAssignmentFilterModalOpen] = useState(false); // For Assignments tab filter modal
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [filteredClassData, setFilteredClassData] = useState<any[]>([]); // Assuming 'any[]' for now
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("assignments");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const searchParams = useSearchParams(); // Initialize searchParams

  useEffect(() => {
    const urlStudentId = searchParams.get("studentId");
    if (urlStudentId) {
      setStudentId(urlStudentId);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("AdminAuthToken");


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedItemsCount = filteredClassData.length;

  // Calculate the display range
        if (!token || !studentId) {
          console.error("Missing token or student ID");
          return;
        }

        const res = await fetch(`https://api.blackstoneinfomaticstech.com/assignments/student?studentId=${studentId}`, { // Use the studentId state
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        console.log("Fetched Assignments Data:", data); // Log the fetched data

        // Ensure that the data is being set correctly
        setAssignments(data.data.sort((a: AssignmentType, b: AssignmentType) => {
          const dateA = a.assignedDate ? new Date(a.assignedDate).getTime() : 0;
          const dateB = b.assignedDate ? new Date(b.assignedDate).getTime() : 0;
          return dateB - dateA;
        }) || []); // Set the assignments data
      } catch (err: any) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) { // Only fetch if studentId is available
      fetchAssignments();
    }
  }, [studentId]); // Depend on studentId to re-fetch when it changes

  // Filtered data for Assignments
  const filteredAssignmentData = assignments.filter((assignment) => {
    const searchTerm = searchAssignment.toLowerCase();

    return (
      (assignment.assignmentId && assignment.assignmentId.toLowerCase().includes(searchTerm)) || // Match Assignment ID
      (assignment.assignedTeacher && assignment.assignedTeacher.toLowerCase().includes(searchTerm)) || // Match Assigned By
      (assignment.course && assignment.course.toLowerCase().includes(searchTerm)) || // Match Course
      (assignment.level && assignment.level.toLowerCase().includes(searchTerm)) || // Match Level
      (assignment.title && assignment.title.toLowerCase().includes(searchTerm)) || // Match Assignment Name
      (assignment.sessionClassType && assignment.sessionClassType.toLowerCase().includes(searchTerm)) // Match Class Type

    );
  });
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("AdminAuthToken");


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedItemsCount = filteredClassData.length;

  // Calculate the display range
        if (!token || !studentId) {
          console.error("Missing token or student ID");
          return;
        }

        const res = await fetch(`https://api.blackstoneinfomaticstech.com/assignments/student?studentId=${studentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        console.log("Fetched Assignments Data:", data); // Log the fetched data

        // Ensure that the data is being set correctly
        setAssignments(data.data.sort((a: AssignmentType, b: AssignmentType) => {
          const dateA = a.assignedDate ? new Date(a.assignedDate).getTime() : 0;
          const dateB = b.assignedDate ? new Date(b.assignedDate).getTime() : 0;
          return dateB - dateA;
        }) || []); // Set the assignments data
      } catch (err: any) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]); // Ensure studentId is in the dependency array

  // Filter assignments based on current filters
  const filterAssignments = (assignments: AssignmentType[]) => {
    return assignments.filter(assignment => {
      // Search by keyword in all table data (case-insensitive)
      if (
        searchKeyword &&
        !Object.values(assignment)
          .map(val => (typeof val === 'string' ? val.toLowerCase() : ''))
          .join(' ')
          .includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }
      // Assignment Name filter
      if (filters.assignmentName && !assignment.title?.toLowerCase().includes(filters.assignmentName.toLowerCase())) {
        return false;
      }
      // Course filter
      if (filters.course && assignment.course !== filters.course) {
        return false;
      }
      // Level filter
      if (filters.level && assignment.level !== filters.level) {
        return false;
      }
      // Status filter (use mapped status)
      if (filters.status && mapStatus(assignment.assignmentStatus) !== filters.status) {
        return false;
      }
      // Assigned Date range filter
      if (filters.assignedDateFrom && assignment.assignedDate) {
        const assignedDate = new Date(assignment.assignedDate);
        const fromDate = new Date(filters.assignedDateFrom);
        if (assignedDate < fromDate) {
          return false;
        }
      }
      if (filters.assignedDateTo && assignment.assignedDate) {
        const assignedDate = new Date(assignment.assignedDate);
        const toDate = new Date(filters.assignedDateTo);
        if (assignedDate > toDate) {
          return false;
        }
      }
      // Due Date range filter
      if (filters.dueDateFrom && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        const fromDate = new Date(filters.dueDateFrom);
        if (dueDate < fromDate) {
          return false;
        }
      }
      if (filters.dueDateTo && assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        const toDate = new Date(filters.dueDateTo);
        if (dueDate > toDate) {
          return false;
        }
      }
      // Class Type filter
      if (filters.classType && assignment.sessionClassType !== filters.classType) {
        return false;
      }
      return true;
    });
  };

  // Tab logic (if you want to filter by assignmentStatus)
  const pendingAssignments = assignments.filter(a => mapStatus(a.assignmentStatus) !== "Completed");
  const completedAssignments = assignments.filter(a => {
    const isAssignmentCompleted = mapStatus(a.assignmentStatus) === "Completed";
    // If there are questions, check that none are "ASSIGNED"
    const allQuestionsNotAssigned = !a.questions || a.questions.every(q => mapStatus(q.status) !== "Assigned");
    return isAssignmentCompleted && allQuestionsNotAssigned;
  });

  // Apply filters to the appropriate tab
  const filteredPendingAssignments = filterAssignments(pendingAssignments);
  const filteredCompletedAssignments = filterAssignments(completedAssignments);
  const studentsToDisplay = activeTab === "Pending" ? filteredPendingAssignments : filteredCompletedAssignments;

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-[#ECFDF3] text-[#377E36] dark:bg-[#2E3D2E] dark:text-[#377E36]";
      case "INPROGRESS":
        return "bg-[#FDF6EC] text-[#F0AD4E] dark:bg-[#534634] dark:text-[#F0AD4E]";
      case "ASSIGNED":
        return "bg-[#FDECEC] text-[#D34645] dark:bg-[#4D3131] dark:text-[#D34645]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleFilterChange = (filterName: keyof AssignmentFilters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      assignmentName: "",
      course: "",
      level: "",
      classType: "",
      assignedDateFrom: "",
      assignedDateTo: "",
      dueDateFrom: "",
      dueDateTo: "",
      status: "",
    });
    // Close filter modal after reset
    setIsAssignmentFilterModalOpen(false);
  };

  const applyFilters = () => {
    // Apply filters logic here - this will re-run the filteredAssignmentData memoization
    setIsAssignmentFilterModalOpen(false);
  };

  // Placeholder functions

  const handleViewDetailsAssignments = (id: string) => {
    console.log("View details for assignment id:", id);
    // Implement navigation or modal display here
  };

return (
    <BaseLayout4>
    <AdminHeader currentSection="Student Class Assignments" showBackPath={`/admin-main/ui/studentlist?studentId=${studentId}`} showBackButton/>
<div className="">
<div className="rounded-xl overflow-hidden">
  <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
    <input
      type="text"
      placeholder="Search"
      className="bg-transparent outline-none text-[12px] w-32 py-3"
      value={searchAssignment}
      onChange={(e) => {
        setSearchAssignment(e.target.value);
        // Reset pagination if needed
      }}
    />
    
    <div
      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
      onClick={() => setIsAssignmentFilterModalOpen(true)} // Open filter modal on click
    >
      <MdTune className="w-4 h-4" />
      <span>Filter</span>
    </div>
    <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
      Showing {filteredAssignmentData.length} of {assignments.length}
    </span>
  </div>
  <div className="overflow-x-auto max-h-none">
    <table className="table-fixed w-full">
      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
        <tr className="font-medium">
          {[
            "Assignment ID",
            "Assigned By",
            "Course",
            "Level",
            "Assignment Name",
            "Class Type",
            "Assigned Date",
            "Due Date",
            "Status"
          ].map((header, idx) => (
            <th
              key={idx}
              className="p-4 font-semibold text-[12px] text-left border border-[#4C6993]"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-[10px] text-[#1D2939]">
        {filteredAssignmentData.length > 0 ? (
          filteredAssignmentData.map((assignment, index) => (
            <tr key={assignment._id || index} className={`text-left dark:text-white ${index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C]" : "bg-[#F8F8F8] dark:bg-[#303030]"}`}>
              <td className="p-3">{assignment.assignmentId}</td>
              <td className="p-3">{assignment.assignedTeacher}</td>
              <td className="p-3">{assignment.course}</td>
              <td className="p-3">{assignment.level}</td>
              <td className="p-3">{assignment.title}</td>
              <td className="p-3">{assignment.sessionClassType}</td>
              <td className="p-3">{assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}</td>
              <td className="p-3">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}</td>
              <td className="p-3">
                <span className={`py-2 px-2 rounded-md text-[8px] flex items-center justify-center min-w-[80px] ${getStatusStyle(mapStatus(assignment.assignmentStatus))}`}>
                  {mapStatus(assignment.assignmentStatus)}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="p-4 text-center">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
    <div className="flex justify-end mt-4">
        <button
          className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
          onClick={()=>handleViewDetailsAssignments(studentId)}
        >
          View All
        </button>
      </div>
  </div>
</div>

{/* Filter Modal for Assignments */}
{isAssignmentFilterModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
    <div className="bg-white p-6 rounded-xl w-[400px] relative dark:bg-[#252525] shadow-xl">
      <button
        className="absolute top-4 right-4 text-gray-400 text-2xl"
        onClick={() => setIsAssignmentFilterModalOpen(false)}
      >
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-6 dark:text-white">Filter by</h2>
      
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Assignment Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
          value={filters.assignmentName}
          onChange={(e) => handleFilterChange('assignmentName', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Course</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
          value={filters.course}
          onChange={(e) => handleFilterChange('course', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Level</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
          value={filters.level}
          onChange={(e) => handleFilterChange('level', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Class Type</label>
        <select
          className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
          value={filters.classType} // Assuming you have a classType in your filters state
          onChange={(e) => handleFilterChange('classType', e.target.value)}
        >
          <option value="REGULARCLASS">Regular Class</option>
          <option value="GROUPCLASS">Group Class</option>
          {/* Add more class type options as needed */}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Assigned Date</label>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
            value={filters.assignedDateFrom}
            onChange={(e) => handleFilterChange('assignedDateFrom', e.target.value)}
          />
          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
            value={filters.assignedDateTo}
            onChange={(e) => handleFilterChange('assignedDateTo', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">Due Date</label>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
            value={filters.dueDateFrom}
            onChange={(e) => handleFilterChange('dueDateFrom', e.target.value)}
          />
          <input
            type="date"
            className="w-full border rounded-md p-2 text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
            value={filters.dueDateTo}
            onChange={(e) => handleFilterChange('dueDateTo', e.target.value)}
          />
        </div>
      </div>



      <div className="flex justify-end gap-3">
        <button
          onClick={resetFilters}
          className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
        >
          Reset
        </button>
        <button
          className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium"
          onClick={() => {
            setIsAssignmentFilterModalOpen(false);
            // Apply filters logic here
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}
</div>
</BaseLayout4>
);
};

export default StudentClassAssignmentsPage;