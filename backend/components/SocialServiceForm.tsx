import FormField from "./FormField";
import { TextInput } from "./Input/TextInput";
import FileUpload from "./FileUpload";
import Dropdown from "./Dropdown";
import ParagraphInput from "./ParagraphInput";
import SubmitButton from "./SubmitButton";
import { trpc } from "@/lib/trpc";
import { SocialServiceCategory } from "@/lib/types";
import {
  SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS,
  US_STATES,
} from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import { useNotification } from "@/hooks/useNotification";
import {
  validateRequired,
  validatePhone,
  validateURL,
  validateFileSize,
} from "@/lib/validators";

export default function SocialServiceForm() {
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

  const { showNotification, NotificationContainer } = useNotification();
  const addSocialServiceMutation =
    trpc.socialServices.addSocialService.useMutation();

  const submitForm = async () => {
    const isValid = validateAllFields({
      englishTitle: validateRequired,
      qanjobalTitle: validateRequired,
      titleFile: validateFileSize(30),
      topicIndex: validateRequired,
      phoneNumber: validatePhone,
      link: fields.link.value ? validateURL : undefined,
    });

    if (!isValid) return;

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

      showNotification("Social service submitted successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      showNotification("Error submitting social service.");
    }
  };

  const getTitleFileUploadState = () => {
    if (fields.titleFile.state === "error") return "error";
    if (fields.titleFile.value) return "complete";
    return "default";
  };

  const getDescriptionFileUploadState = () => {
    if (fields.descriptionFile.state === "error") return "error";
    if (fields.descriptionFile.value) return "complete";
    return "default";
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-3xl bg-white">
      <div className="h-[60px] font-[500] text-2xl">Add new social service</div>

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
          {(props) => (
            <TextInput {...props} state={fields.englishTitle.state} />
          )}
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
          {(props) => (
            <TextInput {...props} state={fields.qanjobalTitle.state} />
          )}
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
        {(props) => (
          <FileUpload
            value={props.value}
            onChange={props.onChange}
            onDelete={() => setFieldValue("titleFile", undefined)}
            state={getTitleFileUploadState()}
            extendedText="Upload an audio recording of the resource title in Q'anjob'al"
          />
        )}
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
        {(props) => (
          <Dropdown
            {...props}
            state={fields.topicIndex.state === "error" ? "error" : "default"}
            options={[...SOCIAL_SERVICE_CATEGORY_DISPLAY_OPTIONS]}
          />
        )}
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
        {(props) => <TextInput {...props} state={fields.phoneNumber.state} />}
      </FormField>

      <FormField
        title="Address line 1"
        state={fields.addressLine.state}
        errorString={fields.addressLine.error}
        value={fields.addressLine.value}
        onChange={(val) => setFieldValue("addressLine", val)}
        defaultClassName="max-w-[918px]"
      >
        {(props) => <TextInput {...props} state={fields.addressLine.state} />}
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
          {(props) => <TextInput {...props} state={fields.city.state} />}
        </FormField>

        <FormField
          title="State"
          state={fields.stateIndex.state}
          errorString={fields.stateIndex.error}
          value={fields.stateIndex.value}
          onChange={(val) => setFieldValue("stateIndex", val)}
          defaultClassName="max-w-[450px]"
        >
          {(props) => (
            <Dropdown
              {...props}
              state={fields.stateIndex.state === "error" ? "error" : "default"}
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
        defaultClassName="max-w-[918px]"
      >
        {(props) => <TextInput {...props} state={fields.link.state} />}
      </FormField>

      <FormField
        title="Description (English)"
        defaultClassName="max-w-[918px]"
        value={fields.englishDescription.value}
        onChange={(val) => setFieldValue("englishDescription", val)}
      >
        {(props) => <ParagraphInput {...props} />}
      </FormField>

      <FormField
        title="Description (Q'anjob'al)"
        defaultClassName="max-w-[918px]"
        value={fields.qanjobalDescription.value}
        onChange={(val) => setFieldValue("qanjobalDescription", val)}
      >
        {(props) => <ParagraphInput {...props} />}
      </FormField>

      <FormField
        title="Description audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        defaultClassName="max-w-[918px]"
        value={fields.descriptionFile.value}
        onChange={(val) => setFieldValue("descriptionFile", val)}
      >
        {(props) => (
          <FileUpload
            value={props.value}
            onChange={props.onChange}
            onDelete={() => setFieldValue("descriptionFile", undefined)}
            state={getDescriptionFileUploadState()}
            extendedText="Upload an audio recording of the description in Q'anjob'al"
          />
        )}
      </FormField>

      <div className="flex justify-end">
        <SubmitButton
          isLoading={addSocialServiceMutation.isPending}
          text="Submit social service"
          onClick={submitForm}
        />
      </div>

      <NotificationContainer />
    </div>
  );
}
