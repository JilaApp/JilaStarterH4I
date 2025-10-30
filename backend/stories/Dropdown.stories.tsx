import Dropdown from "@/components/Dropdown";
import FormInputWrapper from "@/components/FormInputWrapper";
import { useState } from "react";

const meta = {
  title: "Dropdown",
};

export default meta;

export const DropdownDefault = () => {
  const [dropdownIndex, setDropdownIndex] = useState<number>();
  const [errorDropdownIndex, setErrorDropdownIndex] = useState<number>();

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };

  const onErrorDropdownChange = (index: number) => {
    setErrorDropdownIndex(index);
  };
  return (
    <>
      <FormInputWrapper
        required={true}
        title="Title"
        description="Maximum size: 67MB"
      >
        <Dropdown
          options={[
            "Part-time",
            "Full-time",
            "Internship",
            "Part-time",
            "Full-time",
            "Internship",
            "Part-time",
            "Full-time",
            "Internship",
            "Part-time",
            "Full-time",
            "Internship",
          ]}
          currentIndex={dropdownIndex}
          onChange={onDropdownChange}
        />
      </FormInputWrapper>

      <FormInputWrapper
        required={true}
        title="Title"
        state="error"
        errorString="This is an error string!"
        description="Maximum size: 67MB"
      >
        <Dropdown
          options={["Part-time", "Full-time", "Internship"]}
          currentIndex={errorDropdownIndex}
          onChange={onErrorDropdownChange}
        />
      </FormInputWrapper>
    </>
  );
};
