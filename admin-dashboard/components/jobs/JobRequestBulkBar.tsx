import { Check, X } from "lucide-react";

interface JobRequestBulkBarProps {
  selectedCount: number;
  onApprove: () => void;
  onDeny: () => void;
}

export default function JobRequestBulkBar({
  selectedCount,
  onApprove,
  onDeny,
}: JobRequestBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-jila-400 flex items-center gap-[23px] px-[20px] py-[20px] rounded-[5px] shadow-lg">
        <div className="text-jila-300 text-lg font-normal">
          Selected: {selectedCount}
        </div>

        <div className="h-[27px] border-l border-jila-300" />

        <button
          onClick={onApprove}
          className="flex items-center gap-[17px] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Check size={24} className="text-white-400" />
          <span className="text-white-400 font-bold text-lg">Approve</span>
        </button>

        <div className="h-[27px] border-l border-jila-300" />

        <button
          onClick={onDeny}
          className="flex items-center gap-[17px] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <X size={24} className="text-white-400" />
          <span className="text-white-400 font-bold text-lg">Deny</span>
        </button>
      </div>
    </div>
  );
}
