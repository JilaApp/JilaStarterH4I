import { useState } from "react";
import FileUpload, { UploadedFile } from "@/components/FileUpload";

interface FileUploadWrapperProps {
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export default function FileUploadWrapper({
  onUpload,
  onDelete,
}: FileUploadWrapperProps) {
  const [state, setState] = useState<
    "default" | "pending" | "complete" | "error"
  >("default");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>(
    undefined
  );
  const [errorText, setErrorText] = useState<string>("");

  const handleFileSelect = async (file: File) => {
    setState("pending");
    setErrorText("");
    try {
      await onUpload(file);
      setUploadedFile({
        fileName: file.name,
        fileSizeMB: Math.round((file.size / 1_000_000) * 100) / 100,
      });
      setState("complete");
    } catch (err: any) {
      setErrorText(err?.message || "Upload failed! Please try again.");
      setState("error");
    }
  };

  const handleDelete = () => {
    setUploadedFile(undefined);
    onDelete();
    setState("default");
  };

  return (
    <FileUpload
      state={state}
      uploadedFile={uploadedFile}
      errorText={errorText}
      onFileSelect={handleFileSelect}
      onDelete={handleDelete}
    />
  );
}
