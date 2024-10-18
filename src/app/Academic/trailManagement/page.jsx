import BaseLayout1 from '@/components/BaseLayout1';
import Link from 'next/link';
import React from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa';


async function getAllUsers() {
    let response = await fetch('http://localhost:3000/api/users', {
        cache: 'no-store',
    })

    response = await response.json()
    return response
}

export default async function TrailManagement  () {
    const allData = await getAllUsers()
    console.log(allData)

    if (allData.success){
        const users = allData.data

        return(
            <>
            <BaseLayout1>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Student List for Evaluation Session</h2>
                        <div className="flex space-x-2">
                            <button className="flex items-center bg-gray-200 p-2 rounded-lg shadow">
                            <FaFilter className="mr-2" /> Filter
                            </button>
                            <input
                            type="text"
                            placeholder="Search Student"
                            className="border rounded-lg p-2 shadow"
                            />
                            <button className="bg-pink-500 text-white p-2 rounded-lg shadow flex items-center">
                            <FaPlus className="mr-2" /> Add new
                            </button>
                            <select className="border rounded-lg p-2 shadow">
                            <option>Duration: Last month</option>
                            <option>Duration: Last week</option>
                            <option>Duration: Last year</option>
                            </select>
                        </div>
                        </div>
                        <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr>
                                <th className="p-4 text-left">First Name</th>
                                <th className="p-4 text-left">Last Name</th>
                                <th className="p-4 text-left">Email Address</th>
                                <th className="p-4 text-left">Mobile Number</th>
                                <th className="p-4 text-left">Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-4">{item.fname}</td>
                                <td className="p-4">{item.lname}</td>
                                <td className="p-4">{item.email}</td>
                                <td className="p-4">{item.number}</td>
                                <td className="p-4">{item.country}</td>
                                <td className="p-4">
                                    <Link href={'/evalue'}><button className="bg-green-500 text-white p-2 rounded-lg shadow">
                                    Start Evaluation
                                </button></Link>
                                
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
            </BaseLayout1>
            </>
        )
    } else {
        return (
            <BaseLayout1>
                <div className="min-h-screen p-4">
                    {allData.message}
                </div>
            </BaseLayout1>
          );
    }



  
};

