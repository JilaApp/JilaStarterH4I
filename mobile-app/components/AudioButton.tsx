import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useRef, useState } from "react";
import { colors } from "@/colors";

type AudioSource = number | { uri: string };

type AudioButtonProps = {
  audioSource: AudioSource;
  variant?: "default" | "light";
  disabled?: boolean;
};

export default function AudioButton({
  audioSource,
  disabled = false,
}: AudioButtonProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  const [variant, setVariant] = useState<"default" | "playing" | "disabled">(
    "default",
  );

  async function playSound() {
    // await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });

    if (playingRef.current && soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      playingRef.current = false;
      setVariant("default");
      return;
    }

    const { sound } = await Audio.Sound.createAsync(audioSource, {
      shouldPlay: true,
    });

    soundRef.current = sound;
    playingRef.current = true;
    setVariant("playing");

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        playingRef.current = false;
        setVariant("default");
        sound.unloadAsync();
      }
    });

    await sound.playAsync();
  }

  const getBackgroundColor = () => {
    if (disabled) return colors.gray[300];
    if (variant === "playing") return colors.jila[400];
    return colors.jila[300];
  };

  return (
    <TouchableOpacity
      onPress={playSound}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <View
        style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      >
        <Volume2 size={11} color={colors.white[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
