import { useEffect, useRef, useState } from "react";
import { SquareCheck, Square } from "lucide-react";

type ButtonData = [boolean, string, boolean, Function, Function];
//[clickedOndefault, name, disabled, setClickedOnDefault, setDisabled]

interface Input {
  data: ButtonData;
}

export default function RadioButton({ data }: Input) {
  const [selected, setSelected] = useState(false);

  return (
    <div className="">
      <div
        className={`${selected ? "border-[3px] border-jila-300 rounded-[13px]" : "ml-[3px] mr-[3px] mt-[3px] mb-[3px]"}`}
      >
        <button
          onClick={() => setSelected(!selected)}
          className={`flex flex-row h-[60px] items-center w-full rounded-[10px] border-[1px] ${selected ? "border-jila-400" : "border-gray-200"}`}
        >
          {" "}
          <div
            className={`${selected ? "ml-[13px] mr-[5px]" : "ml-[16px] mr-[8px]"}`}
          >
            {selected ? (
              <SquareCheck
                size={30}
                stroke="var(--color-white-400)"
                fill="var(--color-jila-400)"
              />
            ) : (
              <Square color="var(--color-jila-400)" />
            )}
          </div>
<div className={`font-semibold text-[18px] ${selected ? "text-black" : "text-gray-300"}`}>{name}</div>        </button>
      </div>
    </div>
  );
}
