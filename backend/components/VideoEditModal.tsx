import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import FormInputWrapper from "@/components/FormInputWrapper";
import FormText from "@/components/FormTextWrapper";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@prisma/client";

const TOPIC_OPTIONS = Object.keys(VideoTopic);

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
  const [qanjobalTitle, setQanjobalTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [qanjobalDescription, setQanjobalDescription] = useState("");
  const [dropdownIndex, setDropdownIndex] = useState<number | undefined>();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [englishError, setEnglishError] = useState("");
  const [qanjobalError, setQanjobalError] = useState("");
  const [videoLinkError, setVideoLinkError] = useState("");
  const [dropdownError, setDropdownError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [displayedFile, setDisplayedFile] = useState<
    { fileName: string; fileSizeMB: number } | undefined
  >();
  const [clearExistingFile, setClearExistingFile] = useState(false);

  const updateVideoMutation = trpc.videos.updateVideo.useMutation();

  useEffect(() => {
    if (isOpen && videoData) {
      setEnglishTitle(videoData.titleEnglish || "");
      setQanjobalTitle(videoData.titleQanjobal || "");
      setVideoLink(videoData.url || "");
      setEnglishDescription(videoData.descriptionEnglish || "");
      setQanjobalDescription(videoData.descriptionQanjobal || "");
      const topicIndex = TOPIC_OPTIONS.findIndex(
        (option) =>
          option.toUpperCase() === (videoData.topic || "").toUpperCase(),
      );
      setDropdownIndex(topicIndex !== -1 ? topicIndex : undefined);
      setSaveStatus("idle");

      setSelectedFile(undefined);
      setClearExistingFile(false);

      if (videoData.audioFilename && videoData.audioFileSize) {
        setDisplayedFile({
          fileName: videoData.audioFilename,
          fileSizeMB:
            Math.round((videoData.audioFileSize / 1_000_000) * 100) / 100,
        });
      } else {
        setDisplayedFile(undefined);
      }
    } else if (!isOpen) {
      // Reset state when modal closes
      setDisplayedFile(undefined);
    }
  }, [isOpen, videoData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setDisplayedFile({
      fileName: file.name,
      fileSizeMB: Math.round((file.size / 1_000_000) * 100) / 100,
    });
    setClearExistingFile(false);
  };

  const handleDeleteFile = () => {
    setSelectedFile(undefined);
    setDisplayedFile(undefined);
    setClearExistingFile(true);
  };

  const handleSave = async () => {
    if (!videoData) return;
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
          ? (TOPIC_OPTIONS[dropdownIndex] as VideoTopic)
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

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        mutationPayload.audioFile = reader.result?.toString().split(",")[1];
        mutationPayload.audioFilename = selectedFile.name;
        mutationPayload.audioFileSize = selectedFile.size;
        executeMutation(mutationPayload);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setSaveStatus("error");
      };
      reader.readAsDataURL(selectedFile);
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
  const uploadState = displayedFile ? "complete" : "default";

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
              <FormInputWrapper
                title="Resource title (English)"
                defaultClassName="body1-desktop-text text-[15px]"
                required
                state={englishError ? "error" : "default"}
                errorString={englishError}
                value={englishTitle}
                onChange={setEnglishTitle}
              >
                <FormText required onErrorChange={setEnglishError}>
                  <TextInput
                    id="english-input"
                    className="w-full h-[46px]"
                    disabled={!isEditing}
                  />
                </FormText>
              </FormInputWrapper>
            </div>
            <div className="flex-1">
              <FormInputWrapper
                title="Resource title (Q'anjob'al)"
                defaultClassName="body1-desktop-text text-[15px]"
                required
                state={qanjobalError ? "error" : "default"}
                errorString={qanjobalError}
                value={qanjobalTitle}
                onChange={setQanjobalTitle}
              >
                <FormText required onErrorChange={setQanjobalError}>
                  <TextInput
                    id="qanjobal-input"
                    className="w-full h-[46px]"
                    disabled={!isEditing}
                  />
                </FormText>
              </FormInputWrapper>
            </div>
          </div>
          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Upload file"
              defaultClassName="body1-desktop-text text-[15px]"
              state={uploadState}
            >
              <FileUpload
                uploadedFile={displayedFile}
                onFileSelect={handleFileSelect}
                onDelete={handleDeleteFile}
                editable={isEditing}
              />
            </FormInputWrapper>
          </div>
          <div className="flex mt-[10px]">
            <FormInputWrapper
              required
              title="Topic"
              defaultClassName="body1-desktop-text text-[15px]"
              state={dropdownError ? "error" : "default"}
              errorString={dropdownError}
              value={dropdownIndex}
              onChange={setDropdownIndex}
            >
              <Dropdown
                options={TOPIC_OPTIONS}
                state={dropdownError ? "error" : "default"}
                disabled={!isEditing}
              />
            </FormInputWrapper>
          </div>
          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Video link"
              defaultClassName="body1-desktop-text text-[15px]"
              required
              state={videoLinkError ? "error" : "default"}
              errorString={videoLinkError}
              value={videoLink}
              onChange={setVideoLink}
            >
              <FormText required onErrorChange={setVideoLinkError}>
                <TextInput id="video-input w-full" disabled={!isEditing} />
              </FormText>
            </FormInputWrapper>
          </div>
          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Description (English)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={englishDescription}
              onChange={setEnglishDescription}
            >
              <ParagraphInput disabled={!isEditing} />
            </FormInputWrapper>
          </div>
          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Description (Q'anjob'al)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={qanjobalDescription}
              onChange={setQanjobalDescription}
            >
              <ParagraphInput disabled={!isEditing} />
            </FormInputWrapper>
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
