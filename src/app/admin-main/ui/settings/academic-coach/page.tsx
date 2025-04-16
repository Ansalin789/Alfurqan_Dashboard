'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import { useState } from 'react';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
type PermissionType = 'read' | 'write' | 'delete';
const AcademicCoachModuleAccess = () => {
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: boolean }>({});
  const [permissions, setPermissions] = useState<{ [key: string]: { read: boolean; write: boolean; delete: boolean } }>({});

  const modules = [
    'Dashboard',
    'Scheduled Evaluation',
    'Schedule Trial sessions',
    'Students',
    'Teachers',
    'Messages',
    'Support',
  ];

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
          Admin Module Access
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
                        checked={permissions[module]?.[perm as 'read' | 'write' | 'delete'] || false}
                        onChange={() => togglePermission(module, perm as 'read' | 'write' | 'delete')}
                        className="h-3 w-3 text-[#012A4A] border-gray-300 rounded focus:ring-[#012A4A]"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button className="bg-[#012A4A] hover:bg-[#011d33] text-white font-sm px-4 py-1 rounded-lg shadow-md transition">
              Submit
            </button>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default AcademicCoachModuleAccess;
