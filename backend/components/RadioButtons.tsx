import { useEffect, useRef, useState } from "react";
import { SquareCheck, Square } from "lucide-react";

type ButtonData = {
  clickedOnDefault: boolean,
  name: string,
  disabled: boolean,
};
//[clickedOndefault, name, disabled]

interface Input {
  data: ButtonData[];
}

export default function RadioButton({ data }: Input) {
  const [selectedNames, setSelectedNames] = useState(() => {const defaultOn = data.filter((buttonData) => buttonData.clickedOnDefault === true); return defaultOn.map((buttonData) => buttonData.name)});

  return (
    <div className="flex flex-col gap-[10px]">
      {data.map((buttonData, index) => {
        const {
          clickedOnDefault,
          name,
          disabled,
         } = buttonData;

        const isSelected = selectedNames.includes(name);

        return (
          <div
            key={name}
            className={`${isSelected && !disabled ? "border-[3px] border-jila-300 rounded-[13px]" : "ml-[3px] mr-[3px] mt-[3px] mb-[3px]"}`}
          >
            <button
              onClick={() => {setSelectedNames(prevItems => {if(prevItems.includes(name)) {
                return prevItems.filter(item => item !== name);
              } else {
                return [...prevItems, name];
              }});}}
              disabled={disabled}
              className={`flex flex-row h-[60px] items-center w-full rounded-[10px] border-[1px] ${isSelected && !disabled ? "border-jila-400" : "border-gray-200"} disabled:bg-gray-200 `}
            >
              {" "}
              <div
                className={`${isSelected && !disabled ? "ml-[13px] mr-[5px]" : "ml-[16px] mr-[8px]"}`}
              >
                {isSelected && !disabled ? (
                  <SquareCheck
                    size={30}
                    stroke="var(--color-white-400)"
                    fill="var(--color-jila-400)"
                  />
                ) : (
                    disabled ?
                  <Square color="var(--color-gray-300)" /> : <Square color="var(--color-jila-400)" />
                )}
              </div>
              <div
                className={`font-semibold text-[18px] ${isSelected && !disabled ? "text-black" : "text-gray-300"}`}
              >
                {name}
              </div>{" "}
            </button>
          </div>
        );
      })}
    </div>
  );
}
