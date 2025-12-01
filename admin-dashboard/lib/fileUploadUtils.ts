import type { FormInputState } from "@/hooks/useForm";

/**
 * Determines the upload state for a file input based on field state, value, and existing file
 * @param fieldState - The current state of the form field ("default" | "error" | "pending" | "complete")
 * @param fieldValue - The current file value (File or undefined)
 * @param hasExistingFile - Whether an existing file is present (for edit modals)
 * @returns The appropriate upload state
 */
export function getFileUploadState(
  fieldState: FormInputState,
  fieldValue: File | undefined,
  hasExistingFile: boolean = false,
): FormInputState {
  if (fieldState === "error") return "error";
  if (fieldValue || hasExistingFile) return "complete";
  return "default";
}
