import BaseLayout2 from '@/components/BaseLayout2';
import Image from 'next/image';
import React from 'react';

export default function Payments() {
  return (
    <>
      <BaseLayout2>
      <div className="flex h-screen bg-gray-200">

{/* Main Content */}
<div className="flex-1 p-10">
  <h1 className="text-4xl font-bold text-gray-800 mb-6">Payments</h1>

  {/* Order Details Section */}
  <div className="bg-white p-6 rounded-lg shadow-md mb-10">
    <h2 className="text-xl font-bold mb-4">Your Order</h2>
    <div className="flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <Image src="/assets/images/alf1.png" alt="Order" className="h-12 w-12" />
        </div>
        <div>
          <p className="text-lg font-semibold">Tajweed Masterclass</p>
          <p className="text-sm text-gray-500">Month: Jan Year: 2024</p>
        </div>
      </div>
      <p className="text-lg font-bold">$28.00</p>
    </div>

    <div className="flex justify-between items-center mt-6">
      <input
        type="text"
        placeholder="Apply Discount"
        className="p-2 border rounded-md w-64"
      />
      <div className="text-right">
        <p>Subtotal: <span className="font-bold">$56.00</span></p>
        <p>Shipping Cost: <span className="font-bold">$8.00</span></p>
        <p>Discount (10%): <span className="font-bold">- $13.00</span></p>
        <p className="mt-2 text-xl">Total: <span className="font-bold">$51.00</span></p>
      </div>
    </div>
  </div>

  {/* Latest Transaction Section */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Latest Transaction</h2>
      <button className="text-blue-500">View All</button>
    </div>

    <table className="w-full text-left p-10">
      <thead>
        <tr className="text-gray-500">
          <th>Date</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Invoice</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t p-2">
          <td>January 2, 2020</td>
          <td>Samantha William</td>
          <td>$60.00</td>
          <td><span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">Completed</span></td>
          <td><button className="text-blue-500">Download</button></td>
        </tr>
        <tr className="border-t p-2">
          <td>January 2, 2020</td>
          <td>Jordan Nico</td>
          <td>$60.00</td>
          <td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">Pending</span></td>
          <td><button className="text-blue-500">Download</button></td>
        </tr>
        <tr className="border-t p-2">
          <td>January 2, 2020</td>
          <td>Nadila Adja</td>
          <td>$60.00</td>
          <td><span className="bg-red-100 text-red-700 px-2 py-1 rounded-md">Canceled</span></td>
          <td><button className="text-blue-500">Download</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>
      </BaseLayout2>
    </>
    
  );
}
