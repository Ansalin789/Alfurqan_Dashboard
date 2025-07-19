"use client";

import { X, Plus, DollarSign } from "lucide-react";
import { useState } from "react";

const AddPackage = ({ onClose }: { onClose: () => void }) => {
  const [description, setDescription] = useState("");
  const [descriptionList, setDescriptionList] = useState<string[]>([]);

  const handleAddDescription = () => {
    if (description.trim()) {
      setDescriptionList((prev) => [...prev, description.trim()]);
      setDescription("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <h3 className="text-sm font-semibold text-[#002b4d] dark:text-white mb-4">
          Add New Package
        </h3>

        {/* Package Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Package Name
          </label>
          <input
            type="text"
            placeholder="Enter package name"
            className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#002b4d]"
          />
        </div>

        {/* Cost Per Hour */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Cost Per Hour
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Enter cost"
              className="w-full border rounded-md px-3 py-2 text-sm pr-10 outline-none bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#002b4d]"
            />
            <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#002b4d]">
            <option>Select Category</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>

        {/* Description Point */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Description Point
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter point"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm pr-8 outline-none bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#002b4d]"
            />
            <button
              type="button"
              onClick={handleAddDescription}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-[#002b4d] hover:bg-[#001f36] rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Description List */}
        <div className="mb-6">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Description List
          </label>
          <textarea
            value={descriptionList.join("\n")}
            readOnly
            className="w-full border rounded-md px-3 py-2 text-sm h-24 resize-none outline-none bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#002b4d]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-[#4E61A7] text-white rounded-md hover:bg-[#3a4d91]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
