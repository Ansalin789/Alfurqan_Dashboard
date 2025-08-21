// import React from "react";
// import {
//   FaFlagUsa,
//   FaCanadianMapleLeaf, // Use this for Canada as there's no direct Canada flag
// } from "react-icons/fa";
// import { AE as UAEFlag, JP as JapanFlag } from "country-flag-icons/react/3x2"; // Renamed to PascalCase

// export default function Countries() {
//   const countriesData = [
//     { name: "USA", count: 5, icon: <FaFlagUsa className="text-lg mr-2" /> },
//     { name: "UAE", count: 3, icon: <UAEFlag className="w-6 h-4 mr-2" /> },
//     {
//       name: "Canada",
//       count: 2,
//       icon: <FaCanadianMapleLeaf className="text-lg mr-2" />,
//     },
//     { name: "Japan", count: 1, icon: <JapanFlag className="w-6 h-4 mr-2" /> },
//   ];

//   return (
//     <div className="col-span-12 rounded-xl p-2 text-[#000] dark:text-[#fff]">
//       <h3 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-2 px-3 py-2">Countries</h3>
//       <table className="min-w-full divide-y divide-gray-200 overflow-y-scroll scrollbar-hide">
//         <tbody className="divide-y divide-gray-200">
//           {countriesData.map((country) => (
//             <tr
//               key={country.name}
//               className="justify-between items-center flex border-b-[1px] dark:border-[#585858] px-3"
//             >
//               <td className="flex items-center text-[#000] dark:text-[#fff] gap-2 py-1 text-[12px]">
//                 <span className="w-6">{country.icon}</span>
//                 <span className="py-1 text-[11px] text-center font-normal flex text-[#010e30] opacity-90 dark:text-[#fff]">{country.name}</span>
//               </td>
//               <td className="py-2 text-[13px] whitespace-nowrap text-center text-[#010e30] dark:text-[#fff] font-medium">{country.count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import countries from "i18n-iso-countries";
import { FaGlobeAmericas } from "react-icons/fa";

// Register English country names
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

interface EmpCountryData {
  country: string;
  count: number;
}

// Utility to convert country name to ISO alpha-2 code
function getCountryISOCode(countryName: string | null): string | null {
  if (!countryName) return null;
  const code = countries.getAlpha2Code(countryName.trim(), "en");
  return code ? code.toLowerCase() : null;
}

export default function Countries() {
  const [countryDataemp, setCountryDataemp] = useState<EmpCountryData[]>([]);

  useEffect(() => {
    const fetchCountryData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;
      const id =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachPortalId")
          : null;

      if (!id) {
        console.warn("⚠️ Missing academicCoachId in URL query params.");
        return;
      }

      try {
        const res = await fetch(
          `https://api.blackstoneinfomaticstech.com/alstudents/studentscountrycount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        console.log(json);
        setCountryDataemp(json.studentCountByCountry || []);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, []);

  return (
    <div className="col-span-12 rounded-xl p-2 text-[#000] dark:text-[#fff]">
      <h2 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-2 px-3 py-2">
        Countries
      </h2>
      <div className="overflow-y-scroll h-[275px] scrollbar-none px-2">
        {countryDataemp.map((country, i) => {
          const countryCode = countries.getAlpha2Code(country.country, "en");

          const flagUrl = countryCode
            ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
            : "/assets/images/flags/default.png";

          return (
            <div
              key={country.country}
              className="flex items-center gap-2 border-b border-[#E6E6E6] dark:border-[#585858]"
            >
              <div>
                <img
                  src={flagUrl}
                  alt={country.country}
                  className="w-6 h-4 rounded-[2px]"
                />
              </div>

              <div className="w-full">
                <div className="flex justify-between mt-1 text-[13px] font-normal text-[#010E30E5] dark:text-[#fff] opacity-90 mb-[5px]">
                  <span className="opacity-90">{country.country}</span>
                  <span className="text-[#010e30] dark:text-[#fff] font-medium text-[13px]">
                    {country.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
