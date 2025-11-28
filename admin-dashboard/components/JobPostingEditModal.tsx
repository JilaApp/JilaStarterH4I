import React, { useEffect, useState, useMemo, useRef } from "react";
import { X } from "lucide-react";
import FormField from "@/components/FormField";
import { TextInput } from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import ParagraphInput from "./ParagraphInput";
import RadioButtonGroup from "./RadioButtonGroup";
import CalendarInput from "./CalendarInput";
import { trpc } from "@/lib/trpc";
import { JobType, LocationType, JobStatus } from "@prisma/client";
import { US_STATES } from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import {
  validateRequired,
  validateURL,
  validateNumber,
  validateDropdownIndex,
} from "@/lib/validators";
import SubmitButton from "./SubmitButton";
import { useClickOutside } from "@/hooks/useClickOutside";

const JOB_TYPE_OPTIONS = [
  "Internship",
  "Full-time",
  "Part-time",
  "Temporary",
  "Freelance",
  "Seasonal",
] as const;

const JOB_TYPE_TO_ENUM: Record<string, JobType> = {
  Internship: JobType.INTERNSHIP,
  "Full-time": JobType.FULLTIME,
  "Part-time": JobType.PARTTIME,
  Temporary: JobType.TEMPORARY,
  Freelance: JobType.FREELANCE,
  Seasonal: JobType.SEASONAL,
};

const JOB_TYPE_FROM_ENUM: Record<JobType, string> = {
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FULLTIME]: "Full-time",
  [JobType.PARTTIME]: "Part-time",
  [JobType.TEMPORARY]: "Temporary",
  [JobType.FREELANCE]: "Freelance",
  [JobType.SEASONAL]: "Seasonal",
  [JobType.QANJOBAL]: "Q'anjob'al",
};

const LOCATION_TYPE_OPTIONS = ["Remote", "Hybrid", "In person"] as const;

const LOCATION_TYPE_TO_ENUM: Record<string, LocationType> = {
  Remote: LocationType.REMOTE,
  Hybrid: LocationType.HYBRID,
  "In person": LocationType.INPERSON,
};

const LOCATION_TYPE_FROM_ENUM: Record<LocationType, string> = {
  [LocationType.REMOTE]: "Remote",
  [LocationType.HYBRID]: "Hybrid",
  [LocationType.INPERSON]: "In person",
};

const LANGUAGE_OPTIONS = [
  { name: "Non-English", disabled: false },
  { name: "Spanish", disabled: false },
  { name: "Q'anjob'al", disabled: false },
];

interface JobData {
  id: string | number;
  titleEnglish: string;
  titleQanjobal: string;
  companyName: string;
  businessContactEmail: string;
  jobType: JobType;
  acceptedLanguages: string[];
  locationType: LocationType;
  city: string;
  state: string;
  url: string;
  salary: number;
  expirationDate: Date;
  descriptionEnglish: string;
  descriptionQanjobal: string;
  status: JobStatus;
}

interface JobPostingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplete?: () => void;
  isEditing?: boolean;
  jobData?: JobData | null;
}

export default function JobPostingEditModal({
  isOpen,
  onClose,
  onUpdateComplete,
  isEditing = true,
  jobData,
}: JobPostingEditModalProps) {
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      jobTitleEnglish: createField(""),
      jobTitleQanjobal: createField(""),
      companyName: createField(""),
      businessContactEmail: createField(""),
      jobTypeIndex: createField<number | undefined>(undefined),
      acceptedLanguages: createField<string[]>([]),
      locationTypeIndex: createField<number | undefined>(undefined),
      city: createField(""),
      stateIndex: createField<number | undefined>(undefined),
      applicationLink: createField(""),
      salary: createField(""),
      expirationDate: createField(""),
      descriptionEnglish: createField(""),
      descriptionQanjobal: createField(""),
    });

  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const updateJobMutation = trpc.jobs.updateJob.useMutation();
  const addJobMutation = trpc.jobs.addJob.useMutation();

  useClickOutside(modalRef, () => {
    if (!isSaving) {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (jobData) {
        // Edit mode - populate with existing data
        setFieldValue("jobTitleEnglish", jobData.titleEnglish || "");
        setFieldValue("jobTitleQanjobal", jobData.titleQanjobal || "");
        setFieldValue("companyName", jobData.companyName || "");
        setFieldValue(
          "businessContactEmail",
          jobData.businessContactEmail || "",
        );
        setFieldValue("city", jobData.city || "");
        setFieldValue("applicationLink", jobData.url || "");
        setFieldValue("salary", jobData.salary?.toString() || "");
        setFieldValue(
          "expirationDate",
          jobData.expirationDate
            ? new Date(jobData.expirationDate).toISOString().split("T")[0]
            : "",
        );
        setFieldValue("descriptionEnglish", jobData.descriptionEnglish || "");
        setFieldValue("descriptionQanjobal", jobData.descriptionQanjobal || "");
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

        const stateIndex = US_STATES.findIndex(
          (state) => state === jobData.state,
        );
        setFieldValue("stateIndex", stateIndex !== -1 ? stateIndex : undefined);
      } else {
        // Create mode - reset form
        resetForm();
      }
    }
  }, [isOpen, jobData?.id]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleSave = async () => {
    // Only require businessContactEmail if job was created by a business (has existing email)
    const validationRules: any = {
      jobTitleEnglish: validateRequired,
      jobTitleQanjobal: validateRequired,
      companyName: validateRequired,
      jobTypeIndex: validateDropdownIndex,
      locationTypeIndex: validateDropdownIndex,
      city: validateRequired,
      stateIndex: validateDropdownIndex,
      applicationLink: validateURL,
      salary: validateNumber,
      expirationDate: validateRequired,
      descriptionEnglish: validateRequired,
      descriptionQanjobal: validateRequired,
    };

    // Only validate businessContactEmail if it's a business-created job
    if (jobData?.businessContactEmail) {
      validationRules.businessContactEmail = validateRequired;
    }

    const isValid = validateAllFields(validationRules);

    if (!isValid) return;

    setIsSaving(true);

    try {
      const jobTypeString = JOB_TYPE_OPTIONS[fields.jobTypeIndex.value!];
      const locationTypeString =
        LOCATION_TYPE_OPTIONS[fields.locationTypeIndex.value!];

      const salaryValue = fields.salary.value
        ? parseInt(fields.salary.value)
        : 0;
      const expirationDateValue = fields.expirationDate.value
        ? new Date(fields.expirationDate.value + "T00:00:00.000Z")
        : new Date();

      const jobPayload: any = {
        titleEnglish: fields.jobTitleEnglish.value,
        titleQanjobal: fields.jobTitleQanjobal.value,
        companyName: fields.companyName.value,
        businessContactEmail: fields.businessContactEmail.value || "", // Empty string if no business email
        jobType: JOB_TYPE_TO_ENUM[jobTypeString],
        acceptedLanguages: fields.acceptedLanguages.value,
        locationType: LOCATION_TYPE_TO_ENUM[locationTypeString],
        city: fields.city.value,
        state: US_STATES[fields.stateIndex.value!],
        url: fields.applicationLink.value,
        salary: salaryValue,
        expirationDate: expirationDateValue as any, // tRPC will handle Date serialization
        descriptionEnglish: fields.descriptionEnglish.value,
        descriptionQanjobal: fields.descriptionQanjobal.value,
      };

      if (jobData) {
        // Update existing job
        await updateJobMutation.mutateAsync({
          id: jobData.id as number,
          ...jobPayload,
        });
      } else {
        // Create new job
        await addJobMutation.mutateAsync(jobPayload);
      }

      setIsSaving(false);
      onUpdateComplete?.();
      onClose();
    } catch (error) {
      console.error(`Failed to ${jobData ? "update" : "create"} job:`, error);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div
        ref={modalRef}
        className="relative flex flex-col bg-white rounded-[10px] w-[49%] h-[90%] p-[26.48px] overflow-y-auto"
      >
        <div className="flex flex-col gap-[19.67px] items-start w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col w-[353px]">
              <p className="font-bold text-[18.16px] leading-[21.19px] text-type-400">
                {jobData
                  ? isEditing
                    ? `Edit "${jobData.titleEnglish}"`
                    : jobData.titleEnglish
                  : "Add new job posting"}
              </p>
              {!isEditing && jobData?.businessContactEmail && (
                <p className="font-normal text-[13.62px] leading-[30px] text-black mt-1">
                  <span>Business contact email: </span>
                  <span className="font-bold text-jila-400">
                    {jobData.businessContactEmail}
                  </span>
                </p>
              )}
            </div>
            <button onClick={onClose} className="cursor-pointer">
              <X className="w-[18.16px] h-[18.16px]" />
            </button>
          </div>

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
            defaultClassName="w-[646px] text-[13.62px]"
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
            defaultClassName="w-[645.39px] text-[13.62px]"
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
            defaultClassName="w-[645.39px] text-[13.62px]"
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

          <div className="flex gap-[13.62px] w-full">
            <FormField
              title="City"
              state={fields.city.state}
              errorString={fields.city.error}
              value={fields.city.value}
              onChange={(val) => setFieldValue("city", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
            >
              {(props) => (
                <TextInput
                  {...props}
                  disabled={!isEditing}
                  placeholder="Enter city"
                  className="h-[60px]"
                />
              )}
            </FormField>

            <FormField
              title="State"
              state={fields.stateIndex.state}
              errorString={fields.stateIndex.error}
              value={fields.stateIndex.value}
              onChange={(val) => setFieldValue("stateIndex", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
            >
              {(props) => (
                <Dropdown
                  {...props}
                  options={[...US_STATES]}
                  placeholder="Select state"
                  disabled={!isEditing}
                />
              )}
            </FormField>
          </div>

          <FormField
            title="Application link"
            state={fields.applicationLink.state}
            errorString={fields.applicationLink.error}
            value={fields.applicationLink.value}
            onChange={(val) => setFieldValue("applicationLink", val)}
            defaultClassName="w-[646px] text-[13.62px]"
            required
          >
            {(props) => (
              <TextInput
                {...props}
                disabled={!isEditing}
                placeholder="Enter link to the application"
                className="h-[60px]"
              />
            )}
          </FormField>

          <div className="flex gap-[13.62px] w-full">
            <FormField
              title="Salary"
              state={fields.salary.state}
              errorString={fields.salary.error}
              value={fields.salary.value}
              onChange={(val) => setFieldValue("salary", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
            >
              {(props) => (
                <TextInput
                  {...props}
                  disabled={!isEditing}
                  placeholder="Enter salary"
                  className="h-[60px]"
                />
              )}
            </FormField>

            <FormField
              title="Expiration date"
              state={fields.expirationDate.state}
              errorString={fields.expirationDate.error}
              value={fields.expirationDate.value}
              onChange={(val) => setFieldValue("expirationDate", val)}
              defaultClassName="flex-[1_0_0] text-[13.62px]"
            >
              {(props) => <CalendarInput {...props} disabled={!isEditing} />}
            </FormField>
          </div>

          <FormField
            title="Description (English)"
            state={fields.descriptionEnglish.state}
            errorString={fields.descriptionEnglish.error}
            defaultClassName="w-[645.39px] text-[13.62px]"
            value={fields.descriptionEnglish.value}
            onChange={(val) => setFieldValue("descriptionEnglish", val)}
          >
            {(props) => (
              <ParagraphInput
                {...props}
                disabled={!isEditing}
                placeholder="Add a description to inform viewers about this video"
              />
            )}
          </FormField>

          <FormField
            title="Description (Q'anjob'al)"
            state={fields.descriptionQanjobal.state}
            errorString={fields.descriptionQanjobal.error}
            defaultClassName="w-[645.39px] text-[13.62px]"
            value={fields.descriptionQanjobal.value}
            onChange={(val) => setFieldValue("descriptionQanjobal", val)}
          >
            {(props) => (
              <ParagraphInput
                {...props}
                disabled={!isEditing}
                placeholder="Add a description to inform viewers about this video in Q'anjob'al"
              />
            )}
          </FormField>

          {isEditing && (
            <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px] w-full">
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
    </div>
  );
}
