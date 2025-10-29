import { Mail } from "lucide-react";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";

const inputVariants = {
  email: {
    type: "email",
    icon: Mail,
    placeholder: "Enter your email",
  },
};

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
