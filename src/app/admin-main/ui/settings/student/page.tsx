'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import { useState } from 'react';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';

const StudentModuleAccess = () => {
  const [selectedModules, setSelectedModules] = useState<{ [key: string]: boolean }>({});
  const [permissions, setPermissions] = useState<{ [key: string]: { read: boolean; write: boolean; delete: boolean } }>({});

  const modules = [
    'Dashboard',
    'Recruitment',
    'Meeting & Training',
    'Teachers',
    'Messages',
    'Support',
  ];

  const toggleModule = (module: string) => {
    setSelectedModules((prev) => ({ ...prev, [module]: !prev[module] }));
  };

  const togglePermission = (module: string, permission: 'read' | 'write' | 'delete') => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [permission]: !prev[module]?.[permission] },
    }));
  };

  return (
    <BaseLayout4>
      <div className="flex items-center justify-center mx-auto">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-left p-4">Student Module Access</h2>
          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-4 px-32 underline">Modules</th>
                  <th className="p-4 px-16 text-center">Read</th>
                  <th className="p-4 px-16 text-center">Write</th>
                  <th className="p-4 px-16 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module} className="border-t">
                    <td className="p-4 flex items-center space-x-3">
                      <button onClick={() => toggleModule(module)}>
                        {selectedModules[module] ? (
                          <FaRegCheckSquare className="text-[#fff] bg-[#012A4A] text-lg rounded-xl" />
                        ) : (
                          <FaRegSquare className="text-[#D0D5DD] text-lg rounded-xl" />
                        )}
                      </button>
                      <span className="text-gray-700">{module}</span>
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.read || false}
                        onChange={() => togglePermission(module, 'read')}
                        className="h-4 w-4 text-[#012A4A] rounded-xl border-[#D0D5DD]"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.write || false}
                        onChange={() => togglePermission(module, 'write')}
                        className="h-4 w-4 text-[#012A4A] rounded-xl border-[#D0D5DD]"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.delete || false}
                        onChange={() => togglePermission(module, 'delete')}
                        className="h-4 w-4 text-[#012A4A] rounded-xl border-[#D0D5DD]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-[#012A4A] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-[#040c11] shadow-md">Submit</button>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default StudentModuleAccess;
