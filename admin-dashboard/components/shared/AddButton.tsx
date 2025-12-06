import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export default function AddButton({
  onClick,
  label,
  className = "",
}: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[10px] bg-jila-400 text-white px-[24px] py-[24px] h-[46px] rounded-[10px] hover:bg-type-400 cursor-pointer font-bold text-lg transition-colors ${className}`}
    >
      <Plus size={24} />
      {label}
    </button>
  );
}
