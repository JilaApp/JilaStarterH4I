import { useState } from "react";
import mailIcon from "../assets/mail.svg";
import lockIcon from "../assets/lock-keyhole.svg";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";
import mailDarkIcon from "../assets/mail-dark.svg";
import lockDarkIcon from "../assets/lock-dark.svg"
import eyeDarkIcon from "../assets/eye-dark.svg"
import eyeOffDarkIcon from "../assets/eye-off-dark.svg"

interface InputProps {
  type?: "email" | "password";
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  icon?: "mail" | "lock";
  showPasswordToggle?: boolean;
}

export default function Input({
  type = "email",
  disabled = false,
  value = "Enter Email",
  onChange, 
  icon = "mail", 
  showPasswordToggle = true
} : InputProps) {
  const [input, setInput] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value; 
    setInput(newInput);
    onChange?.(newInput);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = () => {
    setIsFocused(false);
  }

  const getIconSrc = () => {
    if (icon == "mail" && isFocused) {
      return mailDarkIcon.src;
    } else if (icon == "lock" && isFocused) {
      return lockDarkIcon.src
    } else if (icon == "mail" && !isFocused) {
      return mailIcon.src;
    } else if (icon == "lock") {
      return lockIcon.src;
    }
  }
    let inputType; 
    if (type === "password" && !showPassword) {
      inputType = "password";
    } else {
      inputType = "text";
    }


  const getContainerClasses = () => {
    if (disabled) {
      return "flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px] border-gray-300 bg-gray-200 text-gray-300";
    } else if (isFocused) {
      return "flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px] border-jila-400 bg-white text-gray-300";
    } else { 
      return "flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px] border-gray-300 bg-white text-gray-300";
    }
  }

  const getInputClasses = () => {
    if (disabled) {
      return "link-text text-gray-300 w-[346px]";
    } else if (isFocused) {
      return "link-text text-type-400 w-[346px]";
    } else {
      return "link-text text-gray-300 w-[346px]";
    }
  }

  return (
    <label className={getContainerClasses()}>
      <img className="pr-[8px]" src={getIconSrc()}></img>
      <input
        className={getInputClasses()}
        type={inputType}
        name="userinput"
        value={input}
        onChange = {handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled} />
      
      {(() => {
        if (showPasswordToggle && type === "password") {
          return (
          <img
            className="pl-[12px] cursor-pointer"
            src= {(() => {
        if (showPassword && isFocused) {
          return eyeDarkIcon.src;
        } else if (!showPassword && isFocused) {
          return eyeOffDarkIcon.src;
        } else if (!showPassword && !isFocused) {
          return eyeOffIcon.src;
        } else {
          return eyeIcon.src;
        }
      })()}
            onClick = {togglePasswordVisibility}
          ></img>
        );  
        }
      })()}
    </label>
  );
}
