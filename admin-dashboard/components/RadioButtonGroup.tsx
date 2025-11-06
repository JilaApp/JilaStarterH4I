import { SquareCheck, Square } from "lucide-react";
import clsx from "clsx";

type ButtonOption = {
  name: string;
  disabled?: boolean;
};

interface RadioButtonGroupProps {
  options: ButtonOption[];
  selectedOptions: string[];
  setSelectedOptions: (newSelection: string[]) => void;
}

export default function RadioButtonGroup({
  options,
  selectedOptions,
  setSelectedOptions,
}: RadioButtonGroupProps) {
  const handleClick = (option: string) => {
    let newOptions = [];
    if (selectedOptions.includes(option)) {
      newOptions = selectedOptions.filter((o) => o !== option);
    } else {
      newOptions = [...selectedOptions, option];
    }
    setSelectedOptions(newOptions);
  };

  const renderIcon = (isSelected: boolean, isDisabled: boolean) => {
    if (isSelected && !isDisabled) {
      return (
        <SquareCheck size={30} className="stroke-white-400 fill-jila-400" />
      );
    }
    if (isDisabled) {
      return <Square className="text-gray-300" />;
    }
    return <Square className="text-jila-400" />;
  };

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const { name, disabled = false } = option;
        const isSelected = selectedOptions.includes(name);
        const isActive = isSelected && !disabled;

        return (
          <div
            key={name}
            className={clsx({
              "border-[3px] border-jila-300 rounded-[13px]": isActive,
              "m-[3px]": !isActive,
            })}
          >
            <div
              onClick={() => !disabled && handleClick(name)}
              className={clsx(
                "flex flex-row h-[60px] items-center w-full rounded-[10px] border select-none",
                {
                  "border-jila-400": isActive,
                  "border-gray-200": !isActive,
                  "bg-gray-200 cursor-not-allowed": disabled,
                  "cursor-pointer": !disabled,
                },
              )}
            >
              <div
                className={clsx({
                  "ml-[13px] mr-[5px]": isActive,
                  "ml-[16px] mr-[8px]": !isActive,
                })}
              >
                {renderIcon(isSelected, disabled)}
              </div>
              <div
                className={clsx("font-semibold text-lg", {
                  "text-black": isActive,
                  "text-gray-300": !isActive,
                })}
              >
                {name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
