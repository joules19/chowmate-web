import React from "react";

export const Divider: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full flex items-center justify-center space-x-4 my-2">
    <div className="h-[1px] bg-dark-3 flex-1"></div>
    <span className="text-dark-1 text-sm font-medium">{text}</span>
    <div className="h-[1px] bg-dark-3 flex-1"></div>
  </div>
);
