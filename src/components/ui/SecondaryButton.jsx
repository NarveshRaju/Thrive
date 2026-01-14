// src/components/ui/SecondaryButton.jsx
import React from "react";

const SecondaryButton = ({ children, className = "", ...rest }) => {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full border border-[#1F242D] bg-[#0E1116] px-4 py-2 text-xs font-medium text-zinc-300 shadow-sm shadow-black/40 transition-all hover:border-zinc-500 hover:bg-[#141821] hover:-translate-y-0.5 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
