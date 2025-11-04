import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import FormField from "@/components/FormField";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@/lib/types";
import { VIDEO_TOPIC_OPTIONS } from "@/lib/constants";
import { validateRequired } from "@/lib/validators";

type SaveStatus = "idle" | "saving" | "success" | "error";

interface VideoData {
  id: string | number;
  titleEnglish: string;
  titleQanjobal: string;
  topic: string;
  url: string;
  descriptionEnglish: string | null;
  descriptionQanjobal: string | null;
  audioFilename: string | null;
  audioFileSize: number | null;
}

interface VideoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplete?: () => void;
  isEditing?: boolean;
  videoData?: VideoData | null;
}

export default function VideoEditModal({
  isOpen,
  onClose,
  onUpdateComplete,
  isEditing = true,
  videoData,
}: VideoEditModalProps) {
  const [englishTitle, setEnglishTitle] = useState("");
  const [englishTitleError, setEnglishTitleError] = useState("");
  const [qanjobalTitle, setQanjobalTitle] = useState("");
  const [qanjobalTitleError, setQanjobalTitleError] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoLinkError, setVideoLinkError] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [qanjobalDescription, setQanjobalDescription] = useState("");
  const [dropdownIndex, setDropdownIndex] = useState<number | undefined>();
  const [dropdownError, setDropdownError] = useState("");

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [existingFileMetadata, setExistingFileMetadata] = useState<
    { fileName: string; fileSizeMB: number } | undefined
  >();
  const [clearExistingFile, setClearExistingFile] = useState(false);

  const updateVideoMutation = trpc.videos.updateVideo.useMutation();

  useEffect(() => {
    if (isOpen && videoData) {
      console.log("VideoEditModal - videoData:", videoData);
      setEnglishTitle(videoData.titleEnglish || "");
      setQanjobalTitle(videoData.titleQanjobal || "");
      setVideoLink(videoData.url || "");
      setEnglishDescription(videoData.descriptionEnglish || "");
      setQanjobalDescription(videoData.descriptionQanjobal || "");

      const topicIndex = VIDEO_TOPIC_OPTIONS.findIndex(
        (option) =>
          option.toUpperCase() === (videoData.topic || "").toUpperCase(),
      );
      setDropdownIndex(topicIndex !== -1 ? topicIndex : undefined);

      setSaveStatus("idle");
      setAudioFile(undefined);
      setClearExistingFile(false);

      setEnglishTitleError("");
      setQanjobalTitleError("");
      setVideoLinkError("");
      setDropdownError("");

      if (videoData.audioFilename && videoData.audioFileSize) {
        const metadata = {
          fileName: videoData.audioFilename,
          fileSizeMB:
            Math.round((videoData.audioFileSize / 1_000_000) * 100) / 100,
        };
        console.log("VideoEditModal - setting existingFileMetadata:", metadata);
        setExistingFileMetadata(metadata);
      } else {
        console.log("VideoEditModal - no audio file data");
        setExistingFileMetadata(undefined);
      }
    }
  }, [isOpen, videoData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleFileChange = (file: File) => {
    setAudioFile(file);
    setClearExistingFile(false);
  };

  const handleDeleteFile = () => {
    setAudioFile(undefined);
    setClearExistingFile(true);
  };

  const handleSave = async () => {
    if (!videoData) return;

    let hasError = false;

    if (!englishTitle) {
      setEnglishTitleError("This field is required");
      hasError = true;
    }
    if (!qanjobalTitle) {
      setQanjobalTitleError("This field is required");
      hasError = true;
    }
    if (!videoLink) {
      setVideoLinkError("This field is required");
      hasError = true;
    }
    if (dropdownIndex === undefined) {
      setDropdownError("This field is required");
      hasError = true;
    }

    if (hasError) return;

    setSaveStatus("saving");

    const mutationPayload: Parameters<
      typeof updateVideoMutation.mutateAsync
    >[0] = {
      id: videoData.id as number,
      titleEnglish: englishTitle,
      titleQanjobal: qanjobalTitle,
      url: videoLink,
      descriptionEnglish: englishDescription,
      descriptionQanjobal: qanjobalDescription,
      topic:
        dropdownIndex !== undefined
          ? (VIDEO_TOPIC_OPTIONS[dropdownIndex] as VideoTopic)
          : undefined,
    };

    const executeMutation = async (
      payload: typeof mutationPayload,
    ): Promise<void> => {
      try {
        await updateVideoMutation.mutateAsync(payload);
        setSaveStatus("success");
        onUpdateComplete?.();
        onClose();
      } catch (error) {
        console.error("Failed to update video:", error);
        setSaveStatus("error");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }
    };

    if (audioFile) {
      const reader = new FileReader();
      reader.onload = () => {
        mutationPayload.audioFile = reader.result?.toString().split(",")[1];
        mutationPayload.audioFilename = audioFile.name;
        mutationPayload.audioFileSize = audioFile.size;
        executeMutation(mutationPayload);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setSaveStatus("error");
      };
      reader.readAsDataURL(audioFile);
    } else if (clearExistingFile) {
      mutationPayload.audioFile = "";
      executeMutation(mutationPayload);
    } else {
      executeMutation(mutationPayload);
    }
  };

  const getSaveButtonUI = () => {
    switch (saveStatus) {
      case "saving":
        return { text: "Saving...", disabled: true, className: "opacity-70" };
      case "success":
        return { text: "Saved!", disabled: true, className: "bg-green-500" };
      case "error":
        return {
          text: "Error! Try Again",
          disabled: false,
          className: "bg-red-500",
        };
      default:
        return { text: "Save", disabled: false, className: "" };
    }
  };

  if (!isOpen) return null;

  const saveButtonUI = getSaveButtonUI();

  console.log("VideoEditModal - render:", {
    audioFile,
    existingFileMetadata,
    clearExistingFile,
    finalExistingFile: clearExistingFile ? undefined : existingFileMetadata,
  });

  return (
    <div className="fixed y-40 inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div className="relative flex flex-col bg-white rounded-[10px] w-[698px] h-[830px] p-[26.48px]">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="components-text">
            {isEditing ? "Edit resource" : "View resource"}
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-[18.16px] h-[18.16px]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pl-4 pr-4">
          <div className="flex gap-[13.62px] mb-[10px]">
            <div className="flex-1">
              <FormField
                title="Resource title (English)"
                defaultClassName="body1-desktop-text text-[15px]"
                required
                state={englishTitleError ? "error" : "default"}
                errorString={englishTitleError}
                value={englishTitle}
                onChange={setEnglishTitle}
              >
                <TextInput
                  id="english-input"
                  className="w-full h-[46px]"
                  disabled={!isEditing}
                />
              </FormField>
            </div>
            <div className="flex-1">
              <FormField
                title="Resource title (Q'anjob'al)"
                defaultClassName="body1-desktop-text text-[15px]"
                required
                state={qanjobalTitleError ? "error" : "default"}
                errorString={qanjobalTitleError}
                value={qanjobalTitle}
                onChange={setQanjobalTitle}
              >
                <TextInput
                  id="qanjobal-input"
                  className="w-full h-[46px]"
                  disabled={!isEditing}
                />
              </FormField>
            </div>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Upload file"
              defaultClassName="body1-desktop-text text-[15px]"
              value={audioFile}
              onChange={handleFileChange}
              editable={isEditing}
              existingFile={
                clearExistingFile ? undefined : existingFileMetadata
              }
              onDelete={handleDeleteFile}
            >
              <FileUpload />
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              required
              title="Topic"
              defaultClassName="body1-desktop-text text-[15px]"
              state={dropdownError ? "error" : "default"}
              errorString={dropdownError}
              value={dropdownIndex}
              onChange={setDropdownIndex}
            >
              <Dropdown
                options={VIDEO_TOPIC_OPTIONS}
                state={dropdownError ? "error" : "default"}
                disabled={!isEditing}
              />
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Video link"
              defaultClassName="body1-desktop-text text-[15px]"
              required
              state={videoLinkError ? "error" : "default"}
              errorString={videoLinkError}
              value={videoLink}
              onChange={setVideoLink}
            >
              <TextInput id="video-input w-full" disabled={!isEditing} />
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Description (English)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={englishDescription}
              onChange={setEnglishDescription}
            >
              <ParagraphInput disabled={!isEditing} />
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Description (Q'anjob'al)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={qanjobalDescription}
              onChange={setQanjobalDescription}
            >
              <ParagraphInput disabled={!isEditing} />
            </FormField>
          </div>
          {isEditing && (
            <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px]">
              <Button
                onClick={onClose}
                text="Cancel"
                defaultClassName="w-[141px] h-[60px] bg-gray-200 text-type-400 rounded-[10px] components-text"
                hoverClassName="hover:bg-gray-300"
              />
              <Button
                onClick={handleSave}
                text={saveButtonUI.text}
                disabled={saveButtonUI.disabled}
                defaultClassName={`w-[141px] h-[60px] rounded-[10px] components-text transition-all duration-300 ${saveButtonUI.className}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
