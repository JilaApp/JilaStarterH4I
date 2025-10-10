import React, { useState } from "react";
import DisplayBoxTailIcon from "@/assets/display-box-tail.svg";

interface DisplayBoxProps {
  children: React.ReactNode[];
}

export default function DisplayBox({ children }: DisplayBoxProps) {
  return (
    <div className="w-[593px] bg-white rounded-[16px] drop-shadow-[0_0px_80px_var(--shadow-jila-10)]">
      <div className="h-[152px] -mb-[82px] pt-[34px]">
        <div className="w-[158px] ml-[0px] components-text text-center">
          Sign in
        </div>
      </div>

      {/** red bar */}
      <div className="w-[70px] h-[6px] rounded-t-[6px] ml-[44px] mt-[12px] bg-jila-400" />

      <div className="rounded-[16px] bg-white p-[75px] shadow-[0_-4px_80px_var(--shadow-jila-10)]">
        {children}
      </div>
      <img
        className="w-[200px] absolute -mt-[80px] ml-[450px] z-[-1] drop-shadow-[0_4px_80px_var(--shadow-jila-10)] rounded-[6px]"
        src={DisplayBoxTailIcon.src}
      />
    </div>
  );
}
