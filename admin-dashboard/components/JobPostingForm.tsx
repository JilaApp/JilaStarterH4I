import FormField from "./FormField";
import { TextInput } from "./Input/TextInput";
import Dropdown from "./Dropdown";
import RadioButtonGroup from "./RadioButtonGroup";
import ParagraphInput from "./ParagraphInput";
import CalendarInput from "./CalendarInput";
import SubmitButton from "./SubmitButton";
import { useForm, createField } from "@/hooks/useForm";
import { useNotification } from "@/hooks/useNotification";
import {
  validateRequired,
  validateURL,
  validateNumber,
  validateDropdownIndex,
} from "@/lib/validators";
import { US_STATES } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { JobType, LocationType } from "@prisma/client";
import { ArrowLeft } from "lucide-react";

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

const LOCATION_TYPE_OPTIONS = ["Remote", "Hybrid", "In person"] as const;

const LOCATION_TYPE_TO_ENUM: Record<string, LocationType> = {
  Remote: LocationType.REMOTE,
  Hybrid: LocationType.HYBRID,
  "In person": LocationType.INPERSON,
};

const LANGUAGE_OPTIONS = [
  { name: "Non-English", disabled: false },
  { name: "Spanish", disabled: false },
  { name: "Q'anjob'al", disabled: false },
];

interface JobPostingFormProps {
  onBack?: () => void;
}

export default function JobPostingForm({ onBack }: JobPostingFormProps = {}) {
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      jobTitleEnglish: createField(""),
      jobTitleQanjobal: createField(""),
      companyName: createField(""),
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

  const { showNotification, NotificationContainer } = useNotification();
  const addJobMutation = trpc.jobs.addJob.useMutation();

  const submitForm = async () => {
    const isValid = validateAllFields({
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
    });

    if (!isValid) return;

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

      await addJobMutation.mutateAsync({
        titleEnglish: fields.jobTitleEnglish.value,
        titleQanjobal: fields.jobTitleQanjobal.value,
        companyName: fields.companyName.value,
        businessContactEmail: "", // Admin-created jobs don't have business email
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
      });

      showNotification("Job posting submitted successfully!");
      resetForm();
      if (onBack) {
        setTimeout(() => onBack(), 1000);
      }
    } catch (err) {
      console.error(err);
      showNotification("Error submitting job posting.");
    }
  };

  return (
    <div className="flex flex-col gap-[10px] w-full">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-[38px] mb-[10px] cursor-pointer"
        >
          <ArrowLeft size={24} className="text-black" />
          <p className="font-normal text-lg text-black">
            Back to job board management
          </p>
        </button>
      )}
      <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-3xl bg-white shadow-[0px_4px_80px_0px_rgba(109,15,0,0.1)]">
        <div className="h-[60px] font-semibold text-2xl">
          Add new job posting
        </div>

        <div className="flex flex-row gap-[18px]">
          <FormField
            title="Job title (English)"
            state={fields.jobTitleEnglish.state}
            errorString={fields.jobTitleEnglish.error}
            value={fields.jobTitleEnglish.value}
            onChange={(val) => setFieldValue("jobTitleEnglish", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => <TextInput {...props} placeholder="Enter job title" />}
          </FormField>

          <FormField
            title="Job title (Q'anjob'al)"
            state={fields.jobTitleQanjobal.state}
            errorString={fields.jobTitleQanjobal.error}
            value={fields.jobTitleQanjobal.value}
            onChange={(val) => setFieldValue("jobTitleQanjobal", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => <TextInput {...props} placeholder="Enter job title" />}
          </FormField>
        </div>

        <FormField
          title="Company name"
          state={fields.companyName.state}
          errorString={fields.companyName.error}
          value={fields.companyName.value}
          onChange={(val) => setFieldValue("companyName", val)}
          defaultClassName="max-w-[918px]"
          required
        >
          {(props) => <TextInput {...props} placeholder="Enter company name" />}
        </FormField>

        <FormField
          title="Job type"
          state={fields.jobTypeIndex.state}
          errorString={fields.jobTypeIndex.error}
          value={fields.jobTypeIndex.value}
          onChange={(val) => setFieldValue("jobTypeIndex", val)}
          defaultClassName="max-w-[450px]"
          required
        >
          {(props) => (
            <Dropdown
              {...props}
              options={[...JOB_TYPE_OPTIONS]}
              placeholder="Select job type"
            />
          )}
        </FormField>

        <div className="flex flex-col max-w-[652px]">
          <div className="flex items-center gap-1 h-[30px] mb-1 font-[400] text-lg">
            <span>Accepted languages</span>
          </div>
          <div className="font-[400] text-lg text-gray-400 mb-[10px]">
            Select the options to indicate language accessibility for this job
            posting
          </div>
          <RadioButtonGroup
            options={LANGUAGE_OPTIONS}
            selectedOptions={fields.acceptedLanguages.value}
            setSelectedOptions={(val) =>
              setFieldValue("acceptedLanguages", val)
            }
          />
        </div>

        <FormField
          title="Location type"
          state={fields.locationTypeIndex.state}
          errorString={fields.locationTypeIndex.error}
          value={fields.locationTypeIndex.value}
          onChange={(val) => setFieldValue("locationTypeIndex", val)}
          defaultClassName="max-w-[918px]"
          required
        >
          {(props) => (
            <Dropdown
              {...props}
              options={[...LOCATION_TYPE_OPTIONS]}
              placeholder="Select location"
            />
          )}
        </FormField>

        <div className="flex flex-row gap-[18px]">
          <FormField
            title="City"
            state={fields.city.state}
            errorString={fields.city.error}
            value={fields.city.value}
            onChange={(val) => setFieldValue("city", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => <TextInput {...props} placeholder="Enter city" />}
          </FormField>

          <FormField
            title="State"
            state={fields.stateIndex.state}
            errorString={fields.stateIndex.error}
            value={fields.stateIndex.value}
            onChange={(val) => setFieldValue("stateIndex", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => (
              <Dropdown
                {...props}
                options={[...US_STATES]}
                placeholder="Select state"
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
          defaultClassName="max-w-[918px]"
          required
        >
          {(props) => (
            <TextInput {...props} placeholder="Enter link to the application" />
          )}
        </FormField>

        <div className="flex flex-row gap-[18px]">
          <FormField
            title="Salary"
            state={fields.salary.state}
            errorString={fields.salary.error}
            value={fields.salary.value}
            onChange={(val) => setFieldValue("salary", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => <TextInput {...props} placeholder="Enter salary" />}
          </FormField>

          <FormField
            title="Expiration date"
            state={fields.expirationDate.state}
            errorString={fields.expirationDate.error}
            value={fields.expirationDate.value}
            onChange={(val) => setFieldValue("expirationDate", val)}
            defaultClassName="max-w-[450px]"
            required
          >
            {(props) => <CalendarInput {...props} />}
          </FormField>
        </div>

        <FormField
          title="Description (English)"
          state={fields.descriptionEnglish.state}
          errorString={fields.descriptionEnglish.error}
          defaultClassName="max-w-[918px]"
          value={fields.descriptionEnglish.value}
          onChange={(val) => setFieldValue("descriptionEnglish", val)}
          required
        >
          {(props) => (
            <ParagraphInput
              {...props}
              placeholder="Add a description regarding the job posting"
            />
          )}
        </FormField>

        <FormField
          title="Description (Q'anjob'al)"
          state={fields.descriptionQanjobal.state}
          errorString={fields.descriptionQanjobal.error}
          defaultClassName="max-w-[918px]"
          value={fields.descriptionQanjobal.value}
          onChange={(val) => setFieldValue("descriptionQanjobal", val)}
          required
        >
          {(props) => (
            <ParagraphInput
              {...props}
              placeholder="Add a description regarding the job posting in Q'anjob'al"
            />
          )}
        </FormField>

        <div className="flex justify-end">
          <SubmitButton
            isLoading={addJobMutation.isPending}
            text="Submit job posting"
            onClick={submitForm}
          />
        </div>

        <NotificationContainer />
      </div>
    </div>
  );
}
