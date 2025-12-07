import FormField from "../forms/FormField";
import { TextInput } from "../ui/Input/TextInput";
import Dropdown from "../ui/Dropdown";
import RadioButtonGroup from "../forms/RadioButtonGroup";
import ParagraphInput from "../forms/ParagraphInput";
import CalendarInput from "../forms/CalendarInput";
import SubmitButton from "../ui/SubmitButton";
import { useForm, createField } from "@/hooks/useForm";
import { useNotification } from "@/hooks/useNotification";
import {
  validateRequired,
  validateURL,
  validateNumber,
  validateDropdownIndex,
  validateFutureDate,
} from "@/lib/validators";
import {
  US_STATES,
  JOB_TYPE_OPTIONS,
  JOB_TYPE_TO_ENUM,
  LOCATION_TYPE_OPTIONS,
  LOCATION_TYPE_TO_ENUM,
  LANGUAGE_OPTIONS,
  NAVIGATION_DELAY_MS,
} from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";
import { logger } from "@/lib/logger";
import FormError from "@/components/shared/FormError";

interface JobPostingFormProps {
  onBack?: () => void;
}

export default function JobPostingForm({ onBack }: JobPostingFormProps = {}) {
  const {
    fields,
    setFieldValue,
    setFieldError,
    resetForm,
    validateAllFields,
    formError,
    setFormError,
    formRef,
  } = useForm({
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
  const addJobMutation = trpc.jobs.addJobAsAdmin.useMutation();

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
      expirationDate: validateFutureDate,
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
        businessContactEmail: "",
        jobType: JOB_TYPE_TO_ENUM[jobTypeString],
        acceptedLanguages: fields.acceptedLanguages.value,
        locationType: LOCATION_TYPE_TO_ENUM[locationTypeString],
        city: fields.city.value,
        state: US_STATES[fields.stateIndex.value!],
        url: fields.applicationLink.value,
        salary: salaryValue,
        expirationDate: expirationDateValue,
        descriptionEnglish: fields.descriptionEnglish.value,
        descriptionQanjobal: fields.descriptionQanjobal.value,
      });

      showNotification("Job posting submitted successfully!");
      resetForm();
      if (onBack) {
        setTimeout(() => onBack(), NAVIGATION_DELAY_MS);
      }
    } catch (err: any) {
      logger.error("[submitForm] Failed to submit job posting", err);
      const errorMessage =
        err?.message || "Failed to submit job posting. Please try again.";
      setFormError(errorMessage);
    }
  };

  return (
    <div
      ref={formRef as React.RefObject<HTMLDivElement>}
      className="flex flex-col gap-[10px] w-full"
    >
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
          <div className="flex items-center gap-1 h-[30px] mb-1 font-normal text-lg">
            <span>Accepted languages</span>
          </div>
          <div className="font-normal text-lg text-gray-400 mb-[10px]">
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

        {formError && <FormError message={formError} />}

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
