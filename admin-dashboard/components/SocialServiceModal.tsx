import React, { useEffect, useState, useMemo, useRef } from "react";
import { X } from "lucide-react";
import FormField from "@/components/FormField";
import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";
import { trpc } from "@/lib/trpc";
import { SocialServiceCategory } from "@/lib/types";
import {
  SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS,
  SOCIAL_SERVICE_CATEGORY_ENUM_MAP,
  US_STATES,
} from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import {
  validateRequired,
  validateURL,
  validateDropdownIndex,
} from "@/lib/validators";
import { formatFileSize } from "@/lib/utils";
import SubmitButton from "./SubmitButton";
import { useClickOutside } from "@/hooks/useClickOutside";

interface SocialServiceData {
  id: string | number;
  title: string;
  category: string;
  phone_number: string;
  address: string | null;
  description: string | null;
  url: string | null;
  titleAudioFilename: string | null;
  titleAudioFileSize: number | null;
  descriptionAudioFilename: string | null;
  descriptionAudioFileSize: number | null;
}

interface SocialServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplete?: () => void;
  isEditing?: boolean;
  serviceData?: SocialServiceData | null;
}

export default function SocialServiceEditModal({
  isOpen,
  onClose,
  onUpdateComplete,
  isEditing = true,
  serviceData,
}: SocialServiceEditModalProps) {
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      englishTitle: createField(""),
      qanjobalTitle: createField(""),
      titleFile: createField<File | undefined>(undefined),
      topicIndex: createField<number | undefined>(undefined),
      phoneNumber: createField(""),
      addressLine: createField(""),
      city: createField(""),
      stateIndex: createField<number | undefined>(undefined),
      link: createField(""),
      englishDescription: createField(""),
      qanjobalDescription: createField(""),
      descriptionFile: createField<File | undefined>(undefined),
    });

  const [clearExistingTitleFile, setClearExistingTitleFile] = useState(false);
  const [clearExistingDescriptionFile, setClearExistingDescriptionFile] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const updateSocialServiceMutation =
    trpc.socialServices.editSocialService.useMutation();

  useClickOutside(modalRef, () => {
    if (!isSaving) {
      onClose();
    }
  });

  const existingTitleFileMetadata = useMemo(() => {
    if (serviceData?.titleAudioFilename && serviceData?.titleAudioFileSize) {
      return {
        fileName: serviceData.titleAudioFilename,
        fileSizeMB: formatFileSize(serviceData.titleAudioFileSize),
      };
    }
    return undefined;
  }, [serviceData?.titleAudioFilename, serviceData?.titleAudioFileSize]);

  const existingDescriptionFileMetadata = useMemo(() => {
    if (
      serviceData?.descriptionAudioFilename &&
      serviceData?.descriptionAudioFileSize
    ) {
      return {
        fileName: serviceData.descriptionAudioFilename,
        fileSizeMB: formatFileSize(serviceData.descriptionAudioFileSize),
      };
    }
    return undefined;
  }, [
    serviceData?.descriptionAudioFilename,
    serviceData?.descriptionAudioFileSize,
  ]);

  useEffect(() => {
    if (isOpen && serviceData) {
      setFieldValue("englishTitle", serviceData.title || "");
      setFieldValue("qanjobalTitle", serviceData.title || "");
      setFieldValue("phoneNumber", serviceData.phone_number || "");
      setFieldValue("link", serviceData.url || "");
      setFieldValue("englishDescription", serviceData.description || "");
      setFieldValue("qanjobalDescription", serviceData.description || "");

      if (serviceData.address) {
        const addressParts = serviceData.address.split(", ");
        if (addressParts.length >= 3) {
          setFieldValue("addressLine", addressParts[0] || "");
          setFieldValue("city", addressParts[1] || "");
          const stateIndex = US_STATES.findIndex(
            (state) => state === addressParts[2],
          );
          setFieldValue(
            "stateIndex",
            stateIndex !== -1 ? stateIndex : undefined,
          );
        } else {
          setFieldValue("addressLine", serviceData.address);
          setFieldValue("city", "");
          setFieldValue("stateIndex", undefined);
        }
      } else {
        setFieldValue("addressLine", "");
        setFieldValue("city", "");
        setFieldValue("stateIndex", undefined);
      }

      const topicIndex = SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS.findIndex(
        (option) =>
          option.toUpperCase() === (serviceData.category || "").toUpperCase(),
      );
      setFieldValue("topicIndex", topicIndex !== -1 ? topicIndex : undefined);
    }
  }, [isOpen, serviceData?.id]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleTitleFileChange = (file: File) => {
    setFieldValue("titleFile", file);
    setClearExistingTitleFile(false);
  };

  const handleDeleteTitleFile = () => {
    setFieldValue("titleFile", undefined);
    setClearExistingTitleFile(true);
  };

  const handleDescriptionFileChange = (file: File) => {
    setFieldValue("descriptionFile", file);
    setClearExistingDescriptionFile(false);
  };

  const handleDeleteDescriptionFile = () => {
    setFieldValue("descriptionFile", undefined);
    setClearExistingDescriptionFile(true);
  };

  const handleSave = async () => {
    if (!serviceData) return;

    const isValid = validateAllFields({
      englishTitle: validateRequired,
      qanjobalTitle: validateRequired,
      topicIndex: validateDropdownIndex,
      phoneNumber: validateRequired,
    });

    if (!isValid) return;

    setIsSaving(true);

    const addressParts = [
      fields.addressLine.value,
      fields.city.value,
      fields.stateIndex.value !== undefined
        ? US_STATES[fields.stateIndex.value]
        : "",
    ].filter(Boolean);

    const mutationPayload: Parameters<
      typeof updateSocialServiceMutation.mutateAsync
    >[0] = {
      id: serviceData.id as number,
      title: fields.englishTitle.value,
      phone_number: fields.phoneNumber.value,
      address: addressParts.length > 0 ? addressParts.join(", ") : undefined,
      description: fields.englishDescription.value || undefined,
      url: fields.link.value || undefined,
      category:
        fields.topicIndex.value !== undefined
          ? (SOCIAL_SERVICE_CATEGORY_ENUM_MAP[
              SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS[fields.topicIndex.value]
            ] as SocialServiceCategory)
          : undefined,
    };

    const executeMutation = async (
      payload: typeof mutationPayload,
    ): Promise<void> => {
      try {
        await updateSocialServiceMutation.mutateAsync(payload);
        setIsSaving(false);
        onUpdateComplete?.();
        onClose();
      } catch (error) {
        console.error("Failed to update social service:", error);
        setIsSaving(false);
        setTimeout(() => {}, 2000);
      }
    };

    const filesToProcess: Array<{ file: File; type: "title" | "description" }> =
      [];

    if (fields.titleFile.value) {
      filesToProcess.push({ file: fields.titleFile.value, type: "title" });
    }
    if (fields.descriptionFile.value) {
      filesToProcess.push({
        file: fields.descriptionFile.value,
        type: "description",
      });
    }

    if (filesToProcess.length > 0) {
      let processedCount = 0;

      filesToProcess.forEach(({ file, type }) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result?.toString().split(",")[1];

          if (type === "title") {
            mutationPayload.titleAudioFile = base64Data;
            mutationPayload.titleAudioFilename = file.name;
            mutationPayload.titleAudioFileSize = file.size;
          } else {
            mutationPayload.descriptionAudioFile = base64Data;
            mutationPayload.descriptionAudioFilename = file.name;
            mutationPayload.descriptionAudioFileSize = file.size;
          }

          processedCount++;
          if (processedCount === filesToProcess.length) {
            if (clearExistingTitleFile && !fields.titleFile.value) {
              mutationPayload.titleAudioFile = "";
            }
            if (clearExistingDescriptionFile && !fields.descriptionFile.value) {
              mutationPayload.descriptionAudioFile = "";
            }
            executeMutation(mutationPayload);
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          setIsSaving(false);
        };
        reader.readAsDataURL(file);
      });
    } else {
      if (clearExistingTitleFile) {
        mutationPayload.titleAudioFile = "";
      }
      if (clearExistingDescriptionFile) {
        mutationPayload.descriptionAudioFile = "";
      }
      executeMutation(mutationPayload);
    }
  };

  const getTitleFileUploadState = () => {
    if (fields.titleFile.state === "error") return "error";
    if (
      fields.titleFile.value ||
      (existingTitleFileMetadata && !clearExistingTitleFile)
    )
      return "complete";
    return "default";
  };

  const getDescriptionFileUploadState = () => {
    if (fields.descriptionFile.state === "error") return "error";
    if (
      fields.descriptionFile.value ||
      (existingDescriptionFileMetadata && !clearExistingDescriptionFile)
    )
      return "complete";
    return "default";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed y-40 inset-0 z-50 flex items-center justify-center  bg-[rgb(83,83,83,0.19)]">
      <div
        ref={modalRef}
        className="relative flex flex-col bg-white rounded-[10px] w-[49%] h-[90%] p-[26.48px] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-[20px]">
          <div className="components-text">
            {isEditing ? "Edit resource" : "View resource"}
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-[18.16px] h-[18.16px]" />
          </button>
        </div>

        <div className="flex flex-row gap-[18px]">
          <FormField
            title="Resource title (English)"
            state={fields.englishTitle.state}
            errorString={fields.englishTitle.error}
            value={fields.englishTitle.value}
            onChange={(val) => setFieldValue("englishTitle", val)}
            defaultClassName="max-w-[450px] text-[15px]"
            required
          >
            {(props) => <TextInput {...props} disabled={!isEditing} />}
          </FormField>

          <FormField
            title="Resource title (Q'anjob'al)"
            state={fields.qanjobalTitle.state}
            errorString={fields.qanjobalTitle.error}
            value={fields.qanjobalTitle.value}
            onChange={(val) => setFieldValue("qanjobalTitle", val)}
            defaultClassName="max-w-[450px] text-[15px]"
            required
          >
            {(props) => <TextInput {...props} disabled={!isEditing} />}
          </FormField>
        </div>

        <FormField
          title="Title audio file (Q'anjob'al)"
          description={isEditing ? "Maximum size: 30MB" : ""}
          state={fields.titleFile.state}
          errorString={fields.titleFile.error}
          value={fields.titleFile.value}
          onChange={handleTitleFileChange}
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
          required
        >
          {(props) => (
            <FileUpload
              value={props.value}
              onChange={props.onChange}
              editable={isEditing}
              onDelete={handleDeleteTitleFile}
              state={getTitleFileUploadState()}
              extendedText={
                isEditing
                  ? "Upload an audio recording of the description in Q'anjob'al"
                  : ""
              }
              existingFile={
                clearExistingTitleFile ? undefined : existingTitleFileMetadata
              }
            />
          )}
        </FormField>

        <FormField
          title="Topic"
          state={fields.topicIndex.state}
          errorString={fields.topicIndex.error}
          value={fields.topicIndex.value}
          onChange={(val) => setFieldValue("topicIndex", val)}
          defaultClassName="w-full mt-[10px] text-[15px]"
          required
        >
          {(props) => (
            <Dropdown
              {...props}
              options={[...SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS]}
              disabled={!isEditing}
            />
          )}
        </FormField>

        <FormField
          title="Phone number"
          state={fields.phoneNumber.state}
          errorString={fields.phoneNumber.error}
          value={fields.phoneNumber.value}
          onChange={(val) => setFieldValue("phoneNumber", val)}
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
          required
        >
          {(props) => <TextInput {...props} disabled={!isEditing} />}
        </FormField>

        <FormField
          title="Address line 1"
          state={fields.addressLine.state}
          errorString={fields.addressLine.error}
          value={fields.addressLine.value}
          onChange={(val) => setFieldValue("addressLine", val)}
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
        >
          {(props) => <TextInput {...props} disabled={!isEditing} />}
        </FormField>

        <div className="flex flex-row gap-[18px] mt-[10px] text-[15px]">
          <FormField
            title="City"
            state={fields.city.state}
            errorString={fields.city.error}
            value={fields.city.value}
            onChange={(val) => setFieldValue("city", val)}
            defaultClassName="max-w-[450px]"
          >
            {(props) => <TextInput {...props} disabled={!isEditing} />}
          </FormField>

          <FormField
            title="State"
            state={fields.stateIndex.state}
            errorString={fields.stateIndex.error}
            value={fields.stateIndex.value}
            onChange={(val) => setFieldValue("stateIndex", val)}
            defaultClassName="max-w-[450px] text-[15px]"
          >
            {(props) => (
              <Dropdown
                {...props}
                disabled={!isEditing}
                options={[...US_STATES]}
              />
            )}
          </FormField>
        </div>

        <FormField
          title="Link to external website"
          state={fields.link.state}
          errorString={fields.link.error}
          value={fields.link.value}
          onChange={(val) => setFieldValue("link", val)}
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
        >
          {(props) => <TextInput {...props} disabled={!isEditing} />}
        </FormField>

        <FormField
          title="Description (English)"
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
          value={fields.englishDescription.value}
          onChange={(val) => setFieldValue("englishDescription", val)}
        >
          {(props) => <ParagraphInput {...props} disabled={!isEditing} />}
        </FormField>

        <FormField
          title="Description (Q'anjob'al)"
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
          value={fields.qanjobalDescription.value}
          onChange={(val) => setFieldValue("qanjobalDescription", val)}
        >
          {(props) => <ParagraphInput {...props} disabled={!isEditing} />}
        </FormField>

        <FormField
          title="Description audio file (Q'anjob'al)"
          description={isEditing ? "Maximum size: 30MB" : ""}
          defaultClassName="max-w-[918px] mt-[10px] text-[15px]"
          value={fields.descriptionFile.value}
          onChange={handleDescriptionFileChange}
        >
          {(props) => (
            <FileUpload
              value={props.value}
              onChange={props.onChange}
              editable={isEditing}
              onDelete={handleDeleteDescriptionFile}
              state={getDescriptionFileUploadState()}
              extendedText={
                isEditing
                  ? "Upload an audio recording of the description in Q'anjob'al"
                  : ""
              }
              existingFile={
                clearExistingDescriptionFile
                  ? undefined
                  : existingDescriptionFileMetadata
              }
            />
          )}
        </FormField>

        {isEditing && (
          <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px]">
            <Button
              onClick={onClose}
              text="Cancel"
              defaultClassName="w-[141px] h-[60px] bg-gray-200 text-type-400 rounded-[10px] components-text"
              hoverClassName="hover:bg-gray-300"
            />
            <SubmitButton
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
              text="Save"
              defaultClassName="w-[141px] h-[60px] rounded-[10px] components-text"
            />
          </div>
        )}
      </div>
    </div>
  );
}
