'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type PermissionType = 'read' | 'write' | 'delete';
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

type Permission = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

type ModuleAccess = {
  [key: string]: Permission;
};

type RoleAccess = {
  admin: boolean;
  adminmodules: ModuleAccess;
  academicCoach: boolean;
  academicmodules: ModuleAccess;
  supervisor: boolean;
  supervisormodules: ModuleAccess;
  student: boolean;
  studentmodules: ModuleAccess;
  teacher: boolean;
  teachermodules: ModuleAccess;
};

const TeacherModuleAccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get('employeeId');
  const [permissions, setPermissions] = useState<Record<string, ModuleAccess>>({
    teachermodules: {},
  });
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
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

  const getModuleKey = (moduleName: string) =>
    moduleName.toLowerCase().replace(/ & /g, '').replace(/\s+/g, '');

  

useEffect(() => {
    if (!employeeId) {
      toast.error('Employee ID not found in the URL!');
      setIsRedirecting(true);
      return;
      
    }
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchEmployeeData(token); // call your function with token
      } else {
        alert("No auth token found.");
      }
    }, [employeeId]);
    const fetchEmployeeData = async (token: string) => {
      try {
        const res = await fetch(`https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        console.log('Fetched data:', json);
  
        const access = json?.data?.roleAccess;
        const teacherModules = access?.teachermodules ?? {};
        
        // Updated: permissions object
        const selected: Record<string, boolean> = {};
        const modulePermissions: ModuleAccess = {};
  
        modules.forEach((module) => {
          const key = getModuleKey(module);
          const perms = teacherModules[key] ?? { read: false, write: false, delete: false };
  
          // Determine if module is selected (if any permission is true)
          selected[key] = perms.read ?? perms.write ?? perms.delete;
  
          // Always store full permissions
          modulePermissions[key] = perms;
        });
  
        setSelectedModules(selected);
        setPermissions((prev) => ({
          ...prev,
          teachermodules: modulePermissions,
        }));
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
        toast.error('Error loading employee access data');
      }
    };
  

  

  useEffect(() => {
    if (isRedirecting) {
      router.push('/admin-main/ui/settings');
    }
  }, [isRedirecting, router]);

  const toggleModule = (module: string, permission?: PermissionType) => {
    if (!permission) {
      // Toggle selection for the entire module
      setSelectedModules((prev) => {
        const newSelectedModules = { ...prev };
        newSelectedModules[module] = !prev[module];
        return newSelectedModules;
      });

      setPermissions((prev) => ({
        ...prev,
        teachermodules: {
          ...prev.teachermodules,
          [module]: {
            read: !prev[module]?.read,
            write: !prev[module]?.write,
            delete: !prev[module]?.delete,
          },
        },
      }));
    } else {
      // Toggle a specific permission
      setPermissions((prev) => ({
        ...prev,
        teachermodules: {
          ...prev.teachermodules,
          [module]: {
            ...prev.teachermodules[module],
            [permission]: !prev.teachermodules[module]?.[permission],
          },
        },
      }));
    }
  };

  const handleUpdateAccess = async () => {
    const roleAccess = {
      teacher:true,
      teachermodules: permissions.teachermodules,
    };

    try {
      const token=localStorage. getItem("AdminAuthToken");
      const response = await axios.put(
        `https://api.blackstoneinfomaticstech.com/update-access/${employeeId}`,
        { roleAccess },
        {
          headers:{
            'Content-Type':"application/json",
            "Authorization": `Bearer ${token}`,
          }
        } 
      );
      console.log('Access updated successfully:', response.data);
      toast.success('Access updated successfully!'); // ✅ Show success toast
      setTimeout(() => {
        router.push('/admin-main/ui/settings'); // <-- change this to your desired route
      }, 2000);
    } catch (error) {
      console.error('Failed to update access:', error);
      toast.error('Failed to update access'); // ✅ Show error toast

    }
  };

  return (
    <BaseLayout4>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      <div className="w-full min-h-screen p-5 flex flex-col items-center">
        <h1 className="text-xl font-semibold text-[#012A4A] mb-5 text-left w-full max-w-6xl">
          Teacher Module Access
        </h1>

        <div className="bg-white border border-gray-800 rounded-lg w-full max-w-6xl p-2 shadow-sm overflow-x-auto">
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
              {modules.map((module) => {
                const moduleKey = module.toLowerCase();

                return (
                  <tr key={module} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <button type="button" onClick={() => toggleModule(moduleKey)}>
                        {selectedModules[moduleKey] ? (
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
                          checked={permissions.teachermodules[moduleKey]?.[perm as PermissionType] || false}
                          onChange={() => toggleModule(moduleKey, perm as PermissionType)}
                          className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleUpdateAccess}
              className="bg-[#012A4A] hover:bg-[#011d33] text-white font-sm px-4 py-1 rounded-lg shadow-md transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default TeacherModuleAccess;
