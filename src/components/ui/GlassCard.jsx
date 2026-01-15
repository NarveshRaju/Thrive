import React from "react";

const GlassCard = ({ className = "", children, ...rest }) => {
  return (
    <div className={`rounded-2xl bg-[#0E1116] border border-[#1F242D] shadow-lg ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default GlassCard;
