import React from "react";
import TempJilaLogo from "@/assets/logos/temp_jila.png";

import Image from "next/image";

interface PageBackgroundProps {
  children: React.ReactNode;
  orientation?: "left" | "right"; // which side is JILA red
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
      <Image src={TempJilaLogo} alt="Logo" width={600} height={600} />
    </div>
  );
}

export default function PageBackground({
  children,
  orientation = "left",
}: PageBackgroundProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* background split */}
      <div className="absolute inset-0 flex bg-gradient-to-b from-[#A73D24] to-[#FFFBF3]">
        {orientation === "left" ? (
          <>
            <LogoPanel />
            <div className="bg-white w-3/5 h-full flex justify-center items-center rounded-tl-[60px]">
              {children}
            </div>
          </>
        ) : (
          <>
            <div className="bg-white w-3/5 h-full" />
            <div className="bg-jila-400 w-2/5 h-full" />
          </>
        )}
      </div>
    </div>
  );
}
