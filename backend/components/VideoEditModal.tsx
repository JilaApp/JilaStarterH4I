import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import FormInputWrapper from "@/components/FormInputWrapper";
import FormText from "@/components/FormTextWrapper";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";

interface VideoEditModal {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}
export default function VideoEditModal({
  isOpen,
  onClose,
  onSave,
}: VideoEditModal) {
  const [englishError, setEnglishError] = useState("");
  const [qanjobalError, setQanjobalError] = useState("");
  const [videoLinkError, setVideoLinkError] = useState("");
  const [uploadState, setUploadState] = useState<"default" | "pending" | "complete" | "error">("default");

  const uploadedFile = {
    fileName: "sixty-seven.zip",
    fileSizeMB: 67,
  };

  const [dropdownIndex, setDropdownIndex] = useState<number>();
  const [errorDropdownIndex, setErrorDropdownIndex] = useState<number>();

  const onDropdownChange = (index: number) => {
    setDropdownIndex(index);
  };
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div className="relative flex flex-col bg-white rounded-[10px] w-[698px] h-[830px] p-[26.48px]">
        <div className="flex justify-between items-center">
          <div className="components-text">Edit resource</div>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-[18.16px] h-[18.16px]" />
          </button>
        </div>

        <div className="flex gap-[13.62px] mt-[10px]">
          <div className="flex-1 w-[316px] h-[46.13px]">
            <FormInputWrapper
              title="Resource title (English)"
              titleClassName="body1-desktop-text text-[15px]"
              required
              state={englishError ? "error" : "default"}
              errorString={englishError}
            >
              <FormText required onErrorChange={setEnglishError}>
                <TextInput id="english-input" className="[315px] h-[46px]" />
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
                <TextInput id="qanjobal-input" className="w-[315px] h-[46px]" />
              </FormText>
            </FormInputWrapper>
          </div>
        </div>

        <div className="flex mt-[10px]">
          <FormInputWrapper
            title="Upload file"
            titleClassName="body1-desktop-text text-[15px]"
            state="complete"
          // state={uploadState}
          >
            <FileUpload
              onDelete={() => { }}
              extendedText="Upload file extended text"
              extendedTextClassName="body1-desktop-text text-[15px]"
              uploadedFile={uploadedFile}
            />
          </FormInputWrapper>
        </div>

        <div className="flex mt-[10px]">
          <FormInputWrapper
            required
            title="Title"
            titleClassName="body1-desktop-text text-[15px]"
          >
            <Dropdown
              options={[
                "Transport",
                "Legal",
                "Medical",
                "Career",
                "Education",
                "Other"
              ]}
              currentIndex={dropdownIndex}
              onChange={onDropdownChange}
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
              <TextInput id="video-input" className="[315px] h-[46px]" />
            </FormText>
          </FormInputWrapper>
        </div>

        <div className="flex mt-[10px]">
          <FormInputWrapper
            title="Description (English)"
            titleClassName="body1-desktop-text text-[15px]"
            required
            state={videoLinkError ? "error" : "default"}
            errorString={videoLinkError}
          >
            <FormText required onErrorChange={setVideoLinkError}>
              <TextInput id="video-input" className="[315px] h-[46px]" />
            </FormText>
          </FormInputWrapper>
        </div>

        <div className="flex mt-[10px]">
          <FormInputWrapper
            title="Description (Q'anjob'al)"
            titleClassName="body1-desktop-text text-[15px]"
            required
            state={videoLinkError ? "error" : "default"}
            errorString={videoLinkError}
          >
            <FormText required onErrorChange={setVideoLinkError}>
              <TextInput id="video-input" className="[315px] h-[46px]" />
            </FormText>
          </FormInputWrapper>
        </div>

      </div>
    </div>
  );
}