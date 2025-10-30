import FilterBar from "@/components/FilterBar";
import { useState } from "react";

const meta = {
  title: "Filter Bar",
  component: FilterBar,
};

export default meta;

export const Default = () => {
  const [selectedOptions, setSelectedOptions] = useState([
    "one",
    "two",
    "three",
  ]);

  return (
    <div className="flex flex-col gap-3 px-5">
      <FilterBar
        options={["one", "two", "three"]}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
    </div>
  );
};
