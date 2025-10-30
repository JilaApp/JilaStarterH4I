"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import Input from "@/components/Input";
import Sidebar from "@/components/Sidebar";
import Dropdown from "@/components/Dropdown";
import FormInputWrapper from "@/components/FormInputWrapper";
import FileUpload from "@/components/FileUpload";
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

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };

  const onErrorDropdownChange = (index: number) => {
    setErrorDropdownIndex(index);
  };

  const [file, setFile] = useState<File>();

  const uploadedFile = {
    fileName: "sixty-seven.zip",
    fileSizeMB: 67,
  };
  return (
    <>
      <div className="flex flex-col gap-3 px-5">
        <Notification
          message="We’ve resent the link to your email!"
          onClose={() => {}}
        />
        {/*form inputs!*/}
        <div className="flex flex-col g-2 bg-[#F2F2F2] rounded-[10px] p-[30px]">
          <div className="flex flex-col gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
            <Input
              type="email"
              id="email-input"
              placeholder="Enter Email"
              icon="mail"
              state="error"
            />

            <Input type="email" id="email-disabled-input" disabled />

            <Input
              type="password"
              placeholder="Enter Password"
              id="password-input"
              icon="lock"
              showPasswordToggle
            />

            <Input
              type="password"
              placeholder="Enter Password"
              id="password-disabled-input"
              icon="lock"
              disabled
            />
          </div>
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
          <FormInputWrapper
            title="Enter your password lil bro"
            state="error"
            errorString="u got it wrong haha"
          >
            <Input
              type="password"
              placeholder="Enter Password"
              id="password-input"
              icon="lock"
              showPasswordToggle
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 67MB"
            state="default"
          >
            <FileUpload
              onFileSelect={setFile}
              onDelete={() => {}}
              extendedText="Must be exactly 67MB!"
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 67MB"
            state="pending"
          >
            <FileUpload
              onDelete={() => {}}
              extendedText="Must be exactly 67MB!"
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 67MB"
            state="complete"
          >
            <FileUpload
              onDelete={() => {}}
              uploadedFile={uploadedFile}
              extendedText="Must be exactly 67MB!"
            />
          </FormInputWrapper>

          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 67MB"
            state="error"
          >
            <FileUpload
              onDelete={() => {}}
              uploadedFile={uploadedFile}
              extendedText="Must be exactly 67MB!"
              errorText="File too large. Max size 67MB"
            />
          </FormInputWrapper>
        </div>
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
