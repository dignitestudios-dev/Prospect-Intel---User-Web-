/* eslint-disable react/prop-types */
export const GradingScale = ({ label, active }) => (
  <button
    className={`py-2 rounded-lg text-xs font-semibold transition-colors border w-full 
        ${
          active
            ? "bg-gray-800 text-white border-gray-800"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
  >
    {label}
  </button>
);
