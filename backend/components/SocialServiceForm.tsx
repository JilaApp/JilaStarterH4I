import { useState } from "react";
import FormField from "./FormField";
import { TextInput } from "./Input/TextInput";
import FileUpload from "./FileUpload";
import Dropdown from "./Dropdown";
import ParagraphInput from "./ParagraphInput";
import Button from "./Button";
import Notification from "./Notification";
import { trpc } from "@/lib/trpc";
import { SocialServiceCategory } from "@/lib/types";
import {
  SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS,
  US_STATES,
} from "@/lib/constants";
import { useForm } from "@/hooks/useForm";

export default function SocialServiceForm() {
  const { fields, setFieldValue, setFieldError, resetForm } = useForm({
    englishTitle: { value: "", error: "", state: "default" as const },
    qanjobalTitle: { value: "", error: "", state: "default" as const },
    titleFile: {
      value: undefined as File | undefined,
      error: "",
      state: "default" as const,
    },
    topicIndex: {
      value: undefined as number | undefined,
      error: "",
      state: "default" as const,
    },
    phoneNumber: { value: "", error: "", state: "default" as const },
    addressLine: { value: "", error: "", state: "default" as const },
    city: { value: "", error: "", state: "default" as const },
    stateIndex: {
      value: undefined as number | undefined,
      error: "",
      state: "default" as const,
    },
    link: { value: "", error: "", state: "default" as const },
    englishDescription: { value: "", error: "", state: "default" as const },
    qanjobalDescription: { value: "", error: "", state: "default" as const },
    descriptionFile: {
      value: undefined as File | undefined,
      error: "",
      state: "default" as const,
    },
  });

  const [notification, setNotification] = useState<string | null>(null);
  const addSocialServiceMutation =
    trpc.socialServices.addSocialService.useMutation();

  const submitForm = async () => {
    let hasError = false;

    if (!fields.englishTitle.value) {
      setFieldError("englishTitle", "This field is required");
      hasError = true;
    }
    if (!fields.qanjobalTitle.value) {
      setFieldError("qanjobalTitle", "This field is required");
      hasError = true;
    }
    if (!fields.titleFile.value) {
      setFieldError("titleFile", "This field is required");
      hasError = true;
    }
    if (fields.topicIndex.value === undefined) {
      setFieldError("topicIndex", "This field is required");
      hasError = true;
    }
    if (!fields.phoneNumber.value) {
      setFieldError("phoneNumber", "This field is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      await addSocialServiceMutation.mutateAsync({
        title: fields.englishTitle.value,
        category: SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS[
          fields.topicIndex.value!
        ].toUpperCase() as SocialServiceCategory,
        phone_number: fields.phoneNumber.value,
        address: fields.addressLine.value || undefined,
        description: fields.englishDescription.value || undefined,
        url: fields.link.value || undefined,
      });

      setNotification("Social service submitted successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setNotification("Error submitting social service.");
    }
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-[24px] bg-white">
      <div className="h-[60px] font-[500] text-[24px]">
        Add new social service
      </div>

      <div className="flex flex-row gap-[18px]">
        <FormField
          title="Resource title (English)"
          state={fields.englishTitle.state}
          errorString={fields.englishTitle.error}
          value={fields.englishTitle.value}
          onChange={(val) => setFieldValue("englishTitle", val)}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormField>

        <FormField
          title="Resource title (Q'anjob'al)"
          state={fields.qanjobalTitle.state}
          errorString={fields.qanjobalTitle.error}
          value={fields.qanjobalTitle.value}
          onChange={(val) => setFieldValue("qanjobalTitle", val)}
          defaultClassName="max-w-[450px]"
          required
        >
          <TextInput />
        </FormField>
      </div>

      <FormField
        title="Title audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        state={fields.titleFile.state}
        errorString={fields.titleFile.error}
        value={fields.titleFile.value}
        onChange={(val) => setFieldValue("titleFile", val)}
        defaultClassName="max-w-[918px]"
        required
      >
        <FileUpload
          onDelete={() => setFieldValue("titleFile", undefined)}
          extendedText="Upload an audio recording of the resource title in Q'anjob'al"
        />
      </FormField>

      <FormField
        title="Topic"
        state={fields.topicIndex.state}
        errorString={fields.topicIndex.error}
        value={fields.topicIndex.value}
        onChange={(val) => setFieldValue("topicIndex", val)}
        defaultClassName="max-w-[450px]"
        required
      >
        <Dropdown options={[...SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS]} />
      </FormField>

      <FormField
        title="Phone number"
        state={fields.phoneNumber.state}
        errorString={fields.phoneNumber.error}
        value={fields.phoneNumber.value}
        onChange={(val) => setFieldValue("phoneNumber", val)}
        defaultClassName="max-w-[918px]"
        required
      >
        <TextInput />
      </FormField>

      <FormField
        title="Address line 1"
        state={fields.addressLine.state}
        errorString={fields.addressLine.error}
        value={fields.addressLine.value}
        onChange={(val) => setFieldValue("addressLine", val)}
        defaultClassName="max-w-[918px]"
      >
        <TextInput />
      </FormField>

      <div className="flex flex-row gap-[18px]">
        <FormField
          title="City"
          state={fields.city.state}
          errorString={fields.city.error}
          value={fields.city.value}
          onChange={(val) => setFieldValue("city", val)}
          defaultClassName="max-w-[450px]"
        >
          <TextInput />
        </FormField>

        <FormField
          title="State"
          state={fields.stateIndex.state}
          errorString={fields.stateIndex.error}
          value={fields.stateIndex.value}
          onChange={(val) => setFieldValue("stateIndex", val)}
          defaultClassName="max-w-[450px]"
        >
          <Dropdown options={[...US_STATES]} />
        </FormField>
      </div>

      <FormField
        title="Link to external website"
        state={fields.link.state}
        errorString={fields.link.error}
        value={fields.link.value}
        onChange={(val) => setFieldValue("link", val)}
        defaultClassName="max-w-[918px]"
      >
        <TextInput />
      </FormField>

      <FormField
        title="Description (English)"
        defaultClassName="max-w-[918px]"
        value={fields.englishDescription.value}
        onChange={(val) => setFieldValue("englishDescription", val)}
      >
        <ParagraphInput />
      </FormField>

      <FormField
        title="Description (Q'anjob'al)"
        defaultClassName="max-w-[918px]"
        value={fields.qanjobalDescription.value}
        onChange={(val) => setFieldValue("qanjobalDescription", val)}
      >
        <ParagraphInput />
      </FormField>

      <FormField
        title="Description audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        defaultClassName="max-w-[918px]"
        value={fields.descriptionFile.value}
        onChange={(val) => setFieldValue("descriptionFile", val)}
      >
        <FileUpload
          onDelete={() => setFieldValue("descriptionFile", undefined)}
          extendedText="Upload an audio recording of the description in Q'anjob'al"
        />
      </FormField>

      <div className="flex justify-end">
        <Button
          text={
            addSocialServiceMutation.isPending
              ? "Submitting..."
              : "Submit social service"
          }
          onClick={submitForm}
          disabled={addSocialServiceMutation.isPending}
          defaultClassName={
            addSocialServiceMutation.isPending
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        />
      </div>

      {notification && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]">
          <Notification
            message={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
