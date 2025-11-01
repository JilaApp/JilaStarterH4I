import { ReactNode, FocusEvent, ChangeEvent } from "react";
import { FormInputState } from "../FormInputWrapper";

export interface CommonInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  state?: FormInputState;
  value?: string;
  className?: string;
}

export interface BaseInputProps extends CommonInputProps {
  type?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}
