import React, { useEffect, useState, useRef } from "react";
import { X, Pencil } from "lucide-react";
import FormField from "@/components/forms/FormField";
import { TextInput } from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import RadioButtonGroup from "@/components/forms/RadioButtonGroup";
import { trpc } from "@/lib/trpc";
import { JobStatus, JobType, LocationType } from "@prisma/client";
import {
  JOB_TYPE_OPTIONS,
  JOB_TYPE_TO_ENUM,
  JOB_TYPE_FROM_ENUM,
  LOCATION_TYPE_OPTIONS,
  LOCATION_TYPE_TO_ENUM,
  LOCATION_TYPE_FROM_ENUM,
  LANGUAGE_OPTIONS,
} from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import { validateRequired, validateDropdownIndex } from "@/lib/validators";
import SubmitButton from "@/components/ui/SubmitButton";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useModalOverflow } from "@/hooks/useModalOverflow";
import FormError from "@/components/shared/FormError";
import { logger } from "@/lib/logger";
import { JobData } from "@/lib/types";

interface JobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onDeny?: () => void;
  onUpdateComplete?: () => void;
  jobData?: JobData | null;
}

export default function JobRequestModal({
  isOpen,
  onClose,
  onApprove,
  onDeny,
  onUpdateComplete,
  jobData,
}: JobRequestModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      jobTitleEnglish: createField(""),
      jobTitleQanjobal: createField(""),
      companyName: createField(""),
      businessContactEmail: createField(""),
      jobTypeIndex: createField<number | undefined>(undefined),
      acceptedLanguages: createField<string[]>([]),
      locationTypeIndex: createField<number | undefined>(undefined),
    });

  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const updateJobMutation = trpc.jobs.updateJob.useMutation();

  useClickOutside(modalRef, () => {
    if (!isSaving) {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen && jobData) {
      setError("");
      setFieldValue("jobTitleEnglish", jobData.titleEnglish || "");
      setFieldValue("jobTitleQanjobal", jobData.titleQanjobal || "");
      setFieldValue("companyName", jobData.companyName || "");
      setFieldValue("businessContactEmail", jobData.businessContactEmail || "");
      setFieldValue("acceptedLanguages", jobData.acceptedLanguages || []);

      const jobTypeIndex = JOB_TYPE_OPTIONS.findIndex(
        (option) => JOB_TYPE_TO_ENUM[option] === jobData.jobType,
      );
      setFieldValue(
        "jobTypeIndex",
        jobTypeIndex !== -1 ? jobTypeIndex : undefined,
      );

      const locationTypeIndex = LOCATION_TYPE_OPTIONS.findIndex(
        (option) => LOCATION_TYPE_TO_ENUM[option] === jobData.locationType,
      );
      setFieldValue(
        "locationTypeIndex",
        locationTypeIndex !== -1 ? locationTypeIndex : undefined,
      );

      setIsEditing(false);
    }
  }, [isOpen, jobData, setFieldValue]);

  useModalOverflow(isOpen);

  const handleSave = async () => {
    const validationRules: any = {
      jobTitleEnglish: validateRequired,
      jobTitleQanjobal: validateRequired,
      companyName: validateRequired,
      businessContactEmail: validateRequired,
      jobTypeIndex: validateDropdownIndex,
      locationTypeIndex: validateDropdownIndex,
    };

    const isValid = validateAllFields(validationRules);

    if (!isValid) return;

    setIsSaving(true);

    try {
      const jobTypeString = JOB_TYPE_OPTIONS[fields.jobTypeIndex.value!];
      const locationTypeString =
        LOCATION_TYPE_OPTIONS[fields.locationTypeIndex.value!];

      await updateJobMutation.mutateAsync({
        id: jobData!.id as number,
        titleEnglish: fields.jobTitleEnglish.value,
        titleQanjobal: fields.jobTitleQanjobal.value,
        companyName: fields.companyName.value,
        businessContactEmail: fields.businessContactEmail.value,
        jobType: JOB_TYPE_TO_ENUM[jobTypeString],
        acceptedLanguages: fields.acceptedLanguages.value,
        locationType: LOCATION_TYPE_TO_ENUM[locationTypeString],
      });

      setIsSaving(false);
      setIsEditing(false);
      onUpdateComplete?.();
      onClose();
    } catch (error: any) {
      logger.error("[handleSave] Failed to update job request", error);

      let errorMessage = "Failed to update job request. Please try again.";

      if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setIsSaving(false);
    }
  };

  const handleApprove = () => {
    onApprove?.();
    onClose();
  };

  const handleDeny = () => {
    onDeny?.();
    onClose();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (jobData) {
      setFieldValue("jobTitleEnglish", jobData.titleEnglish || "");
      setFieldValue("jobTitleQanjobal", jobData.titleQanjobal || "");
      setFieldValue("companyName", jobData.companyName || "");
      setFieldValue("businessContactEmail", jobData.businessContactEmail || "");
      setFieldValue("acceptedLanguages", jobData.acceptedLanguages || []);

      const jobTypeIndex = JOB_TYPE_OPTIONS.findIndex(
        (option) => JOB_TYPE_TO_ENUM[option] === jobData.jobType,
      );
      setFieldValue(
        "jobTypeIndex",
        jobTypeIndex !== -1 ? jobTypeIndex : undefined,
      );

      const locationTypeIndex = LOCATION_TYPE_OPTIONS.findIndex(
        (option) => LOCATION_TYPE_TO_ENUM[option] === jobData.locationType,
      );
      setFieldValue(
        "locationTypeIndex",
        locationTypeIndex !== -1 ? locationTypeIndex : undefined,
      );
    }
    setIsEditing(false);
  };

  if (!isOpen || !jobData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div
        ref={modalRef}
        className="relative flex flex-col bg-white rounded-[10px] w-[49%] max-h-[90%] p-[26.48px] overflow-y-auto"
      >
        <div className="flex flex-col gap-[19.67px] items-start w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-[10px]">
              <p className="font-bold text-[18.16px] leading-[21.19px] text-type-400">
                {jobData.titleEnglish}
              </p>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-[5px] text-gray-300 hover:text-gray-400 cursor-pointer"
                >
                  <Pencil size={14} />
                  <span className="font-normal text-[13.62px]">
                    Edit job request
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-[5px] text-jila-400">
                  <Pencil size={14} />
                  <span className="font-normal text-[13.62px]">Editing</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="cursor-pointer">
              <X className="w-[18.16px] h-[18.16px]" />
            </button>
          </div>

          <FormField
            title="Contact email"
            state={fields.businessContactEmail.state}
            errorString={fields.businessContactEmail.error}
            value={fields.businessContactEmail.value}
            onChange={(val) => setFieldValue("businessContactEmail", val)}
            defaultClassName="w-full text-[13.62px]"
            required
          >
            {(props) => (
              <TextInput
                {...props}
                disabled={!isEditing}
                placeholder="Enter contact email"
                className="h-[60px]"
              />
            )}
          </FormField>

          <div className="flex gap-[13.62px] w-full">
            <FormField
              title="Job title (English)"
              state={fields.jobTitleEnglish.state}
              errorString={fields.jobTitleEnglish.error}
              value={fields.jobTitleEnglish.value}
              onChange={(val) => setFieldValue("jobTitleEnglish", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
              required
            >
              {(props) => (
                <TextInput
                  {...props}
                  disabled={!isEditing}
                  placeholder="Enter job title"
                  className="h-[60px]"
                />
              )}
            </FormField>

            <FormField
              title="Job title (Q'anjob'al)"
              state={fields.jobTitleQanjobal.state}
              errorString={fields.jobTitleQanjobal.error}
              value={fields.jobTitleQanjobal.value}
              onChange={(val) => setFieldValue("jobTitleQanjobal", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
              required
            >
              {(props) => (
                <TextInput
                  {...props}
                  disabled={!isEditing}
                  placeholder="Enter job title"
                  className="h-[60px]"
                />
              )}
            </FormField>
          </div>

          <FormField
            title="Company name"
            state={fields.companyName.state}
            errorString={fields.companyName.error}
            value={fields.companyName.value}
            onChange={(val) => setFieldValue("companyName", val)}
            defaultClassName="w-full text-[13.62px]"
            required
          >
            {(props) => (
              <TextInput
                {...props}
                disabled={!isEditing}
                placeholder="Enter company name"
                className="h-[60px]"
              />
            )}
          </FormField>

          <FormField
            title="Job type"
            state={fields.jobTypeIndex.state}
            errorString={fields.jobTypeIndex.error}
            value={fields.jobTypeIndex.value}
            onChange={(val) => setFieldValue("jobTypeIndex", val)}
            defaultClassName="w-full text-[13.62px]"
            required
          >
            {(props) => (
              <Dropdown
                {...props}
                options={[...JOB_TYPE_OPTIONS]}
                placeholder="Select job type"
                disabled={!isEditing}
              />
            )}
          </FormField>

          <div className="flex flex-col w-full">
            <div className="h-[22.7px] font-normal text-[13.62px] leading-[18.92px] text-type-400 mb-1">
              <span>Accepted languages</span>
            </div>
            <p className="font-normal text-[13.62px] leading-[18.92px] text-gray-400 h-[27.24px]">
              Choose tags to indicate language accessibility for this job
              posting
            </p>
            <div className="py-[7.57px]">
              <RadioButtonGroup
                options={LANGUAGE_OPTIONS.map((opt) => ({
                  ...opt,
                  disabled: !isEditing,
                }))}
                selectedOptions={fields.acceptedLanguages.value}
                setSelectedOptions={(val) =>
                  isEditing && setFieldValue("acceptedLanguages", val)
                }
              />
            </div>
          </div>

          <FormField
            title="Location type"
            state={fields.locationTypeIndex.state}
            errorString={fields.locationTypeIndex.error}
            value={fields.locationTypeIndex.value}
            onChange={(val) => setFieldValue("locationTypeIndex", val)}
            defaultClassName="w-full text-[13.62px]"
          >
            {(props) => (
              <Dropdown
                {...props}
                options={[...LOCATION_TYPE_OPTIONS]}
                placeholder="Select location"
                disabled={!isEditing}
              />
            )}
          </FormField>

          {error && <FormError message={error} />}

          {!isEditing ? (
            jobData.status === JobStatus.PENDING ? (
              <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px] w-full">
                <Button
                  onClick={handleDeny}
                  text="Deny"
                  defaultClassName="w-[141px] h-[60px] bg-error-200 text-error-400 rounded-[10px] components-text"
                  hoverClassName="hover:bg-error-300"
                />
                <Button
                  onClick={handleApprove}
                  text="Approve"
                  defaultClassName="w-[141px] h-[60px] bg-green-200 text-green-400 rounded-[10px] components-text"
                  hoverClassName="hover:bg-green-300"
                />
              </div>
            ) : null
          ) : (
            <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px] w-full">
              <Button
                onClick={handleCancelEdit}
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
    </div>
  );
}
