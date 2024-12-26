import React from 'react';

const ScheduledClasses = () => {
  const classes = [
    { name: 'Samantha William', course: 'Tajweed Masterclass', date: 'January 2, 2020', status: 'Attended at 7:00 AM' },
    { name: 'Jordan Nico', course: 'Tajweed Masterclass', date: 'January 2, 2020', status: 'Failed' },
    // Add more classes as needed
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Scheduled (10) Completed (80)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">{cls.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{cls.course}</td>
                <td className="px-4 py-2 whitespace-nowrap">{cls.date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{cls.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledClasses;
