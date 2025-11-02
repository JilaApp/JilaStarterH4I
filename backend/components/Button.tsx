import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
  ...buttonProps
}: ButtonProps &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "bg-jila-400 text-white-400 text-base p-3 w-60 h-12 rounded-lg hover:bg-type-400 cursor-pointer ease-in-out",
        defaultClassName,
        hoverClassName,
      )}
      {...buttonProps}
    >
      <div className="flex justify-center items-center gap-3 w-full">
        {text}
        {icon}
      </div>
    </button>
  );
}
