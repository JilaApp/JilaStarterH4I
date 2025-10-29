import { Type } from "lucide-react";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";

const inputVariants = {
  text: {
    type: "text",
    icon: Type,
    placeholder: "Enter text",
  },
};

export function TextInput({
  placeholder = inputVariants.text.placeholder,
  ...props
}: CommonInputProps) {
  const { type } = inputVariants.text;
  return <BaseInput type={type} placeholder={placeholder} {...props} />;
}
