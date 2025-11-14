import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";

export function UsernameInput({
  placeholder = inputVariants.username.placeholder,
  ...props
}: CommonInputProps) {
  const { type, icon: Icon } = inputVariants.username;
  return (
    <BaseInput
      type={type}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      {...props}
    />
  );
}
