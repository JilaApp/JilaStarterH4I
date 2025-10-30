import Input from "@/components/Input";
import { useState } from "react";

const meta = {
  title: "Input",
  component: Input,
};

export default meta;

export const EmailDefault = () => {
  return (
    <div className="flex flex-col gap-3 px-5">
      <Input
        type="email"
        id="email-input"
        placeholder="Enter Email"
        icon="mail"
        state="normal"
      />
    </div>
  );
};

export const EmailError = () => {
  return (
    <div className="flex flex-col gap-3 px-5">
      <Input
        type="email"
        id="email-input"
        placeholder="Enter Email"
        icon="mail"
        state="error"
      />
    </div>
  );
};

export const EmailDisabled = () => {
  return (
    <div className="flex flex-col gap-3 px-5">
      <Input type="email" id="email-disabled-input" disabled />
    </div>
  );
};

export const PasswordDefault = () => {
  return (
    <div className="flex flex-col gap-3 px-5">
      <Input
        type="password"
        placeholder="Enter Password"
        id="password-input"
        icon="lock"
        showPasswordToggle
      />
    </div>
  );
};

export const PasswordDisabled = () => {
  return (
    <div className="flex flex-col gap-3 px-5">
      <Input
        type="password"
        placeholder="Enter Password"
        id="password-disabled-input"
        icon="lock"
        disabled
      />
    </div>
  );
};
