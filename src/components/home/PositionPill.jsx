/* eslint-disable react/prop-types */
export const PositionPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors border w-full uppercase
        ${active
        ? "bg-gray-800 text-white border-gray-800"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
  >
    {label}
  </button>
);
