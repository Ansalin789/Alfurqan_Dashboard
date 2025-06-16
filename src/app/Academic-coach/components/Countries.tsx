import React from "react";
import {
  FaFlagUsa,
  FaCanadianMapleLeaf, // Use this for Canada as there's no direct Canada flag
} from "react-icons/fa";
import { AE as UAEFlag, JP as JapanFlag } from "country-flag-icons/react/3x2"; // Renamed to PascalCase

export default function Countries() {
  const countriesData = [
    { name: "USA", count: 5, icon: <FaFlagUsa className="text-lg mr-2" /> },
    { name: "UAE", count: 3, icon: <UAEFlag className="w-6 h-4 mr-2" /> },
    {
      name: "Canada",
      count: 2,
      icon: <FaCanadianMapleLeaf className="text-lg mr-2" />,
    },
    { name: "Japan", count: 1, icon: <JapanFlag className="w-6 h-4 mr-2" /> },
  ];

  return (
    <div className="col-span-12 rounded-xl p-2 text-[#000] dark:text-[#fff]">
      <h3 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-2 px-3 py-2">Countries</h3>
      <table className="min-w-full divide-y divide-gray-200 overflow-y-scroll scrollbar-hide">
        <tbody className="divide-y divide-gray-200">
          {countriesData.map((country) => (
            <tr
              key={country.name}
              className="justify-between items-center flex border-b-[1px] dark:border-[#585858] px-3"
            >
              <td className="flex items-center text-[#000] dark:text-[#fff] gap-2 py-1 text-[12px]">
                <span className="w-6">{country.icon}</span>
                <span className="py-1 text-[11px] text-center font-normal flex text-[#010e30] opacity-90 dark:text-[#fff]">{country.name}</span>
              </td>
              <td className="py-2 text-[13px] whitespace-nowrap text-center text-[#010e30] dark:text-[#fff] font-medium">{country.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
