import { ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon?: ReactNode;
  defaultClassName?: string;
  hoverClassName?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export default function Button({
  text,
  icon = null,
  defaultClassName,
  hoverClassName,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        `bg-jila-400 text-white-400 text-base p-3 w-60 h-12 rounded-lg ` +
        defaultClassName +
        ` hover:bg-type-400 cursor-pointer ease-in-out ` +
        hoverClassName
      }
    >
      <div className="flex justify-center items-center gap-3 w-full">
        {text}
        {icon}
      </div>
    </button>
  );
}
