import BaseLayout2 from '@/components/BaseLayout2';
import React from 'react';

export default function Classes() {
  return (
    <>
    <BaseLayout2>
      <div className="flex h-screen bg-gray-200">
        
        {/* Main Content */}
        <div className="flex-1 p-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Class</h1>
          
          {/* Session Info */}
          <div className="bg-red-500 text-white p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Tajweed Masterclass Session - 12</h2>
              <p className="text-sm">Prof. Smith | 9:00 AM - 10:30 AM</p>
            </div>
            <div className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold text-lg">
              Starts in 20:12:19
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-8">
              <div className="border-b-4 border-blue-500 pb-2">Upcoming (10)</div>
              <div className="pb-2">Completed (8)</div>
            </div>
            
            {/* Classes Table */}
            <div className="bg-white mt-4 rounded-lg shadow-lg p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Menu</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Samantha William</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Tajweed Masterclass</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">January 2, 2020</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-500">Available at 7:30 AM</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-gray-500 hover:text-gray-700"><i className="fas fa-ellipsis-h"></i></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-end mt-4">
              <div className="inline-flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-300 rounded-md text-gray-700">1</button>
                <button className="px-4 py-2 bg-red-500 rounded-md text-white">2</button>
                <button className="px-4 py-2 bg-gray-300 rounded-md text-gray-700">3</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout2>
    </>
  );
}
