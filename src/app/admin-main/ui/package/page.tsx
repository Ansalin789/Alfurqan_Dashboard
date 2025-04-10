"use client"

import { useState } from "react"
import { Search, Filter, Edit2 } from "lucide-react"
import BaseLayout4 from "@/components/BaseLayout4"

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState("Simple")

  return (
    <BaseLayout4>
      <div className="flex-1 overflow-auto scrollbar-none">
        <div className="p-4 text-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-[#002b4d]">Packages</h1>
          </div>

          <div className="flex justify-between mb-3 items-center">
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="pl-8 pr-3 py-1.5 border rounded-md w-[280px] text-xs"
                />
                <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
              </div>
              <button className="flex items-center space-x-1 px-3 py-1.5 border rounded-md bg-white text-xs">
                <Filter size={16} />
                <span>Filter</span>
              </button>
            </div>
            <button className="bg-[#002b4d] text-white px-3 py-1.5 rounded-md flex items-center text-xs">
              <span className="mr-1 text-sm">+</span>
              Add new Package
            </button>
          </div>

          <div className="mb-3">
            <div className="flex space-x-2">
              {["Simple", "Essential", "Premium", "Elite"].map((pkg) => (
                <button
                  key={pkg}
                  className={`px-4 py-1.5 rounded-md text-xs ${
                    selectedPackage === pkg ? "bg-[#002b4d] text-white" : "bg-white text-gray-700"
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium text-xs">Cost Per Hour</label>
            <div className="relative">
              <span className="absolute left-2 top-2.5 text-xs">$</span>
              <input type="text" className="pl-6 pr-3 py-1.5 border rounded-md w-[280px] text-xs" />
            </div>
          </div>

          <FeatureSection
            title="Teachers"
            features={[
              "Expert Arabic (Native) Teacher",
              "Institutionally Certified",
              "Top 5 Star Rated Teacher",
            ]}
          />

          <FeatureSection
            title="Academics"
            features={[
              "E-Certificate",
              "Direct Chat with Teacher & Coach",
              "Dedicated Academic Coach",
              "Coaching and Planning Session every Quarterly",
              "Progress Report Every Year",
            ]}
          />

          <FeatureSection
            title="Portal Access"
            features={[
              "Full Dashboard Access",
              "Knowledge Base Access",
              "Assignments",
              "Recorded Classes",
              "Progress Report Every Year",
            ]}
          />

          <FeatureSection
            title="Scheduling"
            features={[
              "Unlimited Reschedule of Class Per Month",
              "Unlimited Lesson Reschedule",
            ]}
          />

          <FeatureSection title="Discounts" features={["10% Discount for Family"]} />

          <div className="flex justify-center space-x-3 mt-5">
            <button className="px-4 py-1.5 border rounded-md bg-white text-xs">Cancel</button>
            <button className="px-4 py-1.5 rounded-md bg-[#002b4d] text-white text-xs">Save</button>
          </div>
        </div>
      </div>
    </BaseLayout4>
  )
}

function FeatureSection({ title, features }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-medium text-sm">{title}</h3>
        <button className="text-gray-500">
          <Edit2 size={16} />
        </button>
      </div>
      <div className="bg-white border rounded-md p-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start py-1 text-xs">
            <input type="checkbox" className="mt-1 mr-2" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
