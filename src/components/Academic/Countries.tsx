// import React from 'react';
// import { FaFlagUsa, FaFlagUae, FaFlagCanada, FaFlagJapan } from 'react-icons/fa';

import React from 'react';
import { 
    FaFlagUsa, 
    FaCanadianMapleLeaf,  // Use this for Canada as there's no direct Canada flag
} from 'react-icons/fa';
import { AE as UAEFlag, JP as JapanFlag } from 'country-flag-icons/react/3x2';  // Renamed to PascalCase

export default function Countries() {
    const countriesData = [
        { name: 'USA', count: 5, icon: <FaFlagUsa className="text-lg mr-2" /> },
        { name: 'UAE', count: 3, icon: <UAEFlag className="w-6 h-4 mr-2" /> },
        { name: 'Canada', count: 2, icon: <FaCanadianMapleLeaf className="text-lg mr-2" /> },
        { name: 'Japan', count: 1, icon: <JapanFlag className="w-6 h-4 mr-2" /> },
    ];

    return (
        <div className="col-span-12 bg-[#3e68a1] p-8 py-4 rounded-[25px] shadow-lg">
            <h3 className="text-[15px] font-semibold text-white mb-2">Countries</h3>
            <table className="min-w-full divide-y divide-gray-200 overflow-y-scroll scrollbar-hide">
                <tbody className="divide-y divide-gray-200">
                    {countriesData.map((country, index) => (
                        <tr key={index} className="flex justify-between items-center">
                            <td className="flex items-center text-white gap-3 py-2 text-[12px]">
                                <span className='w-6'>{country.icon}</span>
                                <span className='text-[12px]'>{country.name}</span>
                            </td>
                            <td className="text-white py-1">{country.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
