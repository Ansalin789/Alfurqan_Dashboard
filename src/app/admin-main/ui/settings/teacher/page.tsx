'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
type PermissionType = 'read' | 'write' | 'delete';



const TeacherModuleAccess = () => {

  const searchParams = useSearchParams();
  const employeeId = searchParams.get('employeeId');
  
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: boolean }>({});
  const [permissions, setPermissions] = useState<{ [key: string]: { read: boolean; write: boolean; delete: boolean } }>({});
  const router =useRouter();
  const modules = [
    'Dashboard',
    'Recruitment',
    'Meeting & Training',
    'Teachers',
    'Messages',
    'Support',
  ];

  const handleSubmit = async () => {
    if (!employeeId) {
      alert('Employee ID not found in the URL!');
      return;
    }
  
    const teachermodules: { [key: string]: boolean } = {};
  
    // Debugging: log the selectedModules object before proceeding
    console.log('selectedModules:', selectedModules);
  
    modules.forEach((module) => {
      const key = module.toLowerCase().replace(/\s+/g, '');  // "dashboard" for "Dashboard"
      teachermodules[key] = selectedModules[module] || false;  // Get value from selectedModules
    });
  
    // Debugging: Log the adminmodules to see the final structure
    console.log('Adminmodules before submit:', teachermodules);
  
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
          recuirement: false, // Consider renaming 'recuirement' to 'requirement'
          meeting: false,
          teachers: false,
          messages: false,
          support: false,
        },
        student: false,
        studentmodules: {
          dashboard: false,
          recuirement: false,
          meeting: false,
          teachers: false,
          messages: false,
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
      alert('Access updated successfully!');
      console.log('✅ Response:', data);
  
      // Reset the selectedModules to clear the checkboxes
      setSelectedModules({});
  
      // Navigate to the settings page after submission
      router.push('/admin-main/ui/settings'); // Navigate to settings page
  
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Something went wrong while updating access.');
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
