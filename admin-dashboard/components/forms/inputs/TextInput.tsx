import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";

export function TextInput({
  placeholder = inputVariants.text.placeholder,
  ...props
}: CommonInputProps) {
  const { type } = inputVariants.text;
  return <BaseInput type={type} placeholder={placeholder} {...props} />;
}
