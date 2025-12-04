import Image from "next/image";
import TempJilaLogo from "@/assets/jila-white.svg";
import {
  LayoutDashboard,
  Settings,
  Send,
  BarChart3,
  Upload,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import { logger } from "@/lib/logger";
import { useUser } from "@clerk/nextjs";

interface SidebarProps {
  activeButton: string;
  setActiveButton: (id: string) => void;
}

// Define all possible sidebar buttons
const jilaAdminButtons = [
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "invite", label: "Invite", icon: Send },
];

const communityOrgAdminButtons = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "jobs", label: "Job postings", icon: Briefcase },
  { id: "job-requests", label: "Job requests", icon: ClipboardList },
];

export default function Sidebar({
  activeButton,
  setActiveButton,
}: SidebarProps) {
  const { user } = useUser();
  const userType = user?.publicMetadata?.userType;

  // Determine which buttons to show based on user type
  const buttons =
    userType === "JilaAdmin" ? jilaAdminButtons : communityOrgAdminButtons;

  const dummyButtonClick = () => {
    logger.info("[dummyButtonClick] Settings button clicked", undefined);
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-cream-300 z-0"></div>
      <div className="h-screen w-[196px] bg-[linear-gradient(348deg,_#7E0601_51.81%,_#E8965B_130.16%)] rounded-br-[60px] relative z-10">
        <Image
          className="w-[150px] h-[90px] absolute left-[16px] top-[22px]"
          src={TempJilaLogo}
          alt="logo"
        />

        <div className="flex flex-col gap-[22px] font-semibold relative top-[137px] ml-[6px]">
          {buttons.map(({ id, label, icon: Icon }) => {
            const clicked = activeButton === id;
            return (
              <div
                key={id}
                className={
                  "relative pt-[1.5px] pb-[1.5px] rounded-[10px] pl-[1.25px]"
                }
              >
                {clicked && (
                  <div>
                    <div className="absolute left-[-6px] top-0 w-[6px] h-[45px] mt-[1px] mr-[3px] bg-[#7E0601] rounded-r-[10px] z-10"></div>

                    <div className="absolute inset-0 rounded-[10px] ml-[3px] bg-[linear-gradient(90deg,#FFBEBE_0%,rgba(228,225,225,0.20)_100%)] w-[181px] pointer-events-none z-20"></div>
                  </div>
                )}

                <button
                  onClick={() => setActiveButton(id)}
                  className={`relative flex flex-row items-center gap-[16px] h-[44px] ml-[3px] w-[178px] pl-[16px] z-30 cursor-pointer ${
                    clicked
                      ? "text-type-400 bg-[linear-gradient(90deg,#D4928F_0%,rgba(224,140,150,0.30)_100%)] rounded-[10px]"
                      : "text-white-400 w-[178px] rounded-[10px]"
                  }`}
                >
                  <Icon
                    className={clicked ? "text-type-400" : "text-white-400"}
                  />
                  {label}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => dummyButtonClick()}
          className="flex font-semibold flex-row gap-[16px] left-[24px] absolute bottom-[24px] text-white-400 cursor-pointer"
        >
          <Settings className="text-white-400" /> Settings
        </button>
      </div>
    </div>
  );
}
