import { Upload, CircleCheck, CircleAlert, File, X } from "lucide-react";
import { useRef } from "react";

export type UploadedFile = {
  fileName: string;
  fileSizeMB: number;
};

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onDelete: () => void;
  state?: "default" | "pending" | "complete" | "error";
  uploadedFile?: UploadedFile;
  extendedText?: string;
  errorText?: string;
}

export default function FileUpload({
  onFileSelect = (file: File) => {},
  onDelete,
  state = "default",
  uploadedFile,
  extendedText = "",
  errorText = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const renderContent = () => {
    switch (state) {
      case "default":
        return (
          <div className="flex flex-col justify-center items-center text-[var(--color-gray-300)] cursor-pointer">
            <Upload />
            <div className="flex items-center h-[40px] text-[18px] font-[500]">
              Upload your file here
            </div>
          </div>
        );
      case "pending":
        return (
          <div className="flex flex-col justify-center items-center text-[var(--color-gray-300)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-spin"
            >
              <path
                d="M21 12C20.9999 13.9006 20.3981 15.7524 19.2809 17.2899C18.1637 18.8275 16.5885 19.9719 14.7809 20.5592C12.9733 21.1464 11.0262 21.1464 9.21864 20.559C7.41109 19.9717 5.83588 18.8272 4.71876 17.2895C3.60165 15.7519 2.99999 13.9001 3 11.9995C3.00001 10.0989 3.60171 8.24712 4.71884 6.70951C5.83598 5.1719 7.4112 4.02742 9.21877 3.44009C11.0263 2.85276 12.9734 2.85273 14.781 3.44001"
                stroke="#A1A1A1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex items-center h-[40px] text-[18px] font-[400]">
              Uploading file...
            </div>
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col justify-center items-center text-[var(--color-jila-400)]">
            <CircleCheck />
            <div className="flex items-center h-[40px] text-[18px] font-[500]">
              File uploaded!
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col justify-center items-center text-[var(--color-error-400)]">
            <CircleAlert />
            <div className="flex items-center h-[40px] text-[18px] font-[500]">
              {errorText}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-[11px]">
      <span className="flex text-[var(--color-gray-300)] font-[300] leading-none mt-[2px]">
        {extendedText}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={state === "default" ? handleClickUpload : undefined}
        className={`
    flex justify-center items-center w-full h-[122px] 
    rounded-[10px]
    ${state === "default" ? "cursor-pointer hover:bg-[var(--color-cream-300)]" : ""}
    ${state === "error" ? "bg-[#FFF3F3]" : "bg-white"}
  `}
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
      {state == "complete" && (
        <div className="flex items-center rounded-[10px] px-[10px] py-[8px] bg-white">
          <div className="flex gap-[17px] items-center w-full">
            <File className="text-[var(--color-jila-400)]" />
            <div className="flex flex-col">
              <span className="font-[500]">
                {uploadedFile && uploadedFile.fileName}
              </span>
              <span className="text-[var(--color-gray-300)] font-[200]">
                {uploadedFile && uploadedFile.fileSizeMB} MB
              </span>
            </div>
            <X className="flex ml-auto cursor-pointer" onClick={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}
