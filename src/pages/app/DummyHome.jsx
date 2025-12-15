import React, { useState } from "react";
import { FaChevronRight, FaChevronLeft, FaChevronDown, FaChevronUp, FaFilter, FaPrint, FaDownload, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";
import ActiveTable from "../../components/ActiveTable";
import ArchivedTable from "../../components/ArchivedTable";

// Dummy data for players
const players = [
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  {
    img: "https://i.pravatar.cc/50?img=1",
    name: "Liam O’Sullivan",
    grad: "2024",
    position: "Right Back",
    football: "A",
    personal: "C-",
    h: "6’4”",
    w: "250",
    location: "Colorado",
    collegeLogo: "https://placehold.co/600x400",
    collegeName: "T College Name",
  },
  // Add the rest of your player data here...
];

const positionPills = [
    { label: "QB", active: true },
    { label: "RB", active: false },
    { label: "WR", active: false },
     { label: "QB", active: false },
    { label: "RB", active: false },
    { label: "WR", active: false },
     { label: "QB", active: false },
    { label: "RB", active: false },
    { label: "WR", active: false },
];

const gradYearPills = [
    { label: "2020", active: true },
    { label: "2021", active: false },
    { label: "2022", active: false },
    { label: "2023", active: false },
    { label: "2024", active: true },
    { label: "2025", active: false },
];

const gradingscale  = [
    { label: "A", active: true },
    { label: "B", active: false },
    { label: "C", active: false },
    { label: "D", active: false },
    { label: "E", active: true },
    { label: "F", active: false },
];


const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 last:border-b-0 py-3">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                {isOpen ? <FaChevronUp className="text-gray-500 text-[10px]" /> : <FaChevronDown className="text-gray-500 text-[10px]" />}
            </div>
            {isOpen && <div className="mt-3">{children}</div>}
        </div>
    );
};


const CustomRangeSlider = () => {
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
    const rightPercentage = (1 - (max / totalRange)) * 100;

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
                        border: 2px solid #2563EB; /* Blue 600 */
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
                        content: '';
                        position: absolute;
                        width: 2px;
                        height: 6px; /* Height of the line */
                        background: #2563EB; /* Blue color */
                        left: 4px; /* Position to the left */
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 31;
                    }

                    /* Vertical line 2 */
                    .custom-range-thumb::-webkit-slider-thumb::after {
                        content: '';
                        position: absolute;
                        width: 2px;
                        height: 6px;
                        background: #2563EB;
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
                        border: 2px solid #2563EB;
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
                    <span className="text-gray-500 text-xs block font-normal leading-tight">Min Rating</span>
                    <span className="font-bold text-xl text-gray-900">{min.toString().padStart(2, '0')}</span>
                </div>
                
                {/* Max Rating Box */}
                <div className=" bg-white rounded-lg p-3 w-[50%] ">
                    <span className="text-gray-500 text-xs block font-normal leading-tight">Max Rating</span>
                    <span className="font-bold text-xl text-gray-900">{max.toString().padStart(2, '0')}</span>
                </div>
            </div>
        </div>
    );
};




const PositionPill = ({ label, active }) => (
     <button className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors border w-full 
        ${active ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
        {label}
    </button>
);

const GradYearPill = ({ label, active }) => (
    <button className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors border w-full 
        ${active ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
        {label}
    </button>
);



const GradingScalePill = ({ label, active }) => {
    let pillColor = '';

    // Set pill color based on the label
    switch (label) {
        case 'A':
            pillColor = 'bg-black text-white border-black';
            break;
        case 'B':
            pillColor = 'bg-green-500 text-white border-green-500';
            break;
        case 'C':
            pillColor = 'bg-gray-500 text-white border-gray-500';
            break;
        case 'D':
            pillColor = 'bg-yellow-500 text-black border-yellow-500';
            break;
        case 'F':
            pillColor = 'bg-red-500 text-white border-red-500';
            break;
        default:
            pillColor = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
            break;
    }

    // Apply active state styles on top of the label-based styles
    return (
        <button
            className={`py-2 rounded-lg text-xs font-semibold transition-colors border w-[34px] h-[34px] 
            ${pillColor} ${active ? 'opacity-100' : 'opacity-50'}`}
        >
            {label}
        </button>
    );
};


const CollegePill = ({ logo, name, active = false }) => (
    <button className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs transition-colors border whitespace-nowrap 
        ${active ? 'bg-blue-50 text-blue-700 border-blue-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
        {logo && <img src={logo} alt={name} className="w-4 h-4 mr-1 object-contain" />}
        {name}
    </button>
);


const GradingScale = ({ label, active }) => (
    <button className={`py-2 rounded-lg text-xs font-semibold transition-colors border w-full 
        ${active ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
        {label}
    </button>
);

const DummyHome = () => {
  const [isArchived, setIsArchived] = useState(false); // Toggle state for Active/Archived

  const toggleTab = () => setIsArchived((prevState) => !prevState);

  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans ">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        <div className="p-6 flex justify-between items-center">
          {/* Header Content */}
          <div className="flex items-center gap-10 ">
            <div className="relative ">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search for players"
                className="w-[380px] font-thin h-[50px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Right Side Header Buttons and Account */}
          <div className="flex items-center space-x-20 border-gray-200 pl-2 ">
            {/* LEFT SIDE: Print + PDF */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] rounded-lg text-gray-700 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                <FaPrint className="mr-2 text-xs" />
                Print
              </button>
              <button className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] text-gray-700 rounded-lg text-sm shadow shadow-blue-200 hover:bg-gray-50 transition-colors">
                <FaDownload className="mr-2 text-xs" />
                Download Pdf
              </button>
            </div>

            {/* RIGHT SIDE: Active / Archived Toggle */}
            <div className="flex items-center ">
              <div className="flex border border-white bg-[#EAEEF8] rounded-lg overflow-hidden shadow-sm p-1">
                <button
                  className={`px-10 py-2 text-black rounded-lg text-sm font-medium ${!isArchived ? 'bg-[#EAEEF8] border-2 border-white' : 'hover:bg-gray-50'}`}
                  onClick={toggleTab}
                >
                  Active
                </button>
                <button
                  className={`px-6 py-2 text-gray-600 rounded-lg text-sm font-medium ${isArchived ? 'bg-[#EAEEF8] border-2 border-white' : 'hover:bg-gray-50'}`}
                  onClick={toggleTab}
                >
                  Archived
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Table and Filters */}
        <div className="flex">
          {/* Left Side: Table & Results */}
          <div className="flex-grow p-6 pt-4 border-2 border-r border-gray-100 max-w-[calc(100%-300px)]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">100 Results</h3>

            {/* Active or Archived Table */}
            {isArchived ? <ArchivedTable players={players} /> : <ActiveTable players={players} />}
          </div>

          {/* Right Side: Filters Panel (Fixed Width) */}
          {/* <div className="w-[300px] p-6 pt-4 border-l-2 border-gray-200"> */}
            {/* Filters Section */}
           <div className="w-[300px] p-6 pt-4 border-l-2 border-gray-200    mb-2">
                        
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                            <div className="flex items-center">
                                <FaFilter className="text-base text-gray-800 mr-2" />
                                <h3 className="text-base font-bold text-gray-800">Filters</h3>
                            </div>
                            <button className="text-md text-black bg-white p-1.5 px-4 rounded-lg font-extralight hover:text-blue-700">Clear All</button>
                        </div>

                        {/* Filter Sections */}
                        <div className="divide-y divide-gray-100">
                            {/* Position */}
                            <FilterSection title="Position">
                                <div className="grid grid-cols-3 gap-2">
                                    {positionPills.map((p, i) => (
                                        <PositionPill key={i} label={p.label} active={p.active} />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Rating */}
                            <FilterSection title="Rating">
                                <CustomRangeSlider />
                            </FilterSection>


                             <FilterSection title="Grading Scale" defaultOpen={false}>
                                <div className="grid grid-cols-7 gap-7 ">
                                    {gradingscale.map((y, i) => (
                                        (y.active || i < 6) && <GradingScalePill key={i} label={y.label} active={y.active} />
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Grad Year */}
                            <FilterSection title="Grad Year" defaultOpen={false}>
                                <div className="grid grid-cols-3 gap-2">
                                    {gradYearPills.map((y, i) => (
                                        (y.active || i < 3) && <GradYearPill key={i} label={y.label} active={y.active} />
                                    ))}
                                </div>
                            </FilterSection>

                           

                            {/* Committed Colleges */}
                            <FilterSection title="Committed College">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Placeholder content for college pills matching image style */}
                                    <CollegePill logo="https://placehold.co/400" name="T School name" active={true} />
                                    <CollegePill logo="https://placehold.co/400" name="LSU School name" />
                                    <CollegePill logo="https://placehold.co/400" name="LSU School name" />
                                                                        <CollegePill logo="https://placehold.co/400" name="LSU School name" />

                                                                        <CollegePill logo="https://placehold.co/400" name="LSU School name" />
                                    <CollegePill logo="https://placehold.co/400" name="LSU School name" />

                                </div>
                            </FilterSection>

                            {/* Location */}
                            <FilterSection title="Location" defaultOpen={false}>
                                <select className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option>Colorado</option>
                                    <option>Texas</option>
                                </select>
                            </FilterSection>
                        </div>
                    </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default DummyHome;
