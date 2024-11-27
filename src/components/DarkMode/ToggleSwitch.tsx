import React from 'react';
import { useDarkMode } from '@/components/DarkMode/DarkModeContext';

const ToggleSwitch = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
        darkMode ? 'bg-gray-700' : 'bg-gray-300'
      }`}
      onClick={toggleDarkMode}
    >
      <div
        className={`h-6 w-6 rounded-full shadow-md transform transition-transform ${
          darkMode ? 'bg-white translate-x-6' : 'bg-gray-800'
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
