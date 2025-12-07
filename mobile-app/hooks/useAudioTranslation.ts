import { useUser } from "@clerk/clerk-expo";
import {
  audioTranslations,
  TranslationKey,
} from "@/constants/audioTranslations";
import { useEffect, useState, useCallback } from "react";

type AudioSource = number | { uri: string } | null;

export function useAudioTranslation() {
  const { user } = useUser();
  const [ttsEnabled, setTtsEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      // Check unsafeMetadata for ttsEnabled flag
      // Note: This assumes the metadata is updated and available on the user object
      const enabled = user.unsafeMetadata?.ttsEnabled as boolean;
      setTtsEnabled(!!enabled);
    }
  }, [user]);

  const getAudioSource = useCallback(
    (keyOrUrl?: TranslationKey | string | null): AudioSource => {
      if (!keyOrUrl) return null;

      // Check if it's a static key
      if (keyOrUrl in audioTranslations) {
        const key = keyOrUrl as TranslationKey;
        // Default to qanjobal for now as the primary translation target,
        // or logic to select language can be added here if we track language preference in a way accessible here
        // For now, let's assume we want the qanjobal version if available, or english
        // But actually, the requirement is usually to play the audio for the *current* language or specific target
        // Let's return the qanjobal version by default for "translation" purposes
        return audioTranslations[key].qanjobal;
      }

      // Assume it's a URL (S3 or other)
      if (
        typeof keyOrUrl === "string" &&
        (keyOrUrl.startsWith("http") || keyOrUrl.startsWith("file"))
      ) {
        return { uri: keyOrUrl };
      }

      console.log("getAudioSource: No matching source found for", keyOrUrl);
      return null;
    },
    [],
  );

  return {
    ttsEnabled,
    getAudioSource,
  };
}
