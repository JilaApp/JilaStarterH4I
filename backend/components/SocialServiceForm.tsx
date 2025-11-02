import { useState } from "react";
import FormInputWrapper from "./FormInputWrapper";
import { TextInput } from "./Input/TextInput";
import FormText from "@/components/FormTextWrapper";
import FileUploadWrapper from "./FileUploadWrapper";
import Dropdown from "./Dropdown";
import ParagraphInput from "./ParagraphInput";
import Button from "./Button";
import Notification from "./Notification";
import { trpc } from "@/lib/trpc";
import { SocialServiceCategory } from "@prisma/client";

export default function SocialServiceForm() {
  const [englishTitle, setEnglishTitle] = useState<string>("");
  const [englishTitleState, setEnglishTitleState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [qanjobalTitle, setQanjobalTitle] = useState<string>("");
  const [qanjobalTitleState, setQanjobalTitleState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [titleFile, setTitleFile] = useState<File>();
  const [titleFileState, setTitleFileState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [topicIndex, setTopicIndex] = useState<number>();
  const topicOptions = [
    "Emergencia",
    "Shelters",
    "Food",
    "Transportation",
    "Other",
  ];
  const [topicState, setTopicState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberState, setPhoneNumberState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [addressLine, setAddressLine] = useState<string>("");
  const [addressLineState, setAddressLineState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [city, setCity] = useState<string>("");
  const [cityState, setCityState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [stateIndex, setStateIndex] = useState<number>();
  const stateOptions = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  const [stateDropdownState, setStateDropdownState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [link, setLink] = useState<string>("");
  const [linkState, setLinkState] = useState<
    "default" | "error" | "pending" | "complete"
  >("default");

  const [englishDescription, setEnglishDescription] = useState<string>("");
  const [qanjobalDescription, setQanjobalDescription] = useState<string>("");

  const [descriptionFile, setDescriptionFile] = useState<File>();

  const [notification, setNotification] = useState<string | null>(null);

  const addSocialServiceMutation =
    trpc.socialServices.addSocialService.useMutation();

  const submitForm = async () => {
    let hasError = false;

    if (!englishTitle) {
      setEnglishTitleState("error");
      hasError = true;
    }
    if (!qanjobalTitle) {
      setQanjobalTitleState("error");
      hasError = true;
    }
    if (!titleFile) {
      setTitleFileState("error");
      hasError = true;
    }
    if (topicIndex === undefined) {
      setTopicState("error");
      hasError = true;
    }
    if (!phoneNumber) {
      setPhoneNumberState("error");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await addSocialServiceMutation.mutateAsync({
        title: englishTitle,
        category: topicOptions[
          topicIndex!
        ].toUpperCase() as SocialServiceCategory,
        phone_number: phoneNumber,
        address: addressLine || undefined,
        description: englishDescription || undefined,
        url: link || undefined,
      });

      setNotification("Social service submitted successfully!");

      setEnglishTitle("");
      setQanjobalTitle("");
      setTitleFile(undefined);
      setTopicIndex(undefined);
      setPhoneNumber("");
      setAddressLine("");
      setCity("");
      setStateIndex(undefined);
      setLink("");
      setEnglishDescription("");
      setQanjobalDescription("");
      setDescriptionFile(undefined);
    } catch (err) {
      console.error(err);
      setNotification("Error submitting social service.");
    }
  };

  const getButtonText = () => {
    if (addSocialServiceMutation.isPending) return "Submitting...";
    return "Submit social service";
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-[24px] bg-white">
      <div className="h-[60px] font-[500] text-[24px]">
        Add new social service
      </div>

      <div className="flex flex-row gap-[18px]">
        <FormInputWrapper
          title="Resource title (English)"
          state={englishTitleState}
          setState={setEnglishTitleState}
          value={englishTitle}
          onChange={setEnglishTitle}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormInputWrapper>

        <FormInputWrapper
          title="Resource title (Q'anjob'al)"
          state={qanjobalTitleState}
          setState={setQanjobalTitleState}
          value={qanjobalTitle}
          onChange={setQanjobalTitle}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormInputWrapper>
      </div>

      <FormInputWrapper
        title="Title audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        state={titleFileState}
        setState={setTitleFileState}
        defaultClassName="max-w-[918px]"
        value={titleFile}
        onChange={setTitleFile}
        required
      >
        <FileUploadWrapper
          onDelete={() => {
            setTitleFile(undefined);
          }}
          extendedText="Upload an audio recording of the resource title in Q'anjob'al"
        />
      </FormInputWrapper>

      <FormInputWrapper
        title="Topic"
        state={topicState}
        setState={setTopicState}
        value={topicIndex}
        onChange={setTopicIndex}
        defaultClassName="max-w-[450px]"
        required
      >
        <Dropdown options={topicOptions} />
      </FormInputWrapper>

      <FormInputWrapper
        title="Phone number"
        state={phoneNumberState}
        setState={setPhoneNumberState}
        value={phoneNumber}
        onChange={setPhoneNumber}
        defaultClassName="max-w-[918px]"
        required
      >
        <TextInput />
      </FormInputWrapper>

      <FormInputWrapper
        title="Address line 1"
        state={addressLineState}
        setState={setAddressLineState}
        value={addressLine}
        onChange={setAddressLine}
        defaultClassName="max-w-[918px]"
      >
        <TextInput />
      </FormInputWrapper>

      <div className="flex flex-row gap-[18px]">
        <FormInputWrapper
          title="City"
          state={cityState}
          setState={setCityState}
          value={city}
          onChange={setCity}
          defaultClassName="max-w-[450px]"
        >
          <TextInput />
        </FormInputWrapper>

        <FormInputWrapper
          title="State"
          state={stateDropdownState}
          setState={setStateDropdownState}
          value={stateIndex}
          onChange={setStateIndex}
          defaultClassName="max-w-[450px]"
        >
          <Dropdown options={stateOptions} />
        </FormInputWrapper>
      </div>

      <FormInputWrapper
        title="Link to external website"
        state={linkState}
        setState={setLinkState}
        value={link}
        onChange={setLink}
        defaultClassName="max-w-[918px]"
      >
        <TextInput />
      </FormInputWrapper>

      <FormInputWrapper
        title="Description (English)"
        defaultClassName="max-w-[918px]"
        value={englishDescription}
        onChange={setEnglishDescription}
      >
        <ParagraphInput />
      </FormInputWrapper>

      <FormInputWrapper
        title="Description (Q'anjob'al)"
        defaultClassName="max-w-[918px]"
        value={qanjobalDescription}
        onChange={setQanjobalDescription}
      >
        <ParagraphInput />
      </FormInputWrapper>

      <FormInputWrapper
        title="Description audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        defaultClassName="max-w-[918px]"
        value={descriptionFile}
        onChange={setDescriptionFile}
      >
        <FileUploadWrapper
          onDelete={() => {
            setDescriptionFile(undefined);
          }}
          extendedText="Upload an audio recording of the description in Q'anjob'al"
        />
      </FormInputWrapper>

      <div className="flex justify-end">
        <Button
          text={getButtonText()}
          onClick={submitForm}
          disabled={addSocialServiceMutation.isPending}
          defaultClassName={
            addSocialServiceMutation.isPending
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        />
      </div>

      {notification && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]">
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
