/* eslint-disable react/prop-types */
// components/filters/ActiveFilters.jsx
import { FaFilter } from "react-icons/fa";
import FilterSection from "./FilterSection";
import { PositionPill } from "./PositionPill";
import { GradingScalePill } from "./GradingScalePill";
import GradYearPill from "./GradYearPill";
import { CollegePill } from "./CollegePill";

export default function ActiveFilters({
  positionPills,
  personalCharacters,
  footballCharacters,
  gradYearPills,
  textOne,
  textTwo,
  textThree,
}) {
  return (
    <div className="w-[300px] p-6 pt-4 border-l-2 border-gray-200 mb-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
        <div className="flex items-center">
          <FaFilter className="text-base text-gray-800 mr-2" />
          <h3 className="text-base font-bold text-gray-800">Filters</h3>
        </div>
        <button className="text-md text-black bg-white p-1.5 px-4 rounded-lg font-extralight hover:text-blue-700">
          Clear All
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Position */}
        <FilterSection title="Position">
          <div className="grid grid-cols-3 gap-2">
            {positionPills.map((p, i) => (
              <PositionPill key={i} label={p.label} active={p.active} />
            ))}
          </div>
        </FilterSection>

        {/* Personal Character */}
        <FilterSection title="Personal Character" defaultOpen={false}>
          <div className="grid grid-cols-7 gap-7">
            {personalCharacters.map(
              (y, i) =>
                (y.active || i < 6) && (
                  <GradingScalePill key={i} label={y.label} active={y.active} />
                )
            )}
          </div>
        </FilterSection>

        {/* Football Character */}
        <FilterSection title="Football Character" defaultOpen={false}>
          <div className="grid grid-cols-7 gap-7">
            {footballCharacters.map(
              (y, i) =>
                (y.active || i < 6) && (
                  <GradingScalePill key={i} label={y.label} active={y.active} />
                )
            )}
          </div>
        </FilterSection>

        {/* Grad Year */}
        <FilterSection title="Grad Year" defaultOpen={false}>
          <div className="grid grid-cols-3 gap-2">
            {gradYearPills.map(
              (y, i) =>
                (y.active || i < 3) && (
                  <GradYearPill key={i} label={y.label} active={y.active} />
                )
            )}
          </div>
        </FilterSection>

        {/* Committed College */}
        <FilterSection title="Committed College">
          <div className="grid grid-cols-2 gap-2">
            <CollegePill logo={textThree} name="T School name" active />
            <CollegePill logo={textTwo} name="LSU School name" />
            <CollegePill logo={textOne} name="LSU School name" />
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location" defaultOpen={false}>
          <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
            <option>Colorado</option>
            <option>Texas</option>
          </select>
        </FilterSection>
      </div>
    </div>
  );
}
