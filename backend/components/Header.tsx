import { Bell } from "lucide-react";
import HeaderDropdown from "./HeaderDropdown";

interface InputProps {
  title: string;
  name: string;
  organization: string;
}

export default function Header({ title, name, organization }: InputProps) {
  return (
    <div className="flex text-type-400 flex-row h-[80px] items-center mr-[24px] justify-between">
      <div className="font-semibold mt-15 text-[24px] ml-10">{title}</div>

      <div className="ml-180 mt-15 flex flex-row">
        <div className="bg-white-400 hover:bg-[#F8F8F8] h-[72px] w-[64px] mr-[40px] pt-[24px] pl-[20px] rounded-[10px]">
          <Bell />
        </div>

        <div>
          <HeaderDropdown name={name} organization={organization} />
        </div>
      </div>
    </div>
  );
}
