'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EmployeeAccessData {
  _id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  designation: string[];
  dateOfJoining: string;
  roleAccess: {
    admin: boolean;
    adminmodules: {
      dashboard: boolean;
      evaluation: boolean;
      student: boolean;
      employees: boolean;
      courses: boolean;
      classes: boolean;
      invoice: boolean;
      analytics: boolean;
      messages: boolean;
      settings: boolean;
    };
    academicCoach: boolean;
    academicmodules: {
      dashboard: boolean;
      scheduledevaluation: boolean;
      scheduledtrail: boolean;
      students: boolean;
      teachers: boolean;
      messages: boolean;
      support: boolean;
    };
    supervisor: boolean;
    supervisormodules: {
      dashboard: boolean;
      recuirement: boolean;
      meeting: boolean;
      teachers: boolean;
      messages: boolean;
      support: boolean;
    };
    student: boolean;
    studentmodules: {
      dashboard: boolean;
      classes: boolean;
      assignments: boolean;
      payments: boolean;
      knowledgebase: boolean;
      support: boolean;
    };
    teacher: boolean;
    teachermodules: {
      dashboard: boolean;
      liveclasses: boolean;
      scheduledclasses: boolean;
      assignments: boolean;
      messages: boolean;
      analytics: boolean;
      support: boolean;
    };
  };
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  __v: number;
}

type PermissionType = 'read' | 'write' | 'delete';



const TeacherModuleAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get('employeeId');

  const [employeeData, setEmployeeData] = useState<EmployeeAccessData | null>(null);
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: boolean }>({});
  const [permissions, setPermissions] = useState<{ [key: string]: { read: boolean; write: boolean; delete: boolean } }>({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  const modules = [
    'Dashboard',
    'Live Classes',
    'Schedule Classes',
    'Assignments',
    'Messages',
    'Analytics',
    'Support',
  ];

  // Key normalization function
  const getModuleKey = (moduleName: string) => 
    moduleName.toLowerCase().replace(/ & /g, '').replace(/\s+/g, '');

  useEffect(() => {
    if (!employeeId) {
      toast.error("Employee ID not found in the URL!");
      setIsRedirecting(true);
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/update-access/${employeeId}`);
        const json = await res.json();
        
        // Normalize backend keys to UI display names
        if (json.data.roleAccess?.teachermodules) {
          const normalizedModules = modules.reduce((acc, module) => ({
            ...acc,
            [module]: json.data.roleAccess.teachermodules[getModuleKey(module)] || false
          }), {});
          setSelectedModules(normalizedModules);
        }

        if (json.data.roleAccess?.teachermodulesPermissions) {
          const normalizedPerms = modules.reduce((acc, module) => ({
            ...acc,
            [module]: json.data.roleAccess.teachermodulesPermissions[getModuleKey(module)] || 
                      { read: false, write: false, delete: false }
          }), {});
          setPermissions(normalizedPerms);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    if (employeeId) fetchEmployeeData();
  }, [employeeId]);

  useEffect(() => {
    // Trigger redirection only after the error state is set
    if (isRedirecting) {
      router.push("/admin-main/ui/settings"); // Redirect after the state change
    }
  }, [isRedirecting, router]);


  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error('Employee ID not found in the URL!');
      return;
    }

  
    const teachermodules = Object.fromEntries(
      modules.map(module => [
        module.toLowerCase().replace(/ & /g, '').replace(/\s+/g, ''),
        selectedModules[module] || false
      ])
    );
  
    const payload = {
      roleAccess: {
        admin: false,
        adminmodules: {
          dashboard: false,
          evaluation: false,
          student: false,
          employees: false,
          courses: false,
          classes: false,
          invoice: false,
          analytics: false,
          messages: false,
          settings: false,
        },
        academicCoach: false,
        academicmodules: {
          dashboard: false,
          trailManagement: false,
          scheduled: false,
          students: false,
          teachers: false,
          messages: false,
          support: false,
        },
        supervisor: false,
        supervisormodules: {
          dashboard: false,
          recuirement: false,
          meeting: false,
          teachers: false,
          messages: false,
          support: false,
        },
        student: false,
        studentmodules: {
          dashboard: false,
          classes: false,
          assignments: false,
          payments: false,
          knowledgebase: false,
          support: false,
        },
        teacher: false,
        teachermodules,
      },
    };
  
    // Log payload before submitting to check the final structure
    console.log('Payload:', payload);
  
    try {
      const res = await fetch(`http://localhost:5001/update-access/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      // Log the raw response to see it
      console.log('Response Status:', res.status);
  
      if (!res.ok) {
        const errorText = await res.text(); // Read response body only once
        console.error('Error response:', errorText);
        throw new Error('Failed to update access');
      }
  
      // Now read the response as JSON (we've already consumed the body once)
      const data = await res.json();
      console.log('✅ Response:', data);

      toast.success('Access updated successfully!');

      setTimeout(() => {
        router.push('/admin-main/ui/settings'); // 👈 Change this to your desired page
      }, 2000);
    } catch (err) {
      console.error('❌ Error:', err);
      toast.error('Something went wrong while updating access.');
    }
  };
  

  const toggleModule = (module: string) => {
    setSelectedModules((prev) => ({ ...prev, [module]: !prev[module] }));
  };

  // ✅ Now uses the alias
  const togglePermission = (module: string, type: PermissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [type]: !prev[module]?.[type],
      },
    }));
  };

  return (
    <BaseLayout4>
              <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

          <div className="w-full min-h-screen p-5 flex flex-col items-center">
            <h1 className="text-xl font-semibold text-[#012A4A] mb-5 text-left w-full max-w-6xl">
              Teacher Module Access
            </h1>
    
            <div className=" bg-white border border-gray-800 rounded-lg w-full max-w-6xl p-2 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b text-[#101828] font-medium text-sm">
                    <th className="p-3">Modules</th>
                    <th className="p-3 text-center">Read</th>
                    <th className="p-3 text-center">Write</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => (
                    <tr key={module} className="border-t hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center space-x-3">
                        <button onClick={() => toggleModule(module)}>
                          {selectedModules[module] ? (
                            <FaRegCheckSquare className="text-white bg-[#012A4A] text-sm rounded-sm" />
                          ) : (
                            <FaRegSquare className="text-gray-400 text-sm" />
                          )}
                        </button>
                        <span className="text-[12px] text-[#344054]">{module}</span>
                      </td>
                      {['read', 'write', 'delete'].map((perm) => (
                        <td key={perm} className="p-2 text-center">
                          <input
                        type="checkbox"
                        checked={permissions[module]?.[perm as PermissionType] || false}
                        onChange={() => togglePermission(module, perm as PermissionType)}
                        className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                      />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
    
              <div className="flex justify-center mt-4">
                <button 
                onClick={handleSubmit}
                className="bg-[#012A4A] hover:bg-[#011d33] text-white font-sm px-4 py-1 rounded-lg shadow-md transition">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </BaseLayout4>
  );
};

export default TeacherModuleAccess;
