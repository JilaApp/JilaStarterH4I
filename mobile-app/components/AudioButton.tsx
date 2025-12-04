import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Volume2 } from "lucide-react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useState, useEffect } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    console.log("[AudioButton] Audio source:", audioSource);
    console.log("[AudioButton] Player status:", {
      isLoaded: status.isLoaded,
      playing: status.playing,
      error: status.error,
    });
  }, [audioSource, status.isLoaded, status.playing, status.error]);

  useEffect(() => {
    setIsPlaying(status.playing);
  }, [status.playing]);

  function playSound() {
    console.log("[AudioButton] playSound called, isLoaded:", status.isLoaded);
    if (!status.isLoaded) {
      console.log("[AudioButton] Audio not loaded yet");
      return;
    }
    if (status.playing) {
      console.log("[AudioButton] Pausing audio");
      player.pause();
    } else {
      console.log("[AudioButton] Playing audio");
      player.play();
    }
  }

  const getBackgroundColor = () => {
    if (disabled) return colors.gray[300];
    if (isPlaying) return colors.jila[400];
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
        <Volume2 size={sizes.icon.xs} color={colors.white[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: sizes.icon.md,
    height: sizes.icon.md,
    borderRadius: sizes.icon.md / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
