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
import { Plus, Trash2 } from "lucide-react";

export default function VideoUploadForm() {
  const { fields, setFieldValue, setFieldError, resetForm, validateAllFields } =
    useForm({
      resourceTitleEnglish: createField(""),
      resourceTitleQanjobal: createField(""),
      audioFile: createField<File | undefined>(undefined),
      topicDropdownIndex: createField<number | undefined>(undefined),
      videoLinks: createField<string[]>([""]),
      descriptionEnglish: createField(""),
      descriptionQanjobal: createField(""),
    });

  const { showNotification, NotificationContainer } = useNotification();
  const addVideoMutation = trpc.videos.addVideo.useMutation();

  const validateAll = () => {
    const currentLinks = fields.videoLinks.value;
    if (!currentLinks || currentLinks.length == 0) {
      return "Please input at least one link";
    }
    const invalidLinks = currentLinks.some((link) => {
      if (!link) return true;
      return !validateURL(link);
    });

    if (invalidLinks) {
      return "Please enter a valid URL";
    }
    return null;
  };

  const submitForm = async () => {
    const isValid = validateAllFields({
      resourceTitleEnglish: validateRequired,
      resourceTitleQanjobal: validateRequired,
      audioFile: validateFileSize(30),
      topicDropdownIndex: validateRequired,
      videoLinks: validateAll,
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
          urls: fields.videoLinks.value,
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

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...fields.videoLinks.value];
    newLinks[index] = value;
    setFieldValue("videoLinks", newLinks);
  };

  const handleAddLink = () => {
    setFieldValue("videoLinks", [...fields.videoLinks.value, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = fields.videoLinks.value.filter((_, i) => i !== index);
    setFieldValue("videoLinks", newLinks.length ? newLinks : [""]);
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
      <FormField title="Video link" defaultClassName="max-w-[918px]" required>
        {(props) => (
          <>
            {fields.videoLinks.value.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <div className="flex-1">
                  <TextInput
                    id={`video-input-${index}`}
                    value={link}
                    onChange={(val) => handleLinkChange(index, val)}
                    className="w-full h-[46px]"
                    state={fields.videoLinks.state}
                  />
                </div>
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  type="button"
                  title="Remove link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddLink}
              className="flex items-center text-sm text-jila-400 hover:text-jila-300 font-medium mt-1 w-fit"
              type="button"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add another link
            </button>
          </>
        )}
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
