import { Archive, Trash2 } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onArchive: () => void;
  onDelete: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onArchive,
  onDelete,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-[40px] left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-jila-400 flex items-center gap-[23px] px-[20px] py-[20px] rounded-[10px] shadow-lg">
        <div className="text-jila-300 text-lg font-normal">
          Selected: {selectedCount}
        </div>

        <div className="h-[27px] border-l border-jila-300" />

        <button
          onClick={onArchive}
          className="flex items-center gap-[17px] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Archive size={24} className="text-white-400" />
          <span className="text-white-400 font-bold text-lg">Archive</span>
        </button>

        <div className="h-[27px] border-l border-jila-300" />

        <button
          onClick={onDelete}
          className="flex items-center gap-[17px] hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Trash2 size={24} className="text-white-400" />
          <span className="text-white-400 font-bold text-lg">Delete</span>
        </button>
      </div>
    </div>
  );
}
