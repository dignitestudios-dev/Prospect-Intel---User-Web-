/* eslint-disable react/prop-types */
export const GradingScalePill = ({ label, active }) => {
  let pillColor = "";

  // Set pill color based on the label
  switch (label) {
    case "A":
      pillColor = "bg-black text-white border-black";
      break;
    case "B":
      pillColor = "bg-green-500 text-white border-green-500";
      break;
    case "C":
      pillColor = "bg-gray-500 text-white border-gray-500";
      break;
    case "D":
      pillColor = "bg-yellow-500 text-black border-yellow-500";
      break;
    case "F":
      pillColor = "bg-red-500 text-white border-red-500";
      break;
    default:
      pillColor = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
      break;
  }

  // Apply active state styles on top of the label-based styles
  return (
    <button
      className={`py-2 rounded-lg text-xs font-semibold transition-colors border w-[34px] h-[34px] 
            ${pillColor} ${active ? "opacity-100" : "opacity-50"}`}
    >
      {label}
    </button>
  );
};
