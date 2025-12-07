import { TextInput } from "@/components/ui/Input";
import FileUpload from "@/components/forms/FileUpload";
import ParagraphInput from "@/components/forms/ParagraphInput";
import FormField from "@/components/forms/FormField";
import Dropdown from "@/components/ui/Dropdown";
import SubmitButton from "@/components/ui/SubmitButton";
import { trpc } from "@/lib/trpc";
import { VideoTopic } from "@/lib/types";
import {
  VIDEO_TOPIC_DISPLAY_OPTIONS,
  MAX_AUDIO_FILE_SIZE_MB,
} from "@/lib/constants";
import { useForm, createField } from "@/hooks/useForm";
import { useNotification } from "@/hooks/useNotification";
import { useVideoLinks } from "@/hooks/useVideoLinks";
import {
  validateRequired,
  validateURL,
  validateFileSize,
  validateDropdownIndex,
} from "@/lib/validators";
import { Plus, Trash2 } from "lucide-react";
import { logger } from "@/lib/logger";
import {
  getFileUploadState,
  shouldShowSuccessMessage,
} from "@/lib/fileUploadUtils";
import FormError from "@/components/shared/FormError";

export default function VideoUploadForm() {
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
      return validateURL(link) !== null;
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
      audioFile: validateFileSize(MAX_AUDIO_FILE_SIZE_MB),
      topicDropdownIndex: validateDropdownIndex,
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
      } catch (err: any) {
        logger.error("[submitForm] Failed to submit video", err);
        const errorMessage =
          err?.message || "Failed to submit video. Please try again.";
        setFormError(errorMessage);
      }
    };

    reader.readAsDataURL(fields.audioFile.value!);
  };

  const { handleLinkChange, handleAddLink, handleRemoveLink } = useVideoLinks(
    fields.videoLinks.value,
    (links) => setFieldValue("videoLinks", links),
  );

  return (
    <div
      ref={formRef as React.RefObject<HTMLDivElement>}
      className="flex flex-col gap-[26px] py-[30px] px-[35px] rounded-3xl bg-white"
    >
      <div className="h-[60px] font-medium text-2xl">Add new video</div>
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
        description={`Maximum size: ${MAX_AUDIO_FILE_SIZE_MB}MB`}
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
            state={getFileUploadState(
              fields.audioFile.state,
              fields.audioFile.value,
            )}
            showSuccessMessage={shouldShowSuccessMessage(
              fields.audioFile.value,
            )}
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
        defaultClassName="max-w-[918px]"
        required
        state={fields.videoLinks.state}
        errorString={fields.videoLinks.error}
      >
        {(props) => (
          <>
            {fields.videoLinks.value.map((link, index) => (
              <div
                key={`link-${index}-${link}`}
                className="flex gap-2 mb-2 items-center"
              >
                <div className="flex-1">
                  <TextInput
                    id={`video-input-${index}`}
                    value={link}
                    onChange={(val) => handleLinkChange(index, val)}
                    className="w-full h-[60px]"
                    state={fields.videoLinks.state}
                  />
                </div>
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  type="button"
                  title="Remove link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddLink}
              className="flex items-center text-sm text-jila-400 hover:text-jila-300 font-medium mt-1 w-fit cursor-pointer"
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

      {formError && <FormError message={formError} />}

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
