import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import FormInputWrapper from "@/components/FormInputWrapper";
import FormText from "@/components/FormTextWrapper";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";

interface VideoEditModal {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  isEditing?: boolean;
}
export default function VideoEditModal({
  isOpen,
  onClose,
  onSave,
  isEditing = true,
}: VideoEditModal) {
  const [englishError, setEnglishError] = useState("");
  const [qanjobalError, setQanjobalError] = useState("");
  const [videoLinkError, setVideoLinkError] = useState("");

  const [uploadState, setUploadState] = useState("complete");

  let uploadedFile = {
    fileName: "sixty-seven.zip",
    fileSizeMB: 67,
  };

  const [dropdownIndex, setDropdownIndex] = useState<number>();
  const [dropdownError, setDropdownError] = useState("");

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
    if (dropdownError) {
      setDropdownError("");
    }
  };
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

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
                titleClassName="body1-desktop-text text-[15px]"
                required
                state={englishError ? "error" : "default"}
                errorString={englishError}
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
                titleClassName="body1-desktop-text text-[15px]"
                required
                state={qanjobalError ? "error" : "default"}
                errorString={qanjobalError}
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
              titleClassName="body1-desktop-text text-[15px]"
              state={uploadState}
            >
              <FileUpload
                extendedTextClassName="body1-desktop-text text-[15px]"
                uploadedFile={uploadedFile}
                onDelete={() => setUploadState("default")}
                onFileSelect={() => set}
                editable={isEditing}
              />
            </FormInputWrapper>
          </div>

          <div className="flex mt-[10px]">
            <FormInputWrapper
              required
              title="Topic"
              titleClassName="body1-desktop-text text-[15px]"
              state={dropdownError ? "error" : "default"}
              errorString={dropdownError}
            >
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
                state={dropdownError ? "error" : "default"}
                disabled={!isEditing}
              />
            </FormInputWrapper>
          </div>

          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Video link"
              titleClassName="body1-desktop-text text-[15px]"
              required
              state={videoLinkError ? "error" : "default"}
              errorString={videoLinkError}
            >
              <FormText required onErrorChange={setVideoLinkError}>
                <TextInput
                  id="video-input"
                  className="[315px] h-[46px]"
                  disabled={!isEditing}
                />
              </FormText>
            </FormInputWrapper>
          </div>

          {false && (
            <div className="flex items-center gap-2 mt-[10px] body1-desktop-text text-[15px] text-jila-400 cursor-pointer">
              <Plus className="w-[18px] h-[18px]" />
              Add another video
            </div>
          )}

          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Description (English)"
              titleClassName="body1-desktop-text text-[15px]"
              state="default"
            >
              <FormText>
                <ParagraphInput
                  value=""
                  onChange={() => {}}
                  disabled={!isEditing}
                />
              </FormText>
            </FormInputWrapper>
          </div>

          <div className="flex mt-[10px]">
            <FormInputWrapper
              title="Description (Q'anjob'al)"
              titleClassName="body1-desktop-text text-[15px]"
              state="default"
            >
              <FormText>
                <ParagraphInput
                  value=""
                  onChange={() => {}}
                  disabled={!isEditing}
                />
              </FormText>
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
                onClick={onSave}
                text="Save"
                defaultClassName="w-[141px] h-[60px] rounded-[10px] components-text"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
