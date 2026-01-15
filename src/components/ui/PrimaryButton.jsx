// src/components/ui/PrimaryButton.jsx
import React from "react";

const colorMap = {
  amber:
    "bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 text-black",
  cyan: "bg-gradient-to-r from-teal-400 to-cyan-300 text-black",
  purple: "bg-gradient-to-r from-fuchsia-500 to-indigo-400 text-white",
  default: "bg-zinc-300 text-black",
};

const PrimaryButton = ({ children, variant = "amber", className = "", ...rest }) => {
  const colors = colorMap[variant] || colorMap.default;

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg shadow-black/60 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${colors} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
