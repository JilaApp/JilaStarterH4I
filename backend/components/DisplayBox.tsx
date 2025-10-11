import React from "react";
import DisplayBoxTailIcon from "@/assets/display-box-tail.svg";
import Image from "next/image";

interface DisplayBoxProps {
  children: React.ReactNode;
}

export default function DisplayBox({ children }: DisplayBoxProps) {
  return (
    <div className="w-[593px] bg-white rounded-[16px] drop-shadow-[0_0px_80px_var(--shadow-jila-10)]">
      <div className="rounded-[16px] bg-white p-[75px] shadow-[0_-4px_80px_var(--shadow-jila-10)]">
        {children}
      </div>
      <Image
        className="absolute -mt-[80px] ml-[459px] z-[-1] drop-shadow-[0_4px_80px_var(--shadow-jila-10)] rounded-[6px]"
        src={DisplayBoxTailIcon.src}
        alt=""
        width={200}
        height={200}
      />
    </div>
  );
}
