"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Notification from "@/components/shared/Notification";
import FormField from "@/components/forms/FormField";
import { TextInput, EmailInput, PasswordInput } from "@/components/ui/Input";
import Sidebar from "@/components/layout/Sidebar";
import Dropdown from "@/components/ui/Dropdown";
import RadioButtonGroup from "@/components/forms/RadioButtonGroup";
import { Video, MessageCircle } from "lucide-react";
import Tabs from "@/components/shared/Tabs";
import FilterBar from "@/components/shared/FilterBar";
import ParagraphInput from "@/components/forms/ParagraphInput";
import TopicTag from "@/components/shared/TopicTag";
import type { TopicVariant } from "@/lib/types";
import Header from "@/components/layout/Header";
import FileUpload from "@/components/forms/FileUpload";
import DeleteModal from "@/components/shared/DeleteModal";
import Table from "@/components/shared/Table";
import { ColumnDefinition, DataRow } from "@/lib/types";
import VideoEditModal from "@/components/videos/VideoEditModal";
import VideoUploadForm from "@/components/videos/VideoUploadForm";
import SocialServiceForm from "@/components/social-services/SocialServiceForm";
import Link from "@/components/shared/Link";
import { useForm, createField } from "@/hooks/useForm";
import { validateEmail, validatePassword } from "@/lib/validators";
import Pagination from "@/components/shared/Pagination";
import JobFilter from "@/components/jobs/JobFilter";
import SearchBar from "@/components/forms/SearchBar";
import { getFileUploadState } from "@/lib/fileUploadUtils";

interface ServiceData extends DataRow {
  id: number;
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
  const [currentTabIndex, setCurrentTabIndex] = useState(1);

  const [pageNum, setPageNum] = useState(3);

  const { fields, setFieldValue, setFieldError } = useForm({
    textInput: createField(""),
    emailInput: createField(""),
    passwordInput: createField(""),
    dropdownIndex: createField<number | undefined>(undefined),
    errorDropdownIndex: createField<number | undefined>(undefined),
    file: createField<File | undefined>(undefined),
    paragraphInput: createField(""),
  });

  const myOptions = [
    { name: "1" },
    { name: "2", disabled: true },
    { name: "6" },
    { name: "7" },
  ];
  const [selected, setSelected] = useState(["6", "7"]);

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
      id: 2,
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
        <Link
          href={String(value)}
          external
          onClick={(e) => e.stopPropagation()}
        >
          {new URL(String(value)).hostname}
        </Link>
      ),
    },
  ];

  const getDataItemById = (id: number) =>
    tableData.find((item) => item.id === id);

  const handleRowClick = (id: number) => {
    const item = getDataItemById(id);
    console.log("Row Clicked:", item);
  };

  const handleEdit = (id: number) => {
    const item = getDataItemById(id);
    console.log("Editing:", item);
  };

  const handleDelete = (id: number) => {
    const item = getDataItemById(id);
    console.log("Deleting:", item);
  };

  const [selectedOptions, setSelectedOptions] = useState([
    "one",
    "two",
    "three",
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (id: number) => {
    setIsEditModalOpen(true);
  };

  const handleViewClick = (id: number) => {
    setIsViewModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    console.log("Delete confirmed for", idToDelete);
    setIdToDelete(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const value = "";

  return (
    <>
      <JobFilter onClose={() => {}} onApply={() => {}} />
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
      <Pagination
        numOptions={13}
        selectedOption={pageNum}
        onChange={setPageNum}
      />

      <div className="flex gap-2.5">
        <Button text="Delete" onClick={() => handleDeleteClick(67)} />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
        />

        <Button text="Edit Video" onClick={() => handleEditClick(68)}></Button>

        <VideoEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          videoData={null}
        />

        <Button text="View Video" onClick={() => handleViewClick(69)}></Button>

        <VideoEditModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          isEditing={false}
        />
      </div>

      <RadioButtonGroup
        options={myOptions}
        selectedOptions={selected}
        setSelectedOptions={setSelected}
      />
      <p className="mt-4">Selected: {selected.join(", ")}</p>
      <div className="flex flex-col gap-3 px-5">
        <Notification
          message="We've resent the link to your email!"
          onClose={() => {}}
        />
        <FilterBar
          options={["one", "two", "three"]}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <div className="flex flex-col gap-y-[20px] pl-[20px] pr-[20px] pt-[20px] pb-[20px]">
          <FormField
            title="Text Input"
            required
            state={fields.textInput.state}
            errorString={fields.textInput.error}
            value={fields.textInput.value}
            onChange={(val) => setFieldValue("textInput", val)}
          >
            {(props) => <TextInput {...props} id="text-input" />}
          </FormField>

          <FormField
            title="Email Input"
            required
            state={fields.emailInput.state}
            errorString={fields.emailInput.error}
            value={fields.emailInput.value}
            onChange={(val) => setFieldValue("emailInput", val)}
          >
            {(props) => <EmailInput {...props} id="email-input" />}
          </FormField>

          <FormField
            title="Password Input"
            required
            state={fields.passwordInput.state}
            errorString={fields.passwordInput.error}
            value={fields.passwordInput.value}
            onChange={(val) => setFieldValue("passwordInput", val)}
          >
            {(props) => <PasswordInput {...props} id="password-input" />}
          </FormField>
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
        <FormField
          required
          title="Title"
          description="Maximum size: 67MB"
          state={fields.dropdownIndex.state}
          errorString={fields.dropdownIndex.error}
          value={fields.dropdownIndex.value}
          onChange={(val) => setFieldValue("dropdownIndex", val)}
        >
          {(props) => (
            <Dropdown
              value={props.value}
              onChange={props.onChange}
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
            />
          )}
        </FormField>

        <div className="flex flex-col p-5 bg-[#F2F2F2]">
          <FormField
            required
            title="Title"
            description="Maximum size: 67MB"
            state={fields.dropdownIndex.state}
            errorString={fields.dropdownIndex.error}
            value={fields.dropdownIndex.value}
            onChange={(val) => setFieldValue("dropdownIndex", val)}
          >
            {(props) => (
              <Dropdown
                value={props.value}
                onChange={props.onChange}
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
              />
            )}
          </FormField>

          <FormField
            required
            title="Title"
            state={fields.errorDropdownIndex.state}
            errorString={
              fields.errorDropdownIndex.error || "This is an error string!"
            }
            description="Maximum size: 67MB"
            value={fields.errorDropdownIndex.value}
            onChange={(val) => setFieldValue("errorDropdownIndex", val)}
          >
            {(props) => (
              <Dropdown
                value={props.value}
                onChange={props.onChange}
                options={["Part-time", "Full-time", "Internship"]}
              />
            )}
          </FormField>

          <FormField
            title="Upload file"
            description="Maximum size: 67MB"
            state="default"
            value={fields.file.value}
            onChange={(val) => setFieldValue("file", val)}
          >
            {(props) => (
              <FileUpload
                value={props.value}
                onChange={props.onChange}
                onDelete={() => setFieldValue("file", undefined)}
                state={getFileUploadState(fields.file.state, fields.file.value)}
                extendedText="Must be exactly 67MB!"
              />
            )}
          </FormField>

          <FormField
            title="Upload file with error"
            description="Maximum size: 67MB"
            state="error"
            errorString="File too large. Max size 67MB"
            value={fields.file.value}
            onChange={(val) => setFieldValue("file", val)}
          >
            {(props) => (
              <FileUpload
                value={props.value}
                onChange={props.onChange}
                onDelete={() => setFieldValue("file", undefined)}
                state="error"
                extendedText="Must be exactly 67MB!"
                errorText="File too large. Max size 67MB"
              />
            )}
          </FormField>
        </div>
        <FormField
          required
          title="Title"
          state={fields.errorDropdownIndex.state}
          errorString={
            fields.errorDropdownIndex.error || "This is an error string!"
          }
          description="Maximum size: 67MB"
          value={fields.errorDropdownIndex.value}
          onChange={(val) => setFieldValue("errorDropdownIndex", val)}
        >
          {(props) => (
            <Dropdown
              value={props.value}
              onChange={props.onChange}
              options={["Part-time", "Full-time", "Internship"]}
            />
          )}
        </FormField>
        <FormField
          title="Enter your password lil bro"
          state="error"
          errorString="u got it wrong haha"
          value={fields.passwordInput.value}
          onChange={(val) => setFieldValue("passwordInput", val)}
        >
          {(props) => (
            <PasswordInput
              {...props}
              placeholder="Enter Password"
              id="password-input"
            />
          )}
        </FormField>

        <FormField
          title="Description"
          value={fields.paragraphInput.value}
          onChange={(val) => setFieldValue("paragraphInput", val)}
        >
          {(props) => <ParagraphInput {...props} />}
        </FormField>
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
