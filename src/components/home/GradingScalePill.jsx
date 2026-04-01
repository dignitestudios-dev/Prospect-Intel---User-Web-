/* eslint-disable react/prop-types */
export const GradingScalePill = ({ label, active, onClick }) => {
  let pillColor = "";

  // Set pill color based on the label
  switch (label) {
    case "A":
      pillColor = "bg-black text-white border-black hover:opacity-80";
      break;
    case "B":
      pillColor = "bg-green-500 text-white border-green-500 hover:opacity-80";
      break;
    case "C":
      pillColor = "bg-gray-500 text-white border-gray-500 hover:opacity-80";
      break;
    case "D":
      pillColor = "bg-yellow-500 text-black border-yellow-500 hover:opacity-80";
      break;
    case "F":
      pillColor = "bg-red-500 text-white border-red-500 hover:opacity-80";
      break;
    case "N/A":
      pillColor = "bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300";
      break;
    default:
      pillColor = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`py-2 rounded-lg text-xs font-semibold transition-all border w-[34px] h-[34px]
  ${pillColor}
  ${active
          ? "ring-2 ring-offset-1 ring-black scale-105"
          : "opacity-40 hover:opacity-80"
        }`}
    >
      {label}
    </button>
  );
};