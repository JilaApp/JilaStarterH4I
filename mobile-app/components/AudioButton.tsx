import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import {
  Audio,
  AVPlaybackSource,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
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
  audioSource?: AVPlaybackSource;
  variant?: "default" | "light";
  disabled?: boolean;
  onPress?: () => void;
  alwaysShow?: boolean;
};

export interface AudioButtonHandle {
  playSound: (audio: AVPlaybackSource) => Promise<void>;
  stop: () => Promise<void>;
}

const AudioButton = forwardRef<AudioButtonHandle, AudioButtonProps>(
  ({ audioSource, onPress, disabled = false, alwaysShow = false }, ref) => {
    const { ttsEnabled } = useTTS();
    const soundRef = useRef<Audio.Sound | null>(null);
    const playingRef = useRef(false);
    const [variant, setVariant] = useState<"default" | "playing" | "disabled">(
      "default",
    );

    const setupAudioMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
    };

    const playCustomSound = async (audio: AVPlaybackSource): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          await setupAudioMode();

          if (playingRef.current && soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            playingRef.current = false;
            setVariant("default");
          }

          const { sound } = await Audio.Sound.createAsync(audio, {
            shouldPlay: true,
          });

          soundRef.current = sound;
          playingRef.current = true;
          setVariant("playing");

          sound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) return;
            if (status.didJustFinish) {
              playingRef.current = false;
              sound.unloadAsync();
              resolve();
            }
          });

          await sound.playAsync();
        } catch (error) {
          console.error("Error playing sound:", error);
          playingRef.current = false;
          setVariant("default");
          reject(error);
        }
      });
    };

    const stopSound = async () => {
      if (playingRef.current && soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        playingRef.current = false;
      }
      setVariant("default");
    };

    useImperativeHandle(ref, () => ({
      playSound: playCustomSound,
      stop: stopSound,
    }));

    useEffect(() => {
      return soundRef.current
        ? () => {
            console.log("Unloading sound");
            soundRef.current?.unloadAsync();
          }
        : undefined;
    }, []);

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
