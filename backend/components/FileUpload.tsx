import { Upload, CircleCheck, CircleAlert, File, X } from "lucide-react";
import { useRef } from "react";
import type { FormInputState } from "@/lib/types";
import { formatFileSize } from "@/lib/utils";
import Spinner from "./Spinner";
import clsx from "clsx";

interface FileUploadProps {
  value?: File;
  onChange?: (file: File) => void;
  onDelete?: () => void;
  editable?: boolean;
  extendedText?: string;
  errorText?: string;
  extendedTextClassName?: string;
  state?: FormInputState;
  existingFile?: {
    fileName: string;
    fileSizeMB: number;
  };
}

export default function FileUpload({
  value,
  onChange = () => {},
  onDelete = () => {},
  state = "default",
  editable = true,
  extendedText = "",
  errorText = "",
  extendedTextClassName = "",
  existingFile,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedFile = value
    ? {
        fileName: value.name,
        fileSizeMB: formatFileSize(value.size),
      }
    : existingFile;

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onDelete();
  };

  const renderContent = () => {
    switch (state) {
      case "default":
        return (
          <div className="flex flex-col justify-center items-center text-gray-300 cursor-pointer">
            <Upload />
            <div className="flex items-center h-[40px] text-lg font-[500]">
              Upload your file here
            </div>
          </div>
        );
      case "pending":
        return (
          <div className="flex flex-col justify-center items-center text-gray-300">
            <Spinner size={24} className="text-gray-300" />
            <div className="flex items-center h-[40px] text-lg font-[400]">
              Uploading file...
            </div>
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col justify-center items-center text-jila-400">
            <CircleCheck />
            <div className="flex items-center h-[40px] text-lg font-[500]">
              File uploaded!
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col justify-center items-center text-error-400">
            <CircleAlert />
            <div className="flex items-center h-[40px] text-lg font-[500]">
              {errorText}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-[11px]">
      {extendedText && (
        <span
          className={`flex text-gray-300 font-[300] leading-none mt-[2px] ${extendedTextClassName}`}
        >
          {extendedText}
        </span>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {(state === "default" || state === "pending" || state === "error") &&
        editable && (
          <div
            onClick={state === "pending" ? undefined : handleClickUpload}
            className={clsx(
              "flex justify-center items-center w-full h-[122px] rounded-[10px]",
              {
                "cursor-pointer hover:bg-cream-300": state !== "pending",
                "bg-[#FFF3F3]": state === "error",
                "bg-white": state !== "error",
              },
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
        <rect
          width='100%'
          height='100%'
          fill='none'
          rx='10' ry='10'
          stroke='${state === "error" ? "#E31F1F" : "#CDCDCD"}'
          stroke-width='3'
          stroke-dasharray='6,14'
          stroke-dashoffset='0'
          stroke-linecap='square'
        />
      </svg>`,
              )}")`,
            }}
          >
            {renderContent()}
          </div>
        )}
      {state === "complete" && displayedFile && (
        <div className="flex items-center rounded-[10px] px-[10px] py-[8px] bg-white">
          <div className="flex gap-[17px] items-center w-full">
            <File className="text-jila-400" />
            <div className="flex flex-col">
              <span className="font-[500]">{displayedFile.fileName}</span>
              <span className="text-gray-300 font-[200]">
                {displayedFile.fileSizeMB} MB
              </span>
            </div>
            {editable && (
              <X
                className="flex ml-auto cursor-pointer"
                onClick={handleDelete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
