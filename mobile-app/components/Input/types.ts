import { ReactNode } from "react";
import type { TextInputProps } from "react-native";

export type FormInputState = "default" | "error" | "pending" | "complete";

export interface CommonInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
  placeholder?: string;
  id?: string;
  state?: FormInputState;
  name?: string;
  value?: string;
  style?: TextInputProps["style"];
  icon?: ReactNode;
  rightElement?: ReactNode;
  inputProps?: Partial<TextInputProps>;
  className?: string;
}

export interface BaseInputProps extends CommonInputProps {
  type?: string;
  autoComplete?: TextInputProps["autoComplete"];
}
