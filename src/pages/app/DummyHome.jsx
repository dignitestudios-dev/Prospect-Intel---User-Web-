import { useState } from "react";
import { FaPrint, FaDownload, FaSearch } from "react-icons/fa";
import ActiveTable from "../../components/ActiveTable";
import ArchivedTable from "../../components/ArchivedTable";
import { textOne, textThree, textTwo } from "../../assets/export";
import ActiveFilters from "../../components/home/ActiveFilters";
import ArchivedFilters from "../../components/home/ArchivedFilters";

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

const personalCharacters = [
  { label: "A", active: true },
  { label: "B", active: false },
  { label: "C", active: false },
  { label: "D", active: false },
  { label: "E", active: true },
  { label: "F", active: false },
];

const footballCharacters = [
  { label: "A", active: true },
  { label: "B", active: false },
  { label: "C", active: false },
  { label: "D", active: false },
  { label: "E", active: true },
  { label: "F", active: false },
];

const DummyHome = () => {
  const [isArchived, setIsArchived] = useState(false); // Toggle state for Active/Archived

  const toggleTab = () => setIsArchived((prevState) => !prevState);

  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans ">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        <div className="p-6 flex justify-between items-center">
          {/* Header Content */}
          <div className="flex items-center gap-4 ">
            <div className="relative ">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search for players"
                className="w-[380px] font-thin h-[50px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
            </div>
            <div>
              <p className="cursor-pointer text-[#0085CA] font-medium">
                Advanced Filters
              </p>
            </div>
          </div>

          {/* Right Side Header Buttons and Account */}
          <div className="flex items-center space-x-20 border-gray-200 pl-2 ">
            {/* LEFT SIDE: Print + PDF */}
            {!isArchived && (
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
            )}

            {/* RIGHT SIDE: Active / Archived Toggle */}
            <div className="flex items-center ">
              <div className="flex border border-white bg-[#EAEEF8] rounded-lg overflow-hidden shadow-sm p-1">
                <button
                  className={`px-10 py-2 text-black rounded-lg text-sm font-medium ${
                    !isArchived
                      ? "bg-[#EAEEF8] border-2 border-white"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={toggleTab}
                >
                  Active
                </button>
                <button
                  className={`px-6 py-2 text-gray-600 rounded-lg text-sm font-medium ${
                    isArchived
                      ? "bg-[#EAEEF8] border-2 border-white"
                      : "hover:bg-gray-50"
                  }`}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              100 Results
            </h3>

            {/* Active or Archived Table */}
            {isArchived ? (
              <ArchivedTable players={players} />
            ) : (
              <ActiveTable players={players} />
            )}
          </div>

          {/* Right Side: Filters Panel (Fixed Width) */}
          {/* <div className="w-[300px] p-6 pt-4 border-l-2 border-gray-200"> */}
          {/* Filters Section */}
          {isArchived ? (
            <ArchivedFilters
              positionPills={positionPills}
              gradYearPills={gradYearPills}
              textOne={textOne}
              textTwo={textTwo}
              textThree={textThree}
            />
          ) : (
            <ActiveFilters
              positionPills={positionPills}
              personalCharacters={personalCharacters}
              footballCharacters={footballCharacters}
              gradYearPills={gradYearPills}
              textOne={textOne}
              textTwo={textTwo}
              textThree={textThree}
            />
          )}

          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default DummyHome;
