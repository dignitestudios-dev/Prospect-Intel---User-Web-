/* eslint-disable react/prop-types */
export const CollegePill = ({ logo, name, active = false }) => (
  <button
    className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs transition-colors border whitespace-nowrap 
        ${
          active
            ? "bg-blue-50 text-blue-700 border-blue-400"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
  >
    {logo && (
      <img src={logo} alt={name} className="w-4 h-4 mr-1 object-contain" />
    )}
    {name}
  </button>
);
