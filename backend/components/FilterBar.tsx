import Button from "./Button";

export default function FilterBar({
  options,
  setSelectedOptions,
  selectedOptions = [],
}: {
  options: string[];
  selectedOptions?: string[];
  setSelectedOptions: (options: string[]) => void;
}) {
  const handleClick = (option: string) => {
    let newOptions = [];
    if (selectedOptions.includes(option)) {
      newOptions = selectedOptions.filter((o) => o !== option);
    } else {
      newOptions = [...selectedOptions, option];
    }
    setSelectedOptions(newOptions);
  };

  return (
    <div className="flex gap-x-3">
      {options.map((option) => {
        return (
          <div key={option}>
            <Button
              defaultClassName={
                "w-[100px] !p-0 !h-10 " +
                (selectedOptions.includes(option)
                  ? "bg-jila-400 hover:!bg-jila-400"
                  : "!bg-white-400 hover:!bg-white-400 !text-gray-300")
              }
              text={option}
              onClick={() => {
                handleClick(option);
              }}
            ></Button>
          </div>
        );
      })}
    </div>
  );
}
