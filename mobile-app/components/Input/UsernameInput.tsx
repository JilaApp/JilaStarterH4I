import { colors } from "@/colors";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";
import { sizes } from "@/constants/sizes";

export function UsernameInput({
  placeholder = inputVariants.username.placeholder,
  onChange,
  ...props
}: CommonInputProps) {
  const { type, icon: Icon } = inputVariants.username;
  return (
    <BaseInput
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      icon={<Icon size={sizes.icon.md} color={colors.gray[300]} />}
      {...props}
    />
  );
}
