import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  defaultClassName?: string;
  hoverClassName?: string;
}

export default function Button({
  text,
  defaultClassName,
  hoverClassName,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={clsx(
        "bg-jila-400 text-white-400 text-base p-3 w-60 h-12 rounded-lg",
        "hover:bg-type-400 cursor-pointer ease-in-out",
        defaultClassName,
        hoverClassName,
      )}
    >
      {text}
    </button>
  );
}
