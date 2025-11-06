import { TextInput } from "@/components/Input";
import FileUpload from "@/components/FileUpload";
import ParagraphInput from "@/components/ParagraphInput";
import FormField from "@/components/FormField";
import Dropdown from "@/components/Dropdown";
import SubmitButton from "@/components/SubmitButton";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@/lib/types";
import { VIDEO_TOPIC_DISPLAY_OPTIONS } from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import { useNotification } from "@/hooks/useNotification";
import {
  validateRequired,
  validateURL,
  validateFileSize,
} from "@/lib/validators";

export default function VideoUploadForm() {
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      resourceTitleEnglish: createField(""),
      resourceTitleQanjobal: createField(""),
      audioFile: createField<File | undefined>(undefined),
      topicDropdownIndex: createField<number | undefined>(undefined),
      videoLink: createField(""),
      descriptionEnglish: createField(""),
      descriptionQanjobal: createField(""),
    });

  const { showNotification, NotificationContainer } = useNotification();
  const addVideoMutation = trpc.videos.addVideo.useMutation();

  const submitForm = async () => {
    const isValid = validateAllFields({
      resourceTitleEnglish: validateRequired,
      resourceTitleQanjobal: validateRequired,
      audioFile: validateFileSize(30),
      topicDropdownIndex: validateRequired,
      videoLink: validateURL,
    });

    if (!isValid) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Audio = reader.result?.toString().split(",")[1];

      try {
        await addVideoMutation.mutateAsync({
          titleEnglish: fields.resourceTitleEnglish.value,
          titleQanjobal: fields.resourceTitleQanjobal.value,
          audioFile: base64Audio!,
          audioFilename: fields.audioFile.value!.name,
          audioFileSize: fields.audioFile.value!.size,
          topic: VIDEO_TOPIC_DISPLAY_OPTIONS[
            fields.topicDropdownIndex.value!
          ].toUpperCase() as VideoTopic,
          url: fields.videoLink.value,
          descriptionEnglish: fields.descriptionEnglish.value,
          descriptionQanjobal: fields.descriptionQanjobal.value,
        });

        showNotification("Video submitted successfully!");
        resetForm();
      } catch (err) {
        console.error(err);
        showNotification("Error submitting video.");
      }
    };

    reader.readAsDataURL(fields.audioFile.value!);
  };

  const getFileUploadState = () => {
    if (fields.audioFile.state === "error") return "error";
    if (fields.audioFile.value) return "complete";
    return "default";
  };

  return (
    <div className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-3xl bg-white">
      <div className="h-[60px] font-[500] text-2xl">Add new video</div>
      <div className="flex flex-row gap-[18px]">
        <FormField
          title="Resource title (English)"
          state={fields.resourceTitleEnglish.state}
          errorString={fields.resourceTitleEnglish.error}
          value={fields.resourceTitleEnglish.value}
          onChange={(val) => setFieldValue("resourceTitleEnglish", val)}
          defaultClassName="max-w-[450px]"
          required
        >
          {(props) => <TextInput {...props} />}
        </FormField>

        <FormField
          title="Resource title (Q'anjob'al)"
          state={fields.resourceTitleQanjobal.state}
          errorString={fields.resourceTitleQanjobal.error}
          value={fields.resourceTitleQanjobal.value}
          onChange={(val) => setFieldValue("resourceTitleQanjobal", val)}
          defaultClassName="max-w-[450px]"
          required
        >
          {(props) => <TextInput {...props} />}
        </FormField>
      </div>
      <FormField
        title="Title audio file (Q'anjob'al)"
        description="Maximum size: 30MB"
        state={fields.audioFile.state}
        errorString={fields.audioFile.error}
        value={fields.audioFile.value}
        onChange={(val) => setFieldValue("audioFile", val)}
        defaultClassName="max-w-[918px]"
        required
      >
        {(props) => (
          <FileUpload
            value={props.value}
            onChange={props.onChange}
            onDelete={() => setFieldValue("audioFile", undefined)}
            state={getFileUploadState()}
            extendedText="Upload an audio recording of the resource title in Q'anjob'al"
          />
        )}
      </FormField>
      <FormField
        title="Topic"
        state={fields.topicDropdownIndex.state}
        errorString={fields.topicDropdownIndex.error}
        value={fields.topicDropdownIndex.value}
        onChange={(val) => setFieldValue("topicDropdownIndex", val)}
        defaultClassName="max-w-[450px]"
        required
      >
        {(props) => (
          <Dropdown {...props} options={[...VIDEO_TOPIC_DISPLAY_OPTIONS]} />
        )}
      </FormField>
      <FormField
        title="Video link"
        state={fields.videoLink.state}
        errorString={fields.videoLink.error}
        value={fields.videoLink.value}
        onChange={(val) => setFieldValue("videoLink", val)}
        defaultClassName="max-w-[918px]"
        required
      >
        {(props) => <TextInput {...props} />}
      </FormField>
      <FormField
        title="Description (English)"
        defaultClassName="max-w-[918px]"
        value={fields.descriptionEnglish.value}
        onChange={(val) => setFieldValue("descriptionEnglish", val)}
      >
        {(props) => <ParagraphInput {...props} />}
      </FormField>
      <FormField
        title="Description (Q'anjob'al)"
        defaultClassName="max-w-[918px]"
        value={fields.descriptionQanjobal.value}
        onChange={(val) => setFieldValue("descriptionQanjobal", val)}
      >
        {(props) => <ParagraphInput {...props} />}
      </FormField>
      <div className="flex justify-end">
        <SubmitButton
          isLoading={addVideoMutation.isPending}
          text="Submit video"
          onClick={submitForm}
        />
      </div>
      <NotificationContainer />
    </div>
  );
}
