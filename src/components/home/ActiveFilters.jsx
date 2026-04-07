
import { FaFilter } from "react-icons/fa";
import FilterSection from "./FilterSection";
import { PositionPill } from "./PositionPill";
import { GradingScalePill } from "./GradingScalePill";
import GradYearPill from "./GradYearPill";
import { RiArrowDropDownLine } from "react-icons/ri";
import Pagination from "../global/Pagination";
import { locationData } from "../../pages/app/DummyHome";
import citiesData from "../../static/us";
import { Emptyimg } from "../../assets/export";


export default function ActiveFilters({
  positionPills,
  personalCharacters,
  footballCharacters,
  gradYearPills,
  selectedPosition,
  setSelectedPosition,
  setPersonalPiScore,
  setFootBallPiScore,
  schools,
  setIsOpen,
  isOpen,
  setSelectedSchool,
  selectedSchool,
  setSchoolPage,
  schoolLoading,
  handleClearAll,
  setSelectedGradeYear,
  selectedGradeYear,
  cities,
  selectedCity,
  selectedState,
  setSelectedState,
  setSelectedCity,
  personalPiScore,
  footballPiScore
}) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= schools?.pagination?.totalPages) {
      setSchoolPage(newPage);
    }
  };

  return (
    <div className="w-[300px] p-6 pt-4 border-l-2 border-gray-200 mb-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
        <div className="flex items-center">
          <FaFilter className="text-base text-gray-800 mr-2" />
          <h3 className="text-base font-bold text-gray-800">Filters</h3>
        </div>
        <button onClick={handleClearAll} className="text-md text-black bg-white p-1.5 px-4 rounded-lg font-extralight hover:text-blue-700">
          Clear All
        </button>
      </div>

      <div className="divide-y divide-gray-100">

        <FilterSection title="Position">
          <div className="grid grid-cols-3 gap-2">
            {positionPills?.map((p, i) => (
              <PositionPill
                key={i}
                label={p.label}
                onClick={() => setSelectedPosition(p.value)}
                active={selectedPosition === p.value}
              />
            ))}
          </div>
        </FilterSection>

        {/* Personal Character */}
        <FilterSection title="Personal Character" defaultOpen={false}>
          <div className="grid grid-cols-7 gap-7">
            {personalCharacters.map((y, i) => (
              <GradingScalePill
                key={i}
                label={y.label}
                onClick={() => setPersonalPiScore(y.label)}
                active={personalPiScore === y.label}
              />
            ))}
          </div>
        </FilterSection>

        {/* Football Character */}
        <FilterSection title="Football Character" defaultOpen={false}>
          <div className="grid grid-cols-7 gap-7">
            {footballCharacters.map((y, i) => (
              <GradingScalePill
                key={i}
                label={y.label}
                onClick={() => setFootBallPiScore(y.label)}
                active={footballPiScore === y.label}
              />
            ))}

          </div>
        </FilterSection>

        {/* Grad Year */}
        <FilterSection title="Grad Year" defaultOpen={false}>
          <div className="grid grid-cols-3 gap-2">
            {gradYearPills.map((y, i) => (
              <GradYearPill
                key={i}
                label={y.label}
                active={selectedGradeYear === y.label}
                onClick={() => setSelectedGradeYear(y.label)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Committed College */}
        <FilterSection title="Committed College">
          <div className="w-64 relative">

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
            >
              <span>
                {selectedSchool ? selectedSchool.name : "Select  Committed College"}
              </span>
              <span className="ml-2"><RiArrowDropDownLine /></span>
            </button>


            {isOpen && (
              <div className="absolute z-10 pb-4 pe-2 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {schoolLoading ? (
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : schools?.data.length === 0 ? (
                  <div className="text-[12px] text-center pt-4 text-gray-400 ">
                    Committed College Not Found
                  </div>
                ) : (
                  <>
                    {schools?.data?.map((school) => (
                      <div
                        key={school._id}
                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSchool({ id: school._id, name: school.name });
                          setIsOpen(false);
                        }}
                      >
                        <img
                          src={school.logo || Emptyimg}
                          alt={school.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">{school.name}</span>
                      </div>
                    ))}


                    {schools?.data?.length > 0 && (
                      <Pagination
                        pagination={schools?.pagination || { currentPage: 1, totalPages: 1 }}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        </FilterSection>


        <FilterSection title="Location" defaultOpen={false}>
          <div className="grid gap-2">
            {/* State Dropdown */}
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {Object.keys(citiesData).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* City Dropdown */}
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}

            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
