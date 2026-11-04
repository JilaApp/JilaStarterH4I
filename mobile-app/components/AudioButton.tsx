import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import {
  AudioPlayer,
  AudioSource,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { useTTS } from "@/context/TTSContext";

type AudioButtonProps = {
  audioSource?: AudioSource;
  variant?: "default" | "light";
  disabled?: boolean;
  onPress?: () => void;
  alwaysShow?: boolean;
};

export interface AudioButtonHandle {
  playSound: (audio: AudioSource) => Promise<void>;
  stop: () => Promise<void>;
}

const AudioButton = forwardRef<AudioButtonHandle, AudioButtonProps>(
  ({ audioSource, onPress, disabled = false, alwaysShow = false }, ref) => {
    const { ttsEnabled } = useTTS();
    const playerRef = useRef<AudioPlayer | null>(null);
    const subscriptionRef = useRef<{ remove: () => void } | null>(null);
    const playingRef = useRef(false);
    const [variant, setVariant] = useState<"default" | "playing" | "disabled">(
      "default",
    );

    const setupAudioMode = async () => {
      await setAudioModeAsync({
        allowsRecording: false,
        shouldPlayInBackground: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
        interruptionModeAndroid: "doNotMix",
      });
    };

    // Stops and frees the current player, if any.
    const releasePlayer = () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
      playingRef.current = false;
    };

    // Resolves when the clip finishes playing (TTSController awaits this to
    // play items in sequence).
    const playCustomSound = async (audio: AudioSource): Promise<void> => {
      try {
        await setupAudioMode();
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }

      if (playerRef.current) {
        releasePlayer();
        setVariant("default");
      }

      return new Promise((resolve, reject) => {
        try {
          const player = createAudioPlayer(audio);
          playerRef.current = player;
          playingRef.current = true;
          setVariant("playing");

          subscriptionRef.current = player.addListener(
            "playbackStatusUpdate",
            (status) => {
              if (!status.didJustFinish) return;
              if (playerRef.current === player) releasePlayer();
              resolve();
            },
          );

          player.play();
        } catch (error) {
          console.error("Error playing sound:", error);
          releasePlayer();
          setVariant("default");
          reject(error);
        }
      });
    };

    const stopSound = async () => {
      releasePlayer();
      setVariant("default");
    };

    useImperativeHandle(ref, () => ({
      playSound: playCustomSound,
      stop: stopSound,
    }));

    // Free the native player when the button unmounts.
    useEffect(() => releasePlayer, []);

    const handlePress = async () => {
      if (onPress) {
        onPress();
        return;
      }

      if (audioSource) {
        await playCustomSound(audioSource);
        await stopSound();
      }
    };

    const getBackgroundColor = () => {
      if (disabled) return colors.gray[300];
      if (variant === "playing") return colors.jila[400];
      return colors.jila[300];
    };

    // Don't render if TTS is disabled or no audio source (when not using external control via ref)
    // Unless alwaysShow is true
    if (!alwaysShow && (!ttsEnabled || (!audioSource && !ref))) {
      return null;
    }

    return (
      <TouchableOpacity onPress={handlePress} disabled={disabled}>
        <View
          style={[styles.container, { backgroundColor: getBackgroundColor() }]}
        >
          <Volume2 size={sizes.icon.xs} color={colors.white[400]} />
        </View>
      </TouchableOpacity>
    );
  },
);

AudioButton.displayName = "AudioButton";

const styles = StyleSheet.create({
  container: {
    width: sizes.icon.md,
    height: sizes.icon.md,
    borderRadius: sizes.icon.md / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioButton;
