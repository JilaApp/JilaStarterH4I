import { TextInput, EmailInput, PasswordInput } from "@/components/Input";
import FileUploadWrapper from "@/components/FileUploadWrapper";
import ParagraphInput from "@/components/ParagraphInput";
import FormInputWrapper from "@/components/FormInputWrapper";
import { useState } from "react";
import { FormInputState } from "@/components/FormInputWrapper";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Notification from "@/components/Notification";

export default function VideoUploadForm() {
  const [resourceTitleEnglish, setResourceTitleEnglish] = useState<string>("");
  const [resourceTitleEnglishState, setResourceTitleEnglishState] =
    useState<FormInputState>("default");

  const [resourceTitleQanjobal, setResourceTitleQanjobal] =
    useState<string>("");
  const [resourceTitleQanjobalState, setResourceTitleQanjobalState] =
    useState<FormInputState>("default");
  const [resourceTitleError, setResourceTitleError] = useState<string>("");

  const [audioFile, setAudioFile] = useState<File>();
  const [audioFileState, setAudioFileState] =
    useState<FormInputState>("default");

  const [topicDropdownIndex, setTopicDropdownIndex] = useState<number>();
  const topicDropdownOptions = [
    "Transport",
    "Legal",
    "Medical",
    "Career",
    "Education",
    "Other",
  ];
  const [topicDropdownState, setTopicDropdownState] =
    useState<FormInputState>("default");

  const [videoLink, setVideoLink] = useState<string>("");
  const [videoLinkState, setVideoLinkState] =
    useState<FormInputState>("default");

  const [descriptionEnglish, setDescriptionEnglish] = useState<string>("");
  const [descriptionQanjobl, setDescriptionQanjobl] = useState<string>("");

  const [notification, setNotification] = useState<string | null>(null);

  const submitForm = async () => {
    if (!resourceTitleEnglish) {
      setResourceTitleEnglishState("error");
    }
    if (!resourceTitleQanjobal) {
      setResourceTitleQanjobalState("error");
    }
    if (!audioFile) {
      setAudioFileState("error");
    }
    if (!videoLink) {
      setVideoLinkState("error");
    }
    if (
      !resourceTitleEnglish ||
      !resourceTitleQanjobal ||
      !audioFile ||
      !videoLink
    ) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      console.log("asdfasdf");
      const base64Audio = reader.result?.toString().split(",")[1]; // remove `data:audio/...;base64,` prefix

      const body = JSON.stringify({
        titleEnglish: resourceTitleEnglish,
        titleQanjobal: resourceTitleQanjobal,
        audioFile: base64Audio, // 👈 encoded string
        topic: topicDropdownOptions[topicDropdownIndex ?? 0].toUpperCase(),
        url: videoLink,
        descriptionEnglish,
        descriptionQanjobal: descriptionQanjobl,
      });

      console.log("submitting", body);

      try {
        const response = await fetch(
          "http://localhost:3000/api/trpc/videos.addVideo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          }
        );

        if (!response.ok) throw new Error("Upload failed");

        setNotification("Video submitted successfully!");
      } catch (err) {
        console.error(err);
        setNotification("Error submitting video.");
      }
    };

    reader.readAsDataURL(audioFile);
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-[24px] bg-white shadow-[0_4px_80px_0_rgba(109,15,0,0.10)]">
      <div className="h-[60px] font-[500] text-[24px]">Add new video</div>
      <div className="flex flex-row gap-[18px]">
        <FormInputWrapper
          title="Resource title (English)"
          state={resourceTitleEnglishState}
          setState={setResourceTitleEnglishState}
          value={resourceTitleEnglish}
          onChange={setResourceTitleEnglish}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormInputWrapper>

        <FormInputWrapper
          title="Resource title (Q’anjob’al)"
          state={resourceTitleQanjobalState}
          setState={setResourceTitleQanjobalState}
          value={resourceTitleQanjobal}
          onChange={setResourceTitleQanjobal}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormInputWrapper>
      </div>
      <FormInputWrapper
        title="Title audio file (Q’anjob’al)"
        description="Maximum size: 30MB"
        state={audioFileState}
        setState={setAudioFileState}
        defaultClassName="max-w-[918px]"
        value={audioFile}
        onChange={setAudioFile}
        required
      >
        <FileUploadWrapper
          onDelete={() => {
            setAudioFile(undefined);
          }}
          extendedText="Upload an audio recording of the resource title in Q’anjob’al"
        />
      </FormInputWrapper>
      <FormInputWrapper
        title="Topic"
        state={topicDropdownState}
        setState={setTopicDropdownState}
        value={topicDropdownIndex}
        onChange={setTopicDropdownIndex}
        required
      >
        <Dropdown options={topicDropdownOptions} />
      </FormInputWrapper>
      <FormInputWrapper
        title="Video link"
        state={videoLinkState}
        setState={setVideoLinkState}
        value={videoLink}
        onChange={setVideoLink}
        required
      >
        <TextInput onChange={setVideoLink} value={videoLink} />
      </FormInputWrapper>
      <FormInputWrapper
        title="Description (English)"
        defaultClassName="max-w-[918px]"
        value={descriptionEnglish}
        onChange={setDescriptionEnglish}
      >
        <ParagraphInput />
      </FormInputWrapper>
      <FormInputWrapper
        title="Description (Q’anjob’al)"
        defaultClassName="max-w-[918px]"
        value={descriptionQanjobl}
        onChange={setDescriptionQanjobl}
      >
        <ParagraphInput />
      </FormInputWrapper>
      <div className="flex justify-end">
        <Button text="Submit video" onClick={submitForm} />
      </div>
      {notification && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50">
          {/* TODO: add fade in/out animation */}
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
