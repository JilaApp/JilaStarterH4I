import { useState, useRef } from "react";
import FormInputWrapper from "./FormInputWrapper";
import { TextInput } from "./Input/TextInput";
import FormText from "@/components/FormTextWrapper";
import FileUploadWrapper from "./FileUploadWrapper";
import Dropdown from "./Dropdown";

export default function SocialServiceForm() {
  const [englishTitleError, setEnglishTitleError] = useState("");
  const [qanjobalTitleError, setQanjobalTitleError] = useState("");
  const [titleFile, setTitleFile] = useState<File>();
  const [dropdownIndex, setDropdownIndex] = useState<number>();
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [addressLineError, setAddressLineError] = useState("");
  const [cityTitleError, setCityTitleError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [englishDescriptionError, setEnglishDescriptionError] = useState("");
  const [qanjobalDescriptionError, setQanjobalDescriptionError] = useState("");
  const [descriptionFile, setDescriptionFile] = useState<File>();

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };

  return (
    <div className="bg-white rounded-[24px] overflow-auto max-h-[80%]">
      <div className="flex flex-col pl-[35px] pt-[30px] pr-[35px] pb-[30px]">
        <div className="text-[24px] text-semibold">Add new social service</div>
        <div className="mt-[26] flex flex-row">
          <FormInputWrapper
            title="Resource title (English)"
            required
            state={englishTitleError ? "error" : "default"}
            errorString={englishTitleError}
          >
            <FormText required onErrorChange={setEnglishTitleError}>
              <TextInput id="english-text-input" />
            </FormText>
          </FormInputWrapper>

          <FormInputWrapper
            title="Resource title (Q’anjob’al)"
            required
            state={qanjobalTitleError ? "error" : "default"}
            errorString={qanjobalTitleError}
          >
            <FormText required onErrorChange={setQanjobalTitleError}>
              <TextInput id="qajobal-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>

        {/*add the text under upload file*/}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 30MB"
          >
            <FileUploadWrapper
              onUpload={(file: File) => {
                setTitleFile(file);
              }}
              onDelete={() => {
                setTitleFile(undefined);
              }}
            />
          </FormInputWrapper>
        </div>

        <div className="mt-[26px] w-[450px]">
          <FormInputWrapper required title="Topic">
            <Dropdown
              options={[
                "Transport",
                "Legal",
                "Medical",
                "Career",
                "Education",
                "Other",
              ]}
              currentIndex={dropdownIndex}
              onChange={onDropdownChange}
            />
          </FormInputWrapper>
        </div>

        {/*make this wider */}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Phone number"
            required
            state={phoneNumberError ? "error" : "default"}
            errorString={phoneNumberError}
          >
            <FormText required onErrorChange={setPhoneNumberError}>
              <TextInput id="phone-number-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>
        {/*make wider */}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Address line 1"
            state={addressLineError ? "error" : "default"}
            errorString={addressLineError}
          >
            <FormText onErrorChange={setAddressLineError}>
              <TextInput id="phone-number-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>

        <div className="mt-[26] flex flex-row">
          <FormInputWrapper
            title="City"
            state={cityTitleError ? "error" : "default"}
            errorString={cityTitleError}
          >
            <FormText onErrorChange={setCityTitleError}>
              <TextInput id="english-text-input" />
            </FormText>
          </FormInputWrapper>
          <FormInputWrapper title="State">
            <Dropdown
              options={[
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
              ]}
              currentIndex={dropdownIndex}
              onChange={onDropdownChange}
            />
          </FormInputWrapper>
        </div>

        {/*make wider */}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Link to external website"
            state={linkError ? "error" : "default"}
            errorString={linkError}
          >
            <FormText onErrorChange={setLinkError}>
              <TextInput id="english-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>

        {/*make wider and taller */}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Description (English)"
            state={englishDescriptionError ? "error" : "default"}
            errorString={englishDescriptionError}
          >
            <FormText onErrorChange={setEnglishDescriptionError}>
              <TextInput id="english-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>

        {/*make wider and taller */}
        <div className="mt-[26px]">
          <FormInputWrapper
            title="Description (Q'anjob'al)"
            state={qanjobalDescriptionError ? "error" : "default"}
            errorString={qanjobalDescriptionError}
          >
            <FormText onErrorChange={setQanjobalDescriptionError}>
              <TextInput id="english-text-input" />
            </FormText>
          </FormInputWrapper>
        </div>

        <div className="mt-[26px]">
          <FormInputWrapper
            title="Upload file"
            description="Maximum size: 30MB"
          >
            <FileUploadWrapper
              onUpload={(file: File) => {
                setDescriptionFile(file);
              }}
              onDelete={() => {
                setDescriptionFile(undefined);
              }}
            />
          </FormInputWrapper>
        </div>
      </div>
    </div>
  );
}
