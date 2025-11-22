import React, { useState, useRef, useEffect } from "react";

const SortDropdown = ({ onSortChange, options = ["Popular", "Newest", "Lowest Price", "Highest Price"] }) => {
  const [selected, setSelected] = useState(options[0]);
  const textRef = useRef(null);
  const selectRef = useRef(null);

  // Adjust width dynamically based on text
  useEffect(() => {
    if (textRef.current && selectRef.current) {
      selectRef.current.style.width = `${textRef.current.offsetWidth + 4}px`;
    }
  }, [selected]);

  // Handle change & Enter key
  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (onSortChange) onSortChange(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSortChange) {
      onSortChange(selected);
    }
  };

  return (
    <div className="flex items-center border border-gray-400 rounded-lg px-0.5 py-1.5 text-sm text-gray-400 relative">
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-gray-600 mr-1 ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M6.75 12h10.5m-7.5 5.25h4.5"
        />
      </svg>

      {/* Label */}
      <span className="text-[13px] text-gray-400 mr-1">Sort by:</span>

      {/* Select dropdown */}
      <select
        ref={selectRef}
        value={selected}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="bg-transparent text-[13px] focus:outline-none text-[#7A1CA9] font-light cursor-pointer appearance-none border-none p-0 m-0 leading-tight"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Hidden span for dynamic width */}
      <span
        ref={textRef}
        className="absolute invisible whitespace-pre font-light text-sm"
      >
        {selected}
      </span>
    </div>
  );
};

export default SortDropdown;
