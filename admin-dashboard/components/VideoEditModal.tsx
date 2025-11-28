import { X, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo, useRef } from "react";
import FormField from "@/components/FormField";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@/lib/types";
import { VIDEO_TOPIC_OPTIONS } from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import { validateRequired, validateURL } from "@/lib/validators";
import { formatFileSize } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

type SaveStatus = "idle" | "saving" | "success" | "error";

interface VideoData {
  id: string | number;
  titleEnglish: string;
  titleQanjobal: string;
  topic: string;
  urls: string[];
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
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      englishTitle: createField(""),
      qanjobalTitle: createField(""),
      videoLinks: createField<string[]>([""]),
      englishDescription: createField(""),
      qanjobalDescription: createField(""),
      dropdownIndex: createField<number | undefined>(undefined),
      audioFile: createField<File | undefined>(undefined),
    });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [clearExistingFile, setClearExistingFile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const updateVideoMutation = trpc.videos.updateVideo.useMutation();

  useClickOutside(modalRef, () => {
    if (saveStatus !== "saving") {
      onClose();
    }
  });

  const existingFileMetadata = useMemo(() => {
    if (videoData?.audioFilename && videoData?.audioFileSize) {
      return {
        fileName: videoData.audioFilename,
        fileSizeMB: formatFileSize(videoData.audioFileSize),
      };
    }
    return undefined;
  }, [videoData?.audioFilename, videoData?.audioFileSize]);

  useEffect(() => {
    if (isOpen && videoData) {
      setFieldValue("englishTitle", videoData.titleEnglish || "");
      setFieldValue("qanjobalTitle", videoData.titleQanjobal || "");
      setFieldValue(
        "videoLinks",
        videoData.urls && videoData.urls.length > 0 ? videoData.urls : [""]
      );
      setFieldValue("englishDescription", videoData.descriptionEnglish || "");
      setFieldValue("qanjobalDescription", videoData.descriptionQanjobal || "");

      const topicIndex = VIDEO_TOPIC_OPTIONS.findIndex(
        (option) =>
          String(option).toUpperCase() === (videoData.topic || "").toUpperCase()
      );
      setFieldValue(
        "dropdownIndex",
        topicIndex !== -1 ? topicIndex : undefined
      );

      setSaveStatus("idle");
    }
  }, [isOpen, videoData?.id]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...fields.videoLinks.value];
    newLinks[index] = value;
    setFieldValue("videoLinks", newLinks);
  };

  const handleAddLink = () => {
    setFieldValue("videoLinks", [...fields.videoLinks.value, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = fields.videoLinks.value.filter((_, i) => i !== index);
    setFieldValue("videoLinks", newLinks.length ? newLinks : [""]);
  };

  const handleFileChange = (file: File) => {
    setFieldValue("audioFile", file);
    setClearExistingFile(false);
  };

  const handleDeleteFile = () => {
    setFieldValue("audioFile", undefined);
    setClearExistingFile(true);
  };

  const handleSave = async () => {
    if (!videoData) return;

    let isValid = validateAllFields({
      englishTitle: validateRequired,
      qanjobalTitle: validateRequired,
      dropdownIndex: validateRequired,
    });

    const currentLinks = fields.videoLinks.value;
    const invalidLinks = currentLinks.some((link) => {
      if (!link) return true;
      return !validateURL(link);
    });

    if (invalidLinks) {
      setFieldError("videoLinks", "Please enter valid URLs.");
      isValid = false;
    }

    if (!isValid) return;

    setSaveStatus("saving");

    const mutationPayload: Parameters<
      typeof updateVideoMutation.mutateAsync
    >[0] = {
      id: videoData.id as number,
      titleEnglish: fields.englishTitle.value,
      titleQanjobal: fields.qanjobalTitle.value,
      urls: fields.videoLinks.value,
      descriptionEnglish: fields.englishDescription.value,
      descriptionQanjobal: fields.qanjobalDescription.value,
      topic:
        fields.dropdownIndex.value !== undefined
          ? (VIDEO_TOPIC_OPTIONS[fields.dropdownIndex.value] as VideoTopic)
          : undefined,
    };

    const executeMutation = async (
      payload: typeof mutationPayload
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

    if (fields.audioFile.value) {
      const reader = new FileReader();
      reader.onload = () => {
        mutationPayload.audioFile = reader.result?.toString().split(",")[1];
        mutationPayload.audioFilename = fields.audioFile.value!.name;
        mutationPayload.audioFileSize = fields.audioFile.value!.size;
        executeMutation(mutationPayload);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setSaveStatus("error");
      };
      reader.readAsDataURL(fields.audioFile.value);
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

  const getFileUploadState = () => {
    if (fields.audioFile.state === "error") return "error";
    if (fields.audioFile.value || (existingFileMetadata && !clearExistingFile))
      return "complete";
    return "default";
  };

  if (!isOpen) return null;

  const saveButtonUI = getSaveButtonUI();

  return (
    <div className="fixed y-40 inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div
        ref={modalRef}
        className="relative flex flex-col bg-white rounded-[10px] w-[49%] h-[90%] p-[26.48px]"
      >
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
                state={fields.englishTitle.state}
                errorString={fields.englishTitle.error}
                value={fields.englishTitle.value}
                onChange={(val) => setFieldValue("englishTitle", val)}
              >
                {(props) => (
                  <TextInput
                    {...props}
                    id="english-input"
                    className="w-full h-[60px]"
                    disabled={!isEditing}
                  />
                )}
              </FormField>
            </div>
            <div className="flex-1">
              <FormField
                title="Resource title (Q'anjob'al)"
                defaultClassName="body1-desktop-text text-[15px]"
                required
                state={fields.qanjobalTitle.state}
                errorString={fields.qanjobalTitle.error}
                value={fields.qanjobalTitle.value}
                onChange={(val) => setFieldValue("qanjobalTitle", val)}
              >
                {(props) => (
                  <TextInput
                    {...props}
                    id="qanjobal-input"
                    className="w-full h-[60px]"
                    disabled={!isEditing}
                  />
                )}
              </FormField>
            </div>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Upload file"
              defaultClassName="body1-desktop-text text-[15px]"
              value={fields.audioFile.value}
              onChange={handleFileChange}
            >
              {(props) => (
                <FileUpload
                  value={props.value}
                  onChange={props.onChange}
                  editable={isEditing}
                  onDelete={handleDeleteFile}
                  state={getFileUploadState()}
                  existingFile={
                    clearExistingFile ? undefined : existingFileMetadata
                  }
                />
              )}
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              required
              title="Topic"
              defaultClassName="body1-desktop-text text-[15px]"
              state={fields.dropdownIndex.state}
              errorString={fields.dropdownIndex.error}
              value={fields.dropdownIndex.value}
              onChange={(val) => setFieldValue("dropdownIndex", val)}
            >
              {(props) => (
                <Dropdown
                  {...props}
                  options={VIDEO_TOPIC_OPTIONS}
                  disabled={!isEditing}
                />
              )}
            </FormField>
          </div>

          <div className="flex flex-col mt-[10px]">
            <label className="body1-desktop-text text-[15px] mb-2 font-medium">
              Video links <span className="text-red-500">*</span>
            </label>
            {fields.videoLinks.value.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <div className="flex-1">
                  <TextInput
                    id={`video-input-${index}`}
                    value={link}
                    onChange={(val) => handleLinkChange(index, val)}
                    disabled={!isEditing}
                    className="w-full h-[46px]"
                    state={fields.videoLinks.state}
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    type="button"
                    title="Remove link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {fields.videoLinks.state === "error" && (
              <p className="text-red-500 text-sm mt-1 mb-2">
                {fields.videoLinks.error}
              </p>
            )}

            {isEditing && (
              <button
                onClick={handleAddLink}
                className="flex items-center text-sm text-jila-400 hover:text-jila-300 font-medium mt-1 w-fit"
                type="button"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add another link
              </button>
            )}
          </div>

          <div className="flex mt-[10px]">
            <FormField
              title="Description (English)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={fields.englishDescription.value}
              onChange={(val) => setFieldValue("englishDescription", val)}
            >
              {(props) => <ParagraphInput {...props} disabled={!isEditing} />}
            </FormField>
          </div>
          <div className="flex mt-[10px]">
            <FormField
              title="Description (Q'anjob'al)"
              defaultClassName="body1-desktop-text text-[15px]"
              state="default"
              value={fields.qanjobalDescription.value}
              onChange={(val) => setFieldValue("qanjobalDescription", val)}
            >
              {(props) => <ParagraphInput {...props} disabled={!isEditing} />}
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
