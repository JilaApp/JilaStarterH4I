import { useState } from "react";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";

interface HeaderDropdownProps {
  name: string;
  organization: string;
  onSignOut: () => void;
}

export default function HeaderDropdown({
  name,
  organization,
  onSignOut,
}: HeaderDropdownProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative w-fit max-w-[224px]">
      <button
        onClick={() => setClicked(!clicked)}
        className="flex flex-row bg-white-400 hover:bg-[#F8F8F8] w-full h-[72px] rounded-[10px]"
      >
        <div className="flex flex-col gap-[12px] pt-[2px] pb-[7px] text-left min-w-0">
          <div className="pl-[25px] font-semibold truncate">{name}</div>
          <div className="pl-[25px] truncate">{organization}</div>
        </div>

        <div className="pt-[25px] pl-[35px] pr-[25px]">
          {clicked ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {clicked && (
        <div className="absolute top-full left-0 w-full mt-[12px] z-10">
          <button
            onClick={onSignOut}
            className="flex items-center bg-white-400 hover:bg-[#F8F8F8] rounded-[10px] gap-2.5 h-[48px] w-full px-[10px]"
          >
            <div className="text-error-400">
              <LogOut />
            </div>
            <span className="text-error-400">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
