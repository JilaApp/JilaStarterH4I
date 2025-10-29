import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";

export function EmailInput({
  placeholder = inputVariants.email.placeholder,
  ...props
}: CommonInputProps) {
  const { type, icon: Icon } = inputVariants.email;
  return (
    <BaseInput
      type={type}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      {...props}
    />
  );
}
