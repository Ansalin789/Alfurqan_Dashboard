'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import { useState } from 'react';
import { FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';

const SupervisorModuleAccess = () => {
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
      <div className="min-h-screen flex items-center justify-center p-6 mx-auto">
        <div className="p-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Academic Coach Module Access</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-4">Modules</th>
                  <th className="p-4 text-center">Read</th>
                  <th className="p-4 text-center">Write</th>
                  <th className="p-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module} className="border-t hover:bg-gray-50">
                    <td className="p-4 flex items-center space-x-3">
                      <button onClick={() => toggleModule(module)}>
                        {selectedModules[module] ? (
                          <FaRegCheckSquare className="text-blue-600 text-lg" />
                        ) : (
                          <FaRegSquare className="text-gray-500 text-lg" />
                        )}
                      </button>
                      <span className="text-gray-700">{module}</span>
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.read || false}
                        onChange={() => togglePermission(module, 'read')}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.write || false}
                        onChange={() => togglePermission(module, 'write')}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.delete || false}
                        onChange={() => togglePermission(module, 'delete')}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <button className="bg-[#012A4A] text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-800 shadow-md">Submit</button>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default SupervisorModuleAccess;
