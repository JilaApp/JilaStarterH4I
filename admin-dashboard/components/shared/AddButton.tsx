import { ReactNode } from "react";

interface IconButtonProps {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  className?: string;
}

export default function IconButton({
  onClick,
  label,
  icon,
  className = "",
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[10px] bg-jila-400 text-white px-[10px] pr-[15px] py-[10px] h-[46px] rounded-[10px] hover:bg-type-400 cursor-pointer font-bold text-lg transition-colors ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
