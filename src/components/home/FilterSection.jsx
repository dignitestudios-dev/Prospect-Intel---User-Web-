/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-3">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="font-bold text-gray-800 text-md">{title}</p>
        {isOpen ? (
          <FaChevronUp className="text-gray-500 text-[10px]" />
        ) : (
          <FaChevronDown className="text-gray-500 text-[10px]" />
        )}
      </div>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default FilterSection;
