import { Search, Plus } from "lucide-react";
import IconButton from "./AddButton";

interface EmptyStateProps {
  heading?: string;
  subtext?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  isFiltered?: boolean;
}

export default function EmptyState({
  heading,
  subtext,
  showButton = false,
  buttonLabel = "",
  onButtonClick,
  isFiltered = false,
}: EmptyStateProps) {
  const displayHeading = isFiltered ? "No results" : heading;
  const displaySubtext = isFiltered
    ? "There are no items that match your search. Try using other filters"
    : subtext;
  const displayButton = isFiltered ? false : showButton;

  return (
    <div className="flex flex-col items-center justify-center gap-[22px]">
      <div className="w-6 h-6 flex items-center justify-center">
        <Search size={24} className="text-type-400" />
      </div>

      <div className="flex flex-col items-center gap-[10px] text-center">
        <h3 className="font-bold text-lg text-type-400 leading-[25px]">
          {displayHeading}
        </h3>
        <p className="font-normal text-lg text-gray-300 leading-[25px]">
          {displaySubtext}
        </p>
      </div>

      {displayButton && buttonLabel && onButtonClick && (
        <IconButton
          onClick={onButtonClick}
          label={buttonLabel}
          icon={<Plus size={24} />}
        />
      )}
    </div>
  );
}
