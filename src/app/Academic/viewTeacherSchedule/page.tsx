import BaseLayout1 from "@/components/BaseLayout1";
import React from "react";

const ViewTeacherSchedule = () => {
  return (
    <BaseLayout1>
      <div className="p-6 mx-auto">
        <div className="w-full max-w-7xl rounded-lg p-6">
          <h2 className="text-[18px] p-2 font-semibold">Reschedule Class</h2>

          <div className="grid grid-cols-3 gap-6">
            {/* Left: Schedule Viewer */}
            <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-[15px] font-semibold text-gray-700 mb-4">
                Working hours
              </h2>
              <div className="relative">
                {/* Calendar Header */}
                <div className="grid grid-cols-12 border-b border-gray-300 mb-2">
                  <div className="col-span-1"></div>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="text-[12px] font-semibold text-gray-600 text-center p-2"
                    >
                      {i + 1} AM
                    </div>
                  ))}
                </div>

                {/* Calendar Rows */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day} // Use the unique day string as the key
                      className="grid grid-cols-12 items-center border-b border-gray-300 h-16 relative"
                    >
                      {/* Day Name */}
                      <div className="text-sm font-semibold text-gray-600 text-center p-2 border-r border-gray-300">
                        {day}
                      </div>
                      {/* Time Slots */}
                      <div className="col-span-11 relative">
                        {/* Example Classes */}
                        {day === "Sun" && (
                          <div
                            className="absolute bg-red-400 text-white text-xs rounded-lg py-1 px-2"
                            style={{
                              left: "25%", // Adjust based on time slot (2 AM)
                              width: "20%", // Adjust duration (2 hours)
                            }}
                          >
                            Class 1
                          </div>
                        )}
                        {day === "Tue" && (
                          <div
                            className="absolute bg-blue-400 text-white text-xs rounded-lg py-1 px-2"
                            style={{
                              left: "50%", // Adjust based on time slot (6 AM)
                              width: "30%", // Adjust duration (3 hours)
                            }}
                          >
                            Class 2
                          </div>
                        )}
                        {day === "Thu" && (
                          <div
                            className="absolute bg-black text-white text-xs rounded-lg py-1 px-2"
                            style={{
                              left: "40%", // Adjust based on time slot (5 AM)
                              width: "25%", // Adjust duration (2.5 hours)
                            }}
                          >
                            Class 3
                          </div>
                        )}
                        {day === "Sat" && (
                          <div
                            className="absolute bg-green-400 text-white text-xs rounded-lg py-1 px-2"
                            style={{
                              left: "60%", // Adjust based on time slot (7 AM)
                              width: "20%", // Adjust duration (2 hours)
                            }}
                          >
                            Class 4
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right: Add & Select Schedule Forms */}
            <div className="col-span-1 space-y-6 mt-8">
              {/* Add New Schedule */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-[14px] font-semibold text-gray-700 mb-4">
                  Add new Schedule
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                    />
                    <input
                      type="time"
                      className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                    />
                  </div>
                  <textarea
                    placeholder="Comment"
                    className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 rounded-lg text-[12px] hover:bg-gray-800"
                  >
                    Submit Schedule
                  </button>
                </form>
              </div>

              {/* Select Slot */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-700 mb-4 text-[12px]">
                  Select Slot
                </h3>
                <form className="space-y-4">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Day
                    </option>
                    <option value="Sun">Sunday</option>
                    <option value="Mon">Monday</option>
                    <option value="Tue">Tuesday</option>
                    <option value="Wed">Wednesday</option>
                    <option value="Thu">Thursday</option>
                    <option value="Fri">Friday</option>
                    <option value="Sat">Saturday</option>
                  </select>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 text-[12px]"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ViewTeacherSchedule;
