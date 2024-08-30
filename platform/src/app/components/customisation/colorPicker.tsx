"use client";
import { useState } from "react";

const colors = [
  "#6466e9",
  "#ee5a92",
  "#c78af9",
  "#42cec2",
  "#f0a631",
  "#808080",
  "#ff99aa",
  "#d77a8b",
  "#93a8dc",
  "#d6d89b",
  "#f282b3",
  "#f28239",
];

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="flex space-x-1">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => setSelectedColor(color)}
          style={{ backgroundColor: color }}
          className={`relative h-10 w-10 rounded-md transition duration-300 ease-in-out`}
        >
          <span
            className={`absolute inset-0  flex h-full w-full items-center justify-center transition-opacity duration-300 ease-in-out ${
              selectedColor === color ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              className={`h-4 w-4  ${selectedColor === "#FFFFFF" ? "text-zinc-900" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
