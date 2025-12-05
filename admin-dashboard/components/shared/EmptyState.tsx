import { Search } from "lucide-react";
import AddButton from "./AddButton";

interface EmptyStateProps {
  heading: string;
  subtext: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function EmptyState({
  heading,
  subtext,
  showButton = false,
  buttonLabel = "",
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-[22px]">
      {/* Search icon */}
      <div className="w-6 h-6 flex items-center justify-center">
        <Search size={24} className="text-type-400" />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-[10px] text-center">
        <h3 className="font-bold text-lg text-type-400 leading-[25px]">
          {heading}
        </h3>
        <p className="font-normal text-lg text-gray-300 leading-[25px]">
          {subtext}
        </p>
      </div>

      {/* Optional button */}
      {showButton && buttonLabel && onButtonClick && (
        <AddButton onClick={onButtonClick} label={buttonLabel} />
      )}
    </div>
  );
}
