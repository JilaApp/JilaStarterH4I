"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import FormInputWrapper from "@/components/FormInputWrapper";
import FormText, {
  validateEmail,
  validatePassword,
} from "@/components/FormTextWrapper";
import { TextInput, EmailInput, PasswordInput } from "@/components/Input";
import Sidebar from "@/components/Sidebar";
import Dropdown from "@/components/Dropdown";
import RadioButtonGroup from "@/components/RadioButtonGroup";
import { Video, MessageCircle } from "lucide-react";
import Tabs from "@/components/Tabs";
import FilterBar from "@/components/FilterBar";
import ParagraphInput from "@/components/ParagraphInput";
import TopicTag, { TopicVariant } from "@/components/TopicTag";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import FileUploadWrapper from "@/components/FileUploadWrapper";
import DeleteModal from "@/components/DeleteModal";
import Table, { ColumnDefinition, DataRow } from "@/components/Table";
import VideoUploadForm from "@/components/VideoUploadForm";
import SocialServiceForm from "@/components/SocialServiceForm";

interface ServiceData extends DataRow {
  id: number | string;
  title: string;
  topic: string;
  phoneNumber: string;
  link: string;
}

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

  const [textError, setTextError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const myOptions = [
    { name: "1" },
    { name: "2", disabled: true },
    { name: "6" },
    { name: "7" },
  ];
  const [selected, setSelected] = useState(["6", "7"]);

  const [file, setFile] = useState<File>();

  const uploadedFile = {
    fileName: "sixty-seven.zip",
    fileSizeMB: 67,
  };

  const tableData: ServiceData[] = [
    {
      id: 1,
      title: "C-U at Home",
      topic: "Food",
      phoneNumber: "217-403-6150",
      link: "https://leetcode.com/",
    },
    {
      id: "mtd-bus-system-2",
      title: "MTD Bus System",
      topic: "Transport",
      phoneNumber: "217-403-6150",
      link: "https://www.buzzfeed.com/",
    },
    {
      id: 3,
      title: "Carle Hospital",
      topic: "Medical",
      phoneNumber: "217-403-6150",
      link: "https://carle.org/",
    },
  ];

  const columns: ColumnDefinition<ServiceData>[] = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Topic",
      accessorKey: "topic",
      cell: (value) => <TopicTag variant={value as TopicVariant} />,
    },
    {
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      header: "Link",
      accessorKey: "link",
      cell: (value) => (
        <a
          className="text-jila-400"
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {new URL(String(value)).hostname}
        </a>
      ),
    },
  ];

  const getDataItemById = (id: number | string) =>
    tableData.find((item) => item.id === id);

  const handleRowClick = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Row Clicked:", item);
  };

  const handleEdit = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Editing:", item);
  };

  const handleDelete = (id: number | string) => {
    const item = getDataItemById(id);
    console.log("Deleting:", item);
  };

  const [selectedOptions, setSelectedOptions] = useState([
    "one",
    "two",
    "three",
  ]);

  const [paragraphInputValue, setParagraphInputValue] = useState<string>("");

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };

  const onErrorDropdownChange = (index: number) => {
    setErrorDropdownIndex(index);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    console.log("Delete confirmed for", idToDelete);
    setIdToDelete(null);
  };

  const handleDeleteModalClose = () => {
    setIsModalOpen(false);
    setIdToDelete(null);
  };

  return (
    <>
      <div className="bg-[#FFFBF3] p-[24px]">
        <SocialServiceForm />
      </div>
      <div className="bg-[#FFFBF3] p-[24px]">
        <VideoUploadForm />
      </div>
      <div className="bg-[#FFFBF3]">
        <Header
          name="Sophia Kim"
          organization="Hack4Impact"
          title="Data Collection + Analytics"
          onSignOut={() => console.log("Sign out...")}
        />
      </div>

      <Button
        text="Delete"
        // Instead of 67 this would pull from the row id
        onClick={() => handleDeleteClick(67)}
      />

      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
      />

      <RadioButtonGroup
        options={myOptions}
        selectedOptions={selected}
        setSelectedOptions={setSelected}
      />
      <p className="mt-4">Selected: {selected.join(", ")}</p>
      <div className="flex flex-col gap-3 px-5">
        <Notification
          message="We’ve resent the link to your email!"
          onClose={() => {}}
        />
        <FilterBar
          options={["one", "two", "three"]}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div className="flex flex-col gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
          <FormInputWrapper
            title="Text Input"
            required
            state={textError ? "error" : "default"}
            errorString={textError}
          >
            <FormText required onErrorChange={setTextError}>
              <TextInput id="text-input" />
            </FormText>
          </FormInputWrapper>
          <FormInputWrapper
            title="Text Input"
            required
            state={textError ? "error" : "default"}
            errorString={textError}
          >
            <FormText required onErrorChange={setTextError}>
              <TextInput id="text-input" />
            </FormText>
          </FormInputWrapper>

          <FormInputWrapper
            title="Email Input"
            required
            state={emailError ? "error" : "default"}
            errorString={emailError}
          >
            <FormText
              required
              validate={validateEmail}
              onErrorChange={setEmailError}
            >
              <EmailInput id="email-input" />
            </FormText>
          </FormInputWrapper>
          <FormInputWrapper
            title="Email Input"
            required
            state={emailError ? "error" : "default"}
            errorString={emailError}
          >
            <FormText
              required
              validate={validateEmail}
              onErrorChange={setEmailError}
            >
              <EmailInput id="email-input" />
            </FormText>
          </FormInputWrapper>

          <FormInputWrapper
            title="Password Input"
            required
            state={passwordError ? "error" : "default"}
            errorString={passwordError}
          >
            <FormText
              required
              validate={validatePassword}
              onErrorChange={setPasswordError}
            >
              <PasswordInput id="password-input" />
            </FormText>
          </FormInputWrapper>
          <FormInputWrapper
            title="Password Input"
            required
            state={passwordError ? "error" : "default"}
            errorString={passwordError}
          >
            <FormText
              required
              validate={validatePassword}
              onErrorChange={setPasswordError}
            >
              <PasswordInput id="password-input" />
            </FormText>
          </FormInputWrapper>
        </div>
        <TopicTag variant="Career" />
        <TopicTag variant="Legal" />
        <TopicTag variant="Medical" />
        <TopicTag variant="Transport" />
        <TopicTag variant="Other" />
        <TopicTag variant="Shelters" />
        <TopicTag variant="Food" />
        <TopicTag variant="Emergencia" />
        <TopicTag variant="Transportation" />
        <FormInputWrapper
          required
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
            value={dropdownIndex}
            onChange={onDropdownChange}
          />
        </FormInputWrapper>

        <div className="flex flex-col p-5 bg-[#F2F2F2]">
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
              value={dropdownIndex}
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
              value={errorDropdownIndex}
              onChange={onErrorDropdownChange}
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

          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 67MB"
          >
            <FileUploadWrapper
              onChange={(file: File) => {
                setFile(file);
              }}
              onDelete={() => {
                setFile(undefined);
              }}
            />
          </FormInputWrapper>
        </div>
        <FormInputWrapper
          required
          title="Title"
          state="error"
          errorString="This is an error string!"
          description="Maximum size: 67MB"
        >
          <Dropdown
            options={["Part-time", "Full-time", "Internship"]}
            value={errorDropdownIndex}
            onChange={onErrorDropdownChange}
          />
        </FormInputWrapper>
        <FormInputWrapper
          title="Enter your password lil bro"
          state="error"
          errorString="u got it wrong haha"
        >
          <PasswordInput placeholder="Enter Password" id="password-input" />
        </FormInputWrapper>

        <FormInputWrapper title="Description">
          <ParagraphInput
            value={paragraphInputValue}
            onChange={setParagraphInputValue}
          ></ParagraphInput>
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
      <Table
        data={tableData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRowClick={handleRowClick}
      />

      <Tabs
        tabs={tabs}
        activeIndex={currentTabIndex}
        onTabChange={setCurrentTabIndex}
      />
    </>
  );
}
