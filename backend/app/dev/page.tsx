"use client";
import { useState } from "react";
import Notification from "@/components/Notification";
import Input from "@/components/Input";

export default function DevPage() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [basicTextValue, setBasicTextValue] = useState("");
  const [errorTextValue, setErrorTextValue] = useState("");
  const [disabledValue, setDisabledValue] = useState("");

  return (
    <div>
      <Notification
        message="We've resent the link to your email!"
        onClose={() => {}}
      />
      <div className="flex flex-col gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
        <Input
          type="email"
          id="email-input"
          title="Email Validation"
          placeholder="Enter email"
          icon="mail"
          value={emailValue}
          onChange={setEmailValue}
          required={true}
        />

        <Input
          type="password"
          placeholder="Enter password"
          id="password-input"
          icon="lock"
          showPasswordToggle
          required={true}
          value={passwordValue}
          onChange={setPasswordValue}
        />

        <Input
          type="password"
          placeholder="Enter password"
          id="password-disabled-input"
          icon="lock"
          disabled
          value={disabledValue}
          onChange={setDisabledValue}
        />

        <Input
          type="text"
          id="basic-text-input"
          title="Required Field"
          placeholder="Enter text"
          required={true}
          value={basicTextValue}
          onChange={setBasicTextValue}
        />
        
        <Input 
          type="text" 
          id="disabled_input" 
          placeholder="Enter text" 
          disabled 
          value=""
          onChange={() => {}}
        />
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
    </div>
  );
}