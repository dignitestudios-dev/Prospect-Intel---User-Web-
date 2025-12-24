import { useState } from "react";

export const CustomRangeSlider = () => {
  // Initial values from the image: Min=00, Max=52
  // We'll assume the full range is 100 for easy percentage calculation
  const totalRange = 100;
  const initialMin = 0;
  const initialMax = 52;

  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  // Handlers to prevent min from exceeding max and vice-versa
  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    setMin(Math.min(newMin, max - 1));
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    setMax(Math.max(newMax, min + 1));
  };

  // Calculate percentage positions for the active blue track
  const leftPercentage = (min / totalRange) * 100;
  const rightPercentage = (1 - max / totalRange) * 100;

  return (
    <div className="mx-auto bg-[#EAEEF8] overflow-auto">
      {/* Header Section */}

      {/* Slider Track and Thumbs */}
      <div className="relative pt-2">
        {/* Background Track */}
        <div className="absolute w-full h-full bg-[#EAEEF8] border border-[#E3E3E3] top-[calc(50%)] -translate-y-1/2 rounded-full"></div>

        {/* Blue Active Track */}
        <div
          className="absolute h-1 bg-blue-600 rounded-full top-[calc(50%)] -translate-y-1/2"
          style={{
            left: `${leftPercentage}%`,
            right: `${rightPercentage}%`,
          }}
        ></div>

        {/* Input ranges (styled to be invisible but functional) */}
        {/* Min Slider */}
        <input
          type="range"
          min="0"
          max={totalRange}
          value={min}
          onChange={handleMinChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-10 custom-range-thumb"
        />
        {/* Max Slider */}
        <input
          type="range"
          min="0"
          max={totalRange}
          value={max}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto z-10 custom-range-thumb"
        />

        {/* Custom Styles for Slider Thumb (including the two vertical lines) */}
        <style jsx="true">{`
          /* General Styles for Range Inputs */
          .custom-range-thumb {
            height: 14px; /* Makes the invisible track area larger for easier interaction */
            margin: 0;
            padding: 0;
            cursor: pointer;
            z-index: 20; /* Ensure thumbs are always on top */
          }

          /* Webkit/Blink Thumb Styles */
          .custom-range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: white;
            border: 2px solid #2563eb; /* Blue 600 */
            cursor: grab;
            position: relative;
            z-index: 30; /* Higher Z-index than track */
            margin-top: -6px; /* Adjust vertical position */

            /* Vertical lines using pseudo-elements */
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Vertical line 1 */
          .custom-range-thumb::-webkit-slider-thumb::before {
            content: "";
            position: absolute;
            width: 2px;
            height: 6px; /* Height of the line */
            background: #2563eb; /* Blue color */
            left: 4px; /* Position to the left */
            top: 50%;
            transform: translateY(-50%);
            z-index: 31;
          }

          /* Vertical line 2 */
          .custom-range-thumb::-webkit-slider-thumb::after {
            content: "";
            position: absolute;
            width: 2px;
            height: 6px;
            background: #2563eb;
            right: 4px; /* Position to the right */
            top: 50%;
            transform: translateY(-50%);
            z-index: 31;
          }

          /* Firefox Thumb Styles */
          .custom-range-thumb::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: white;
            border: 2px solid #2563eb;
            cursor: grab;
            /* Firefox does not support pseudo-elements on ::-moz-range-thumb easily, 
                           so the vertical lines will be missing in Firefox without a more complex library approach. */
          }
        `}</style>
      </div>

      {/* Min/Max Value Boxes */}
      <div className="flex justify-between items-center mt-6 text-sm gap-2">
        {/* Min Rating Box */}
        <div className=" bg-white rounded-lg p-3 w-[50%] ">
          <span className="text-gray-500 text-xs block font-normal leading-tight">
            Min Rating
          </span>
          <span className="font-bold text-xl text-gray-900">
            {min.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Max Rating Box */}
        <div className=" bg-white rounded-lg p-3 w-[50%] ">
          <span className="text-gray-500 text-xs block font-normal leading-tight">
            Max Rating
          </span>
          <span className="font-bold text-xl text-gray-900">
            {max.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};
