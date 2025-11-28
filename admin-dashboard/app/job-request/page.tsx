"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { TextInput } from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import RadioButtonGroup from "@/components/RadioButtonGroup";
import { trpc } from "@/lib/trpc";
import { JobType, LocationType, JobStatus } from "@prisma/client";
import { useForm, createField } from "@/hooks/useForm";
import { validateRequired, validateEmail } from "@/lib/validators";
import SubmitButton from "@/components/SubmitButton";
import { US_STATES } from "@/lib/constants";
import { X } from "lucide-react";
import PageBackground from "@/components/PageBackground";

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

export default function JobRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, setFieldValue, validateAllFields } = useForm({
    contactEmail: createField(""),
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
  });

  const addJobMutation = trpc.jobs.addJob.useMutation();

  const handleSubmit = async () => {
    const validationRules: any = {
      contactEmail: validateEmail,
      jobTitleEnglish: validateRequired,
      jobTitleQanjobal: validateRequired,
      companyName: validateRequired,
      jobTypeIndex: validateRequired,
      applicationLink: validateRequired,
    };

    const isValid = validateAllFields(validationRules);

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const jobTypeString = JOB_TYPE_OPTIONS[fields.jobTypeIndex.value!];
      const locationTypeString =
        fields.locationTypeIndex.value !== undefined
          ? LOCATION_TYPE_OPTIONS[fields.locationTypeIndex.value]
          : "Remote";

      await addJobMutation.mutateAsync({
        titleEnglish: fields.jobTitleEnglish.value,
        titleQanjobal: fields.jobTitleQanjobal.value,
        companyName: fields.companyName.value,
        businessContactEmail: fields.contactEmail.value,
        jobType: JOB_TYPE_TO_ENUM[jobTypeString],
        acceptedLanguages: fields.acceptedLanguages.value,
        locationType: LOCATION_TYPE_TO_ENUM[locationTypeString],
        city: fields.city.value || "",
        state:
          fields.stateIndex.value !== undefined
            ? US_STATES[fields.stateIndex.value]
            : "",
        url: fields.applicationLink.value,
        salary: fields.salary.value ? parseInt(fields.salary.value) : 0,
        expirationDate: fields.expirationDate.value
          ? new Date(fields.expirationDate.value)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
        descriptionEnglish: "",
        descriptionQanjobal: "",
        status: JobStatus.PENDING,
      });

      router.push("/job-request/success");
    } catch (error) {
      console.error("Failed to submit job request:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground>
      <div className="flex flex-col items-center w-full h-full overflow-y-auto px-6 lg:px-24 py-12">
        <h1 className="body1-desktop-semi-text text-type-400 text-center mb-5">
          Submit Job Posting
        </h1>

        <div className="bg-white rounded-[10px] shadow-[0px_4px_80px_0px_rgba(109,15,0,0.1)] w-full max-w-[699px] p-[26.48px] mb-12 relative">
          <div className="flex flex-col gap-[19.67px]">
            <p className="body2-desktop-text text-type-400">
              Submit a request for a job to be posted on the Jila mobile app.
            </p>

            <FormField
              title="Contact email"
              state={fields.contactEmail.state}
              errorString={fields.contactEmail.error}
              value={fields.contactEmail.value}
              onChange={(val) => setFieldValue("contactEmail", val)}
              defaultClassName="w-full text-[13.62px]"
              required
            >
              {(props) => (
                <TextInput
                  {...props}
                  placeholder="Enter your business email"
                  className="h-[60px]"
                />
              )}
            </FormField>

            <div className="flex gap-[13.62px]">
              <FormField
                title="Job title (English)"
                state={fields.jobTitleEnglish.state}
                errorString={fields.jobTitleEnglish.error}
                value={fields.jobTitleEnglish.value}
                onChange={(val) => setFieldValue("jobTitleEnglish", val)}
                defaultClassName="flex-1 text-[13.62px]"
                required
              >
                {(props) => (
                  <TextInput
                    {...props}
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
                defaultClassName="flex-1 text-[13.62px]"
                required
              >
                {(props) => (
                  <TextInput
                    {...props}
                    placeholder="Enter job title in Q'anjob'al"
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
                  placeholder="-- Select job type --"
                />
              )}
            </FormField>

            <div className="flex flex-col">
              <div className="h-[22.7px] font-normal text-[13.62px] leading-[18.92px] text-type-400">
                <span>Accepted languages</span>
              </div>
              <p className="font-normal text-[13.62px] leading-[18.92px] text-gray-400 h-[27.24px]">
                Choose tags to indicate language accessibility for this job
                posting
              </p>
              <div className="py-[7.57px]">
                <RadioButtonGroup
                  options={LANGUAGE_OPTIONS}
                  selectedOptions={fields.acceptedLanguages.value}
                  setSelectedOptions={(val) =>
                    setFieldValue("acceptedLanguages", val)
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
                  placeholder="-- Select location type --"
                />
              )}
            </FormField>

            <div className="flex gap-[13.62px]">
              <FormField
                title="City"
                state={fields.city.state}
                errorString={fields.city.error}
                value={fields.city.value}
                onChange={(val) => setFieldValue("city", val)}
                defaultClassName="flex-1 text-[13.62px]"
              >
                {(props) => (
                  <TextInput
                    {...props}
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
                defaultClassName="flex-1 text-[13.62px]"
              >
                {(props) => (
                  <Dropdown
                    {...props}
                    options={[...US_STATES]}
                    placeholder="-- Select state --"
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
              defaultClassName="w-full text-[13.62px]"
              required
            >
              {(props) => (
                <TextInput
                  {...props}
                  placeholder="Enter application link"
                  className="h-[60px]"
                />
              )}
            </FormField>

            <div className="flex gap-[13.62px]">
              <FormField
                title="Salary"
                state={fields.salary.state}
                errorString={fields.salary.error}
                value={fields.salary.value}
                onChange={(val) => setFieldValue("salary", val)}
                defaultClassName="flex-1 text-[13.62px]"
              >
                {(props) => (
                  <div className="relative">
                    <span className="absolute left-[18px] top-1/2 -translate-y-1/2 font-bold text-[13.62px] text-type-400">
                      $
                    </span>
                    <TextInput
                      {...props}
                      placeholder="Enter salary"
                      className="h-[60px] pl-[30px]"
                    />
                  </div>
                )}
              </FormField>

              <FormField
                title="Expiration date"
                state={fields.expirationDate.state}
                errorString={fields.expirationDate.error}
                value={fields.expirationDate.value}
                onChange={(val) => setFieldValue("expirationDate", val)}
                defaultClassName="flex-1 text-[13.62px]"
              >
                {(props) => (
                  <TextInput
                    {...props}
                    placeholder="mm/dd/yy"
                    className="h-[60px]"
                  />
                )}
              </FormField>
            </div>

            <div className="flex justify-end mt-[10px]">
              <SubmitButton
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Submitting..."
                text="Submit"
                defaultClassName="w-[124.84px] h-[60px] rounded-[10px] text-[13.62px]"
              />
            </div>
          </div>

          {/* Close button (X icon) in top right */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-[26.48px] right-[26.48px] cursor-pointer"
          >
            <X className="w-[18.16px] h-[18.16px] text-type-400" />
          </button>
        </div>
      </div>
    </PageBackground>
  );
}
