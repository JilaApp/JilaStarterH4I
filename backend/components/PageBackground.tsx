import React from "react";
import JilaQuote from "@/assets/logos/jila_quote.png";

import Image from "next/image";

interface PageBackgroundProps {
  children: React.ReactNode;
}

function LogoPanel() {
  return (
    <div
      className={
        "flex justify-center items-center relative h-full w-2/5 rounded-br-[60px]"
      }
      style={{
        background: "linear-gradient(140deg, #E8965B -20%, #7E0601 80%)",
      }}
    >
      {/* logo */}
      <Image src={JilaQuote} alt="Logo" width={300} height={300} />
    </div>
  );
}

export default function PageBackground({ children }: PageBackgroundProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* background split */}
      <div className="absolute inset-0 flex bg-gradient-to-b from-[#A73D24] to-[#FFFBF3]">
        <LogoPanel />
        <div className="bg-[#FFFBF3] w-3/5 h-full flex justify-center items-center rounded-tl-[60px]">
          {children}
        </div>
      </div>
    </div>
  );
}
