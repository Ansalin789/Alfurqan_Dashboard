"use client"

import { useState } from "react"
import { Calendar, File, MapPin, Phone, Upload, X } from "lucide-react"
import BaseLayout4 from "@/components/BaseLayout4"
export default function InvoicePage() {
  const [attachedFile] = useState({
    name: "Contact_2020.pdf",
    size: "456 KB",
  })

  

  return (
    <BaseLayout4>
    <div className="flex items-center justify-center py-4 ml-16">
      <div className="w-full max-w-5xl mx-auto p-5 ml-5  bg-white rounded-xl shadow-sm">
        <div className="space-y-4">
          {/* SELECT STUDENT */}
          <div>
            <h2 className="text-base font-semibold mb-3">SELECT STUDENT</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm border border-gray-100 w-full md:w-64">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-purple-500"></div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Kleonium Studios</h3>
                      <svg
                        className="w-3 h-3 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">Creative Agency</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ADDRESS</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-700 mt-0.5" />
                    <div>
                      <p className="text-xs">Franklin Avenue Street</p>
                      <p className="text-xs">New York, ABC 5562</p>
                      <p className="text-xs">United State</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">EMAIL</p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <p className="text-xs">kleoniumstudios@mail.com</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">TELEPHONE</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-700" />
                    <p className="text-xs">(012) 3456 789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL */}
          <div>
            <h2 className="text-base font-semibold mb-3">GENERAL</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">INVOICE NO</p>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  defaultValue="#INV-123124124"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">AMOUNT (USD)</p>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  defaultValue="108"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 pr-8 text-sm"
                    defaultValue="December 11th, 2020"
                  />
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* ITEM DESCRIPTION */}
          <div>
            <h2 className="text-base font-semibold mb-3">Item Description</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="pb-2 font-normal">PACKAGE TYPE</th>
                    <th className="pb-2 font-normal">ITEM DESCRIPTION</th>
                    <th className="pb-2 font-normal">DURATION</th>
                    <th className="pb-2 font-normal">RATE</th>
                    <th className="pb-2 font-normal text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 text-sm">Elite</td>
                    <td className="py-3 text-sm">Quran learning</td>
                    <td className="py-3 text-sm">12h</td>
                    <td className="py-3 text-sm">9.00</td>
                    <td className="py-3 text-sm text-right">$ 108.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <textarea
                placeholder="Type description here..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[60px]"
              />
            </div>
          </div>

          {/* ATTACH FILE */}
          <div>
            <h2 className="text-base font-semibold mb-3">Attach File</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="border border-dashed border-green-200 bg-green-50 rounded-lg p-3 flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Upload Files</p>
                  <p className="text-xs text-gray-500">PDF, DOC, PPT, JPG, PNG</p>
                </div>
              </div>

              {attachedFile && (
                <div className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-blue-900" />
                    <div>
                      <p className="text-xs font-medium">{attachedFile.name}</p>
                      <p className="text-xs text-gray-500">{attachedFile.size}</p>
                    </div>
                  </div>
                  <button
                    
                    className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-1.5 rounded-md text-sm">
              SEND INVOICE
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-1.5 rounded-md text-sm">
              SAVE TO LATER
            </button>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout4>
  )
}
