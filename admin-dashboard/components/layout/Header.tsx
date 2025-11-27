import { Bell } from "lucide-react";
import HeaderDropdown from "./HeaderDropdown";

interface InputProps {
  title: string;
  name: string;
  organization: string;
  onSignOut: () => void;
}

export default function Header({
  title,
  name,
  organization,
  onSignOut,
}: InputProps) {
  return (
    <div className="flex text-type-400 flex-row h-[80px] items-center justify-between">
      <div className="font-semibold text-2xl whitespace-nowrap">{title}</div>

      <div className="flex flex-row items-center gap-10">
        <div className="bg-white-400 hover:bg-[#F8F8F8] h-[72px] w-[64px] flex items-center justify-center rounded-[10px] cursor-pointer">
          <Bell />
        </div>

        <HeaderDropdown
          name={name}
          organization={organization}
          onSignOut={onSignOut}
        />
      </div>
    </div>
  );
}
