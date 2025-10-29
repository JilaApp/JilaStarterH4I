"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import FormInputWrapper from "@/components/FormInputWrapper";
import { TextInput, EmailInput, PasswordInput } from "@/components/Input";
import Input from "@/components/Input";
import Sidebar from "@/components/Sidebar";
import Dropdown from "@/components/Dropdown";
import { Video, MessageCircle } from "lucide-react";
import Tabs from "@/components/Tabs";

export default function DevPage() {
  const tabs = [
    {
      header: { logo: <Video />, text: "Video Resources" },
      content: <p>Hello</p>,
    },
    {
      header: { logo: <MessageCircle />, text: "Social Services" },
      content: <p>Bye</p>,
    },
  ];
  // This starts on index 1 (second tab)
  const [currentTabIndex, setCurrentTabIndex] = useState(1);

  const [dropdownIndex, setDropdownIndex] = useState<number>();
  const [errorDropdownIndex, setErrorDropdownIndex] = useState<number>();

  const [textValue, setTextValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [textError, setTextError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    if (textError) {
      setTextError(false);
      setErrorMessage("");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailValue(value);
    if (emailError) {
      setEmailError(false);
      setErrorMessage("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPasswordValue(value);
    if (passwordError) {
      setPasswordError(false);
      setErrorMessage("");
    }
  };

  const handleTextBlur = () => {
    setIsFocused(false);
    if (!textValue.trim()) {
      setTextError(true);
      setErrorMessage("This field is required");
    }
  };

  const handleEmailBlur = () => {
    setIsFocused(false);
    if (!emailValue.trim()) {
      setEmailError(true);
      setErrorMessage("This field is required");
    } else if (!isValidEmail(emailValue)) {
      setEmailError(true);
      setErrorMessage("Please enter a valid email address");
    }
  };

  const handlePasswordBlur = () => {
    setIsFocused(false);
    if (!passwordValue.trim()) {
      setPasswordError(true);
      setErrorMessage("This field is required");
    } else if (passwordValue.length < 6) {
      setPasswordError(true);
      setErrorMessage("Password must be at least 6 characters");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };

  const onErrorDropdownChange = (index: number) => {
    setErrorDropdownIndex(index);
  };
  return (
    <>
      <div className="flex flex-col gap-3 px-5">
        <Notification
          message="We've resent the link to your email!"
          onClose={() => {}}
        />
        <div className="flex flex-col gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
          <FormInputWrapper
            title="Text Input"
            required={true}
            state={textError ? "error" : "normal"}
            errorString={errorMessage}
          >
            <TextInput
              value={textValue}
              onChange={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleTextBlur}
              isFocused={isFocused}
              state={textError ? "error" : "normal"}
              id="text-input"
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Email Input"
            required={true}
            state={emailError ? "error" : "normal"}
            errorString={errorMessage}
          >
            <EmailInput
              value={emailValue}
              onChange={handleEmailChange}
              onFocus={handleFocus}
              onBlur={handleEmailBlur}
              isFocused={isFocused}
              state={emailError ? "error" : "normal"}
              id="email-input"
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Password Input"
            required={true}
            state={passwordError ? "error" : "normal"}
            errorString={errorMessage}
          >
            <PasswordInput
              value={passwordValue}
              onChange={handlePasswordChange}
              onFocus={handleFocus}
              onBlur={handlePasswordBlur}
              isFocused={isFocused}
              state={passwordError ? "error" : "normal"}
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
              id="password-input"
            />
          </FormInputWrapper>
        </div>

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
      </div>
      <div className="page-title-text">page-title-text</div>
      <div className="components-text">components-text</div>
      <div className="link-text">link-text</div>
      <div className="body1-desktop-semi-text">body1-desktop-semi-text</div>
      <div className="body1-desktop-bold-text">body1-desktop-bold-text</div>
      <div className="bg-cream-300">bg-cream-300</div>
      <div className="bg-jila-400">
        <div className="text-white">bg-jila-400</div>
      </div>
      <div className="bg-jila-300">bg-jila-300</div>
      <div className="bg-orange-400">bg-orange-400</div>
      <div className="bg-orange-300">bg-orange-300</div>
      <div className="bg-yellow-400">bg-yellow-400</div>
      <div className="bg-cream-300">bg-cream-300</div>
      <div className="bg-green-400">bg-green-400</div>
      <div className="bg-teal-400">bg-teal-400</div>
      <div className="bg-teal-300">bg-teal-300</div>
      <div className="bg-error-400">bg-error-400</div>
      <div className="bg-error-300">bg-error-300</div>
      <div className="bg-error-200">bg-error-200</div>
      <div className="bg-type-400">
        <div className="text-white">bg-type-400</div>
      </div>
      <div className="bg-white-400">bg-white-400</div>
      <div className="bg-gray-400">bg-gray-400</div>
      <div className="bg-gray-300">bg-gray-300</div>
      <div className="bg-gray-200">bg-gray-200</div>
      <Button text="Sign In" onClick={() => console.log("Hello!")} />

      <Tabs
        tabs={tabs}
        activeIndex={currentTabIndex}
        onTabChange={setCurrentTabIndex}
      />
    </>
  );
}
