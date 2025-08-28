"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Admin token for direct authentication
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFkbWluIiwic3ViIjoiNjgwNWRhOGMwNjU0MmFhMzM4NThiODg5IiwiaWF0IjoxNzU1NzYwMDcxLCJleHAiOjE3NTU4NDY0NzF9.8qgL7NmVcW5si91WT9ezAkbjuWG9a8dwHD86f85H4bM";

export default function AddPackage({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    packageName: "",
    costPerHour: "",
    category: "",
    descriptionPoint: "",
    descriptionList: [""],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add a new description list item
  const addDescriptionItem = () => {
    setFormData({
      ...formData,
      descriptionList: [...formData.descriptionList, ""],
    });
  };

  // Remove a description list item
  const removeDescriptionItem = (index: number) => {
    if (formData.descriptionList.length <= 1) return;

    const newList = [...formData.descriptionList];
    newList.splice(index, 1);
    setFormData({
      ...formData,
      descriptionList: newList,
    });
  };

  // Update a description list item
  const updateDescriptionItem = (index: number, value: string) => {
    const newList = [...formData.descriptionList];
    newList[index] = value;
    setFormData({
      ...formData,
      descriptionList: newList,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (!formData.packageName.trim()) {
    setError("Package name is required");
    setIsLoading(false);
    return;
  }

  try {
    const payload = {
      packageName: formData.packageName,
      costPerHour: formData.costPerHour || "0", // string, not number
      categories: {
        Teacher: formData.category ? [formData.category] : [],
        Academics: [],
        PortalAcess: [],
        Scheduling: [],
        Dicount: []
      },
      descriptionPoint: formData.descriptionPoint,
      status: "Active",
      createdDate: new Date().toISOString(),
      createdBy: "admin",
      updatedDate: new Date().toISOString(),
      updatedBy: "admin",
    };

    console.log("Payload being sent:", payload);

    const response = await fetch("https://api.blackstoneinfomaticstech.com/package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to create package");
    console.error("Error:", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Add New Package
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Package Name *
              </label>
              <input
                type="text"
                value={formData.packageName}
                onChange={(e) =>
                  setFormData({ ...formData, packageName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter package name"
                required
              />
            </div>

            {/* Cost per hour */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Cost Per Hour
              </label>
              <input
                type="number"
                value={formData.costPerHour}
                onChange={(e) =>
                  setFormData({ ...formData, costPerHour: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category"
              />
            </div>

            {/* Description Point */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description Point
              </label>
              <input
                type="text"
                value={formData.descriptionPoint}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descriptionPoint: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description point"
              />
            </div>

            {/* Description List */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  Description List
                </label>
                <button
                  type="button"
                  onClick={addDescriptionItem}
                  className="text-blue-600 text-sm flex items-center"
                >
                  <Plus size={16} className="mr-1" /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                {formData.descriptionList.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateDescriptionItem(index, e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`List item ${index + 1}`}
                    />
                    {formData.descriptionList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDescriptionItem(index)}
                        className="ml-2 text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
