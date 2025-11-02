import { TextInput } from "@/components/Input";
import FileUploadWrapper from "@/components/FileUploadWrapper";
import ParagraphInput from "@/components/ParagraphInput";
import FormInputWrapper from "@/components/FormInputWrapper";
import { useState } from "react";
import { FormInputState } from "@/components/FormInputWrapper";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Notification from "@/components/Notification";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@prisma/client";

export default function VideoUploadForm() {
  const [resourceTitleEnglish, setResourceTitleEnglish] = useState<string>("");
  const [resourceTitleEnglishState, setResourceTitleEnglishState] =
    useState<FormInputState>("default");

  const [resourceTitleQanjobal, setResourceTitleQanjobal] =
    useState<string>("");
  const [resourceTitleQanjobalState, setResourceTitleQanjobalState] =
    useState<FormInputState>("default");

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

  const addVideoMutation = trpc.videos.addVideo.useMutation();

  const submitForm = async () => {
    let hasError = false;

    if (!resourceTitleEnglish) {
      setResourceTitleEnglishState("error");
      hasError = true;
    }
    if (!resourceTitleQanjobal) {
      setResourceTitleQanjobalState("error");
      hasError = true;
    }
    if (!audioFile) {
      setAudioFileState("error");
      hasError = true;
    }
    if (topicDropdownIndex === undefined) {
      setTopicDropdownState("error");
      hasError = true;
    }
    if (!videoLink) {
      setVideoLinkState("error");
      hasError = true;
    }
    if (hasError) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Audio = reader.result?.toString().split(",")[1];

      try {
        await addVideoMutation.mutateAsync({
          titleEnglish: resourceTitleEnglish,
          titleQanjobal: resourceTitleQanjobal,
          audioFile: base64Audio!,
          audioFilename: audioFile!.name,
          audioFileSize: audioFile!.size,
          topic: topicDropdownOptions[
            topicDropdownIndex!
          ].toUpperCase() as VideoTopic,
          url: videoLink,
          descriptionEnglish,
          descriptionQanjobal: descriptionQanjobl,
        });

        setNotification("Video submitted successfully!");

        setResourceTitleEnglish("");
        setResourceTitleQanjobal("");
        setAudioFile(undefined);
        setTopicDropdownIndex(undefined);
        setVideoLink("");
        setDescriptionEnglish("");
        setDescriptionQanjobl("");
      } catch (err) {
        console.error(err);
        setNotification("Error submitting video.");
      }
    };

    reader.readAsDataURL(audioFile!);
  };

  const getButtonText = () => {
    if (addVideoMutation.isPending) return "Submitting...";
    return "Submit video";
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-[24px] bg-white">
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
          title="Resource title (Q'anjob'al)"
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
        title="Title audio file (Q'anjob'al)"
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
          extendedText="Upload an audio recording of the resource title in Q'anjob'al"
        />
      </FormInputWrapper>
      <FormInputWrapper
        title="Topic"
        state={topicDropdownState}
        setState={setTopicDropdownState}
        value={topicDropdownIndex}
        onChange={setTopicDropdownIndex}
        defaultClassName="max-w-[450px]"
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
        defaultClassName="max-w-[918px]"
        required
      >
        <TextInput />
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
        title="Description (Q'anjob'al)"
        defaultClassName="max-w-[918px]"
        value={descriptionQanjobl}
        onChange={setDescriptionQanjobl}
      >
        <ParagraphInput />
      </FormInputWrapper>
      <div className="flex justify-end">
        <Button
          text={getButtonText()}
          onClick={submitForm}
          disabled={addVideoMutation.isPending}
          defaultClassName={
            addVideoMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
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
