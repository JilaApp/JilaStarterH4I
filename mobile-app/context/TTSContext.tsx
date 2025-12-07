import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { trpc } from "@/lib/trpc";

interface TTSContextType {
  ttsEnabled: boolean;
  toggleTTS: () => void;
  isLoading: boolean;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [ttsEnabled, setTtsEnabled] = useState(false);

  // Get TTS preference from backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    data: ttsData,
    isLoading,
    error,
  } = (trpc as any).user.getTTSPreference.useQuery(undefined, {
    enabled: isLoaded && !!user,
    retry: 1,
  }) as {
    data: { ttsEnabled: boolean } | undefined;
    isLoading: boolean;
    error: unknown;
  };

  // Update TTS preference on backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTTSMutation = (trpc as any).user.updateTTSPreference.useMutation({
    onSuccess: (data: { ttsEnabled: boolean }) => {
      setTtsEnabled(data.ttsEnabled);
      console.log("TTS updated successfully:", data.ttsEnabled);
    },
    onError: (error: unknown) => {
      console.error("Failed to update TTS:", error);
      // Revert the optimistic update on error
      setTtsEnabled(!ttsEnabled);
    },
  });

  useEffect(() => {
    if (ttsData) {
      setTtsEnabled(ttsData.ttsEnabled);
      console.log("TTS preference loaded:", ttsData.ttsEnabled);
    }
  }, [ttsData]);

  useEffect(() => {
    if (error) {
      console.error("Failed to load TTS preference:", error);
    }
  }, [error]);

  const toggleTTS = () => {
    console.log("Toggling TTS from", ttsEnabled, "to", !ttsEnabled);
    const newValue = !ttsEnabled;
    // Optimistically update the UI
    setTtsEnabled(newValue);
    // Update on backend
    updateTTSMutation.mutate({ ttsEnabled: newValue });
  };

  return (
    <TTSContext.Provider
      value={{ ttsEnabled, toggleTTS, isLoading: isLoading || !isLoaded }}
    >
      {children}
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
}
