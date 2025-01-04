import React from "react";
import { BsSun, BsMoon } from "react-icons/bs";

interface ToggleSwitchProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  darkMode,
  toggleDarkMode,
}) => {
  return (
    <div className="flex items-center">
      <BsSun
        className={`text-xl ${darkMode ? "text-gray-500" : "text-yellow-500"}`}
      />
      <div className="relative inline-block w-10 ml-2 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
          type="checkbox"
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <span
          className={`block overflow-hidden h-6 rounded-full ${
            darkMode ? "bg-gray-500" : "bg-gray-200"
          }`}
        />
      </div>
      <BsMoon
        className={`text-xl ${darkMode ? "text-yellow-500" : "text-gray-500"}`}
      />
    </div>
  );
};

export default ToggleSwitch;
